"""
FastAPI skeleton implementing docs/api/openapi.yaml.

    pip install "fastapi[standard]" pydantic
    uvicorn main:app --reload --port 8000

Then run the frontend with VITE_API_BASE_URL=http://localhost:8000
"""

from __future__ import annotations

import time
from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

# --------------------------------------------------------------------------- #
# Pricing rules — mirror of src/lib/api/pricing.ts. Keep both in sync.
# --------------------------------------------------------------------------- #

FREE_SHIPPING_THRESHOLD = 150_000
FLAT_SHIPPING = 8_000
COUPONS: dict[str, float] = {"AURA10": 0.10, "AURA20": 0.20}


def shipping_for(subtotal: int) -> int:
    if subtotal <= 0 or subtotal > FREE_SHIPPING_THRESHOLD:
        return 0
    return FLAT_SHIPPING


def quote_cart(lines: list[tuple[int, int]], coupon_code: str | None) -> "CartQuote":
    """lines: list of (unit_price, quantity)."""
    subtotal = sum(price * qty for price, qty in lines)
    normalized = (coupon_code or "").strip().upper()
    rate = COUPONS.get(normalized, 0.0)
    discount = round(subtotal * rate)
    shipping = shipping_for(subtotal)
    return CartQuote(
        currency="NGN",
        subtotal=subtotal,
        discount=discount,
        shipping=shipping,
        total=max(0, subtotal - discount) + shipping,
        coupon_applied=normalized if rate > 0 else None,
        coupon_valid=True if not normalized else rate > 0,
    )


# --------------------------------------------------------------------------- #
# Wire models (snake_case — exactly what the frontend expects)
# --------------------------------------------------------------------------- #

ProductCategory = Literal["Serums", "Cleansers", "Moisturizers", "Sunscreen", "Body"]
ServiceCategory = Literal["Skincare", "Massage", "Nails", "Hair", "Treatments"]


class Product(BaseModel):
    id: str
    name: str
    tagline: str
    price: int
    rating: float
    review_count: int
    category: ProductCategory
    image_url: str
    gallery_urls: list[str] = []
    description: str
    ingredients: list[str] = []
    directions: str


class Service(BaseModel):
    id: str
    name: str
    category: ServiceCategory
    duration_minutes: int
    price: int
    description: str


class Staff(BaseModel):
    id: str
    name: str
    role: str
    specialties: list[ServiceCategory]
    image_url: str


class TimeSlot(BaseModel):
    time: str
    available: bool


class CartLine(BaseModel):
    product_id: str
    quantity: int = Field(ge=1, le=99)


class CartQuoteRequest(BaseModel):
    lines: list[CartLine]
    coupon_code: str | None = None


class CartQuote(BaseModel):
    currency: Literal["NGN"]
    subtotal: int
    discount: int
    shipping: int
    total: int
    coupon_applied: str | None
    coupon_valid: bool


class Customer(BaseModel):
    name: str
    email: EmailStr
    phone: str


class ShippingAddress(BaseModel):
    address: str
    city: str
    state: str | None = None
    postal_code: str | None = None
    country: str


class OrderRequest(BaseModel):
    customer: Customer
    shipping: ShippingAddress
    lines: list[CartLine] = Field(min_length=1)
    coupon_code: str | None = None
    payment_method: Literal["card", "bank_transfer", "mobile_money"]


class Order(BaseModel):
    id: str
    status: Literal["pending", "processing", "delivered", "cancelled"]
    customer: Customer
    quote: CartQuote
    created_at: datetime


class BookingRequest(BaseModel):
    service_id: str
    staff_id: str
    date: str
    time: str
    customer: Customer
    notes: str | None = None


class Booking(BaseModel):
    id: str
    status: Literal["confirmed", "cancelled", "completed"]
    service_id: str
    service_name: str
    price: int
    duration_minutes: int
    staff_id: str
    staff_name: str
    date: str
    time: str
    customer: Customer
    created_at: datetime


