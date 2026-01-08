export type RecommendationType =
  | "hotel"
  | "airbnb"
  | "restaurante"
  | "cenote"
  | "tour"
  | "actividad"
  | "arqueologia"
  | "transporte"
  | "otro";

export interface Recommendation {
  id: string;
  author_name: string;
  title: string;
  description: string;
  link?: string;
  type: RecommendationType;
  price_range?: "$" | "$$" | "$$$";
  price_info?: string;
  address?: string;
  phone?: string;
  lat?: number;
  lng?: number;
  created_at: string;
}

export interface Plan {
  id: string;
  author_name: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  lat?: number;
  lng?: number;
  max_participants?: number;
  created_at: string;
  plan_participants?: PlanParticipant[];
}

export interface PlanParticipant {
  id: string;
  plan_id: string;
  participant_name: string;
  created_at: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
  google_place_id?: string;
  added_by: string;
  notes?: string;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption?: string;
  uploaded_by: string;
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PublicChatMessage {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
}

export interface GuestConfirmation {
  id: string;
  guest_name: string;
  message?: string;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  first_name: string;
  last_name: string;
  second_last_name?: string;
  mother_id?: string;
  father_id?: string;
  created_at: string;
}
