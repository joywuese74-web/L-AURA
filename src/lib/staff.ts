import type { Service } from "./services";
import adaeze from "../assets/staff-adaeze.jpg";
import ngozi from "../assets/staff-ngozi.jpg";

export type Staff = {
  id: string;
  name: string;
  role: string;
  specialties: Service["category"][];
  image: string;
};

export const staff: Staff[] = [
  {
    id: "elena",
    name: "Elena Vance",
    role: "Lead Aesthetician",
    specialties: ["Skincare", "Treatments"],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "marcus",
    name: "Marcus Thorne",
    role: "Senior Stylist",
    specialties: ["Hair"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ngozi",
    name: "Ngozi Okonkwo",
    role: "Nail Artist",
    specialties: ["Nails"],
    image: ngozi,
  },
  {
    id: "adaeze",
    name: "Adaeze Balogun",
    role: "Senior Aesthetician",
    specialties: ["Skincare", "Treatments"],
    image: adaeze,
  },
  {
    id: "amara",
    name: "Amara Chen",
    role: "Massage Therapist",
    specialties: ["Massage"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "julian",
    name: "Julian Reyes",
    role: "Colorist",
    specialties: ["Hair"],
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=800&q=80",
  },
];

export const staffFor = (category: Service["category"]) =>
  staff.filter((s) => s.specialties.includes(category));
