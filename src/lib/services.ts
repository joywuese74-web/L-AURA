export type Service = {
  id: string;
  name: string;
  category: "Skincare" | "Massage" | "Nails" | "Hair" | "Treatments";
  duration: number; // minutes
  price: number;
  description: string;
};

export const services: Service[] = [
  // Skincare / Treatments
  { id: "sculpting-facial", name: "Advanced Sculpting Facial", category: "Treatments", duration: 75, price: 180, description: "A lifting facial combining microcurrent, lymphatic drainage, and a bespoke serum infusion." },
  { id: "hydrating-facial", name: "Hydrating Glow Facial", category: "Skincare", duration: 60, price: 140, description: "Deep hydration with hyaluronic and peptide infusions. Leaves skin plush and luminous." },
  { id: "chemical-peel", name: "Refining Chemical Peel", category: "Treatments", duration: 45, price: 160, description: "Professional-grade peel to smooth texture and even tone." },
  { id: "acne-treatment", name: "Clarifying Acne Treatment", category: "Skincare", duration: 60, price: 130, description: "Targeted extraction and calming therapy for congested skin." },
  { id: "skin-consult", name: "Bespoke Skin Consultation", category: "Skincare", duration: 30, price: 60, description: "One-on-one consultation with a licensed aesthetician." },

  // Massage
  { id: "swedish-massage", name: "Swedish Massage", category: "Massage", duration: 60, price: 120, description: "A classic full-body Swedish massage." },
  { id: "deep-tissue", name: "Deep Tissue Massage", category: "Massage", duration: 60, price: 140, description: "Focused pressure to release chronic tension." },
  { id: "aromatherapy", name: "Aromatherapy Ritual", category: "Massage", duration: 75, price: 150, description: "Essential-oil blended full-body massage." },
  { id: "hot-stone", name: "Hot Stone Massage", category: "Massage", duration: 75, price: 160, description: "Basalt stone therapy paired with slow, deep strokes." },

  // Nails
  { id: "manicure", name: "Signature Manicure", category: "Nails", duration: 45, price: 55, description: "Precise shaping, cuticle care, and a hand massage." },
  { id: "pedicure", name: "Signature Pedicure", category: "Nails", duration: 60, price: 75, description: "Restorative foot ritual with mineral soak and massage." },
  { id: "gel-polish", name: "Gel Polish Application", category: "Nails", duration: 60, price: 65, description: "Long-wear gel polish in a curated palette." },

  // Hair
  { id: "womens-cut", name: "Signature Cut & Style — Women", category: "Hair", duration: 90, price: 120, description: "Consultation, precision cut, and finishing style." },
  { id: "mens-cut", name: "Signature Cut & Style — Men", category: "Hair", duration: 45, price: 65, description: "Classic or contemporary cut with hot-towel finish." },
  { id: "beard-groom", name: "Beard Grooming", category: "Hair", duration: 30, price: 40, description: "Shape, trim, and condition." },
  { id: "hair-color", name: "Bespoke Coloring", category: "Hair", duration: 150, price: 220, description: "Custom color, gloss, or dimensional highlights." },
  { id: "braiding", name: "Braiding & Protective Styling", category: "Hair", duration: 180, price: 180, description: "Cornrows, box braids, and other protective styles." },
  { id: "wig-install", name: "Wig Installation", category: "Hair", duration: 120, price: 160, description: "Custom wig installation with a natural finish." },
];

export const serviceById = (id: string) => services.find((s) => s.id === id);
export const servicesByCategory = (category: Service["category"]) =>
  services.filter((s) => s.category === category);

export const categoryMeta: Record<Service["category"], { blurb: string; image: string }> = {
  Skincare: { blurb: "Consultative facials and rituals tailored to your skin.", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=80" },
  Treatments: { blurb: "Advanced clinical treatments for meaningful results.", image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1400&q=80" },
  Massage: { blurb: "Bodywork that quiets the nervous system.", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=80" },
  Nails: { blurb: "A quiet room, considered polish, immaculate detail.", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1400&q=80" },
  Hair: { blurb: "Editorial cuts, color, and protective styling.", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=80" },
};
