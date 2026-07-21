export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  rating: number;
  reviews: number;
  category: "Serums" | "Cleansers" | "Moisturizers" | "Sunscreen" | "Body";
  image: string;
  gallery: string[];
  description: string;
  ingredients: string[];
  directions: string;
};

// Unsplash imagery — free to use, tuned to a warm, editorial beauty aesthetic.
const U = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const products: Product[] = [
  {
    id: "ceramide-infusion",
    name: "Ceramide Infusion",
    tagline: "Restorative Serum",
    price: 82,
    rating: 4.9,
    reviews: 48,
    category: "Serums",
    image: U("photo-1611930022073-b7a4ba5fcccd"),
    gallery: [U("photo-1611930022073-b7a4ba5fcccd", 1400), U("photo-1556228720-195a672e8a03", 1400)],
    description:
      "A weightless, ceramide-rich serum that reinforces the skin barrier and restores luminosity. Formulated for daily use, morning and night.",
    ingredients: ["Ceramide NP", "Squalane", "Bakuchiol", "Panthenol", "Sodium Hyaluronate"],
    directions:
      "Apply 3–4 drops onto clean skin after toning. Press gently into face and neck. Follow with moisturizer.",
  },
  {
    id: "silk-cleanse",
    name: "Silk Cleanse",
    tagline: "Botanical Wash",
    price: 45,
    rating: 4.8,
    reviews: 112,
    category: "Cleansers",
    image: U("photo-1556228578-8c89e6adf883"),
    gallery: [U("photo-1556228578-8c89e6adf883", 1400)],
    description:
      "A gentle, sulfate-free gel cleanser with silk amino acids and white tea. Lifts impurities without stripping.",
    ingredients: ["Silk Amino Acids", "White Tea Extract", "Glycerin", "Coco-Betaine"],
    directions: "Massage a small amount into damp skin. Rinse with lukewarm water. Use morning and evening.",
  },
  {
    id: "moonlight-resilience",
    name: "Moonlight Resilience",
    tagline: "Night Serum",
    price: 88,
    rating: 5.0,
    reviews: 63,
    category: "Serums",
    image: U("photo-1620916566398-39f1143ab7be"),
    gallery: [U("photo-1620916566398-39f1143ab7be", 1400)],
    description:
      "Overnight recovery concentrate with encapsulated retinal and peptides. Wake to smoother, denser skin.",
    ingredients: ["Encapsulated Retinal", "Copper Peptides", "Niacinamide", "Squalane"],
    directions: "Apply 2–3 drops in the evening on alternate nights, gradually increasing to nightly use.",
  },
  {
    id: "cloud-barrier",
    name: "Cloud Barrier",
    tagline: "Restorative Balm",
    price: 64,
    rating: 4.9,
    reviews: 89,
    category: "Moisturizers",
    image: U("photo-1601049541289-9b1b7bbbfe19"),
    gallery: [U("photo-1601049541289-9b1b7bbbfe19", 1400)],
    description:
      "A cushioning ceramide balm that locks in hydration and calms sensitivity. Wraps skin in a soft, breathable veil.",
    ingredients: ["Ceramide Complex", "Shea Butter", "Centella Asiatica", "Beta-Glucan"],
    directions: "Warm a pea-sized amount between fingertips and press into skin as the last step of your routine.",
  },
  {
    id: "verdant-mist",
    name: "Verdant Mist",
    tagline: "Hydrating Essence",
    price: 42,
    rating: 4.7,
    reviews: 156,
    category: "Serums",
    image: U("photo-1608248543803-ba4f8c70ae0b"),
    gallery: [U("photo-1608248543803-ba4f8c70ae0b", 1400)],
    description:
      "A refreshing botanical mist to hydrate, tone, and prime. Layer any time skin needs a moment of calm.",
    ingredients: ["Rose Water", "Aloe Vera", "Hyaluronic Acid", "Chamomile"],
    directions: "Mist onto clean skin from 15cm away. Use morning, evening, and throughout the day.",
  },
  {
    id: "solar-veil",
    name: "Solar Veil",
    tagline: "Mineral SPF 50",
    price: 56,
    rating: 4.8,
    reviews: 74,
    category: "Sunscreen",
    image: U("photo-1596462502278-27bfdc403348"),
    gallery: [U("photo-1596462502278-27bfdc403348", 1400)],
    description: "A weightless mineral sunscreen that finishes to an invisible satin veil. No white cast.",
    ingredients: ["Zinc Oxide 22%", "Vitamin E", "Squalane", "Niacinamide"],
    directions: "Apply generously as the final step of your morning routine. Reapply every two hours in the sun.",
  },
  {
    id: "awake-eye-nectar",
    name: "Awake Nectar",
    tagline: "Eye Concentrate",
    price: 76,
    rating: 4.8,
    reviews: 51,
    category: "Serums",
    image: U("photo-1571781926291-c477ebfd024b"),
    gallery: [U("photo-1571781926291-c477ebfd024b", 1400)],
    description: "A cooling eye concentrate with caffeine and peptides. De-puffs and brightens on contact.",
    ingredients: ["Caffeine", "Peptides", "Niacinamide", "Cucumber Extract"],
    directions: "Tap gently around the orbital bone morning and evening.",
  },
  {
    id: "body-elixir",
    name: "Body Elixir",
    tagline: "Cashmere Lotion",
    price: 38,
    rating: 4.9,
    reviews: 203,
    category: "Body",
    image: U("photo-1570194065650-d99fb4bedf0a"),
    gallery: [U("photo-1570194065650-d99fb4bedf0a", 1400)],
    description: "A cashmere-soft body lotion with cold-pressed oils and warm fig blossom.",
    ingredients: ["Fig Blossom", "Marula Oil", "Shea Butter", "Vitamin E"],
    directions: "Massage into damp skin after bathing.",
  },
];

export const productById = (id: string) => products.find((p) => p.id === id);
export const productsByCategory = (category: Product["category"]) =>
  products.filter((p) => p.category === category);