# --------------------------------------------------------------------------- #
# Replace these in-memory stores with PostgreSQL queries.
# --------------------------------------------------------------------------- #

PRODUCTS: list[Product] = []
SERVICES: list[Service] = []
STAFF: list[Staff] = []
BUSINESS_HOURS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
ORDERS: list[Order] = []
BOOKINGS: list[Booking] = []

app = FastAPI(title="L'AURA Platform API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # add your deployed frontend origin
    allow_methods=["*"],
    allow_headers=["*"],
)


def now() -> datetime:
    return datetime.now(timezone.utc)


@app.get("/v1/products", response_model=list[Product])
def list_products(category: ProductCategory | None = None):
    return [p for p in PRODUCTS if category is None or p.category == category]


@app.get("/v1/products/{product_id}", response_model=Product)
def get_product(product_id: str):
    for p in PRODUCTS:
        if p.id == product_id:
            return p
    raise HTTPException(404, detail={"error": "not_found", "message": "Product not found."})


@app.get("/v1/services", response_model=list[Service])
def list_services(category: ServiceCategory | None = None):
    return [s for s in SERVICES if category is None or s.category == category]


@app.get("/v1/staff", response_model=list[Staff])
def list_staff(specialty: ServiceCategory | None = None):
    return [s for s in STAFF if specialty is None or specialty in s.specialties]


@app.get("/v1/availability", response_model=list[TimeSlot])
def list_availability(service_id: str, date: str, staff_id: str | None = None):
    taken = {
        b.time
        for b in BOOKINGS
        if b.date == date and b.status == "confirmed" and (staff_id is None or b.staff_id == staff_id)
    }
    return [TimeSlot(time=t, available=t not in taken) for t in BUSINESS_HOURS]


def price_of(product_id: str) -> int:
    for p in PRODUCTS:
        if p.id == product_id:
            return p.price
    raise HTTPException(422, detail={"error": "unknown_product", "message": f"Unknown product {product_id}."})


@app.post("/v1/cart/quote", response_model=CartQuote)
def post_cart_quote(payload: CartQuoteRequest):
    return quote_cart([(price_of(l.product_id), l.quantity) for l in payload.lines], payload.coupon_code)


@app.post("/v1/orders", response_model=Order, status_code=201)
def post_order(payload: OrderRequest):
    quote = quote_cart([(price_of(l.product_id), l.quantity) for l in payload.lines], payload.coupon_code)
    order = Order(
        id=f"AUR-{int(time.time() * 1000):X}",
        status="pending",
        customer=payload.customer,
        quote=quote,
        created_at=now(),
    )
    ORDERS.append(order)  # TODO: persist + trigger payment (Paystack/Flutterwave) + receipt email
    return order


@app.post("/v1/bookings", response_model=Booking, status_code=201)
def post_booking(payload: BookingRequest):
    service = next((s for s in SERVICES if s.id == payload.service_id), None)
    member = next((s for s in STAFF if s.id == payload.staff_id), None)
    if service is None or member is None:
        raise HTTPException(404, detail={"error": "not_found", "message": "Service or specialist not found."})

    clash = any(
        b.staff_id == payload.staff_id
        and b.date == payload.date
        and b.time == payload.time
        and b.status == "confirmed"
        for b in BOOKINGS
    )
    if clash:
        raise HTTPException(409, detail={"error": "slot_taken", "message": "That slot was just booked."})

    booking = Booking(
        id=f"bk_{int(time.time() * 1000):x}",
        status="confirmed",
        service_id=service.id,
        service_name=service.name,
        price=service.price,
        duration_minutes=service.duration_minutes,
        staff_id=member.id,
        staff_name=member.name,
        date=payload.date,
        time=payload.time,
        customer=payload.customer,
        created_at=now(),
    )
    BOOKINGS.append(booking)  # TODO: persist + send confirmation email
    return booking


@app.get("/v1/bookings", response_model=list[Booking])
def get_bookings(email: str = Query(...)):
    return [b for b in BOOKINGS if b.customer.email.lower() == email.lower()]
