import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Create Supabase client without strict typing for flexibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations
export async function getRecommendations() {
  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addRecommendation(recommendation: {
  author_name: string;
  title: string;
  description: string;
  link?: string;
  type: string;
  price_range?: string;
  address?: string;
  lat?: number;
  lng?: number;
}) {
  const { data, error } = await supabase
    .from("recommendations")
    .insert(recommendation)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPlans() {
  const { data, error } = await supabase
    .from("plans")
    .select(`
      *,
      plan_participants (*)
    `)
    .order("date", { ascending: true });

  if (error) throw error;
  return data;
}

export async function addPlan(plan: {
  author_name: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  lat?: number;
  lng?: number;
  max_participants?: number;
}) {
  const { data, error } = await supabase
    .from("plans")
    .insert(plan)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function joinPlan(planId: string, participantName: string) {
  const { data, error } = await supabase
    .from("plan_participants")
    .insert({ plan_id: planId, participant_name: participantName })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function leavePlan(planId: string, participantName: string) {
  const { error } = await supabase
    .from("plan_participants")
    .delete()
    .eq("plan_id", planId)
    .eq("participant_name", participantName);

  if (error) throw error;
}

export async function getPlaces() {
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addPlace(place: {
  name: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
  google_place_id?: string;
  added_by: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("places")
    .insert(place)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getGalleryImages() {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function uploadImage(
  file: File,
  uploadedBy: string,
  caption?: string
) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("bucket")
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("bucket")
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from("gallery_images")
    .insert({
      image_url: urlData.publicUrl,
      uploaded_by: uploadedBy,
      caption,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
