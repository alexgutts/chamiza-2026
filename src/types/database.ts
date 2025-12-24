export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      recommendations: {
        Row: {
          id: string;
          author_name: string;
          title: string;
          description: string;
          link: string | null;
          type: string;
          price_range: string | null;
          address: string | null;
          lat: number | null;
          lng: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          title: string;
          description: string;
          link?: string | null;
          type: string;
          price_range?: string | null;
          address?: string | null;
          lat?: number | null;
          lng?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          title?: string;
          description?: string;
          link?: string | null;
          type?: string;
          price_range?: string | null;
          address?: string | null;
          lat?: number | null;
          lng?: number | null;
          created_at?: string;
        };
      };
      plans: {
        Row: {
          id: string;
          author_name: string;
          title: string;
          description: string;
          date: string;
          time: string | null;
          location: string | null;
          lat: number | null;
          lng: number | null;
          max_participants: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          title: string;
          description: string;
          date: string;
          time?: string | null;
          location?: string | null;
          lat?: number | null;
          lng?: number | null;
          max_participants?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          title?: string;
          description?: string;
          date?: string;
          time?: string | null;
          location?: string | null;
          lat?: number | null;
          lng?: number | null;
          max_participants?: number | null;
          created_at?: string;
        };
      };
      plan_participants: {
        Row: {
          id: string;
          plan_id: string;
          participant_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          participant_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          participant_name?: string;
          created_at?: string;
        };
      };
      places: {
        Row: {
          id: string;
          name: string;
          address: string;
          category: string;
          lat: number;
          lng: number;
          google_place_id: string | null;
          added_by: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          category: string;
          lat: number;
          lng: number;
          google_place_id?: string | null;
          added_by: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          category?: string;
          lat?: number;
          lng?: number;
          google_place_id?: string | null;
          added_by?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      gallery_images: {
        Row: {
          id: string;
          image_url: string;
          caption: string | null;
          uploaded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          caption?: string | null;
          uploaded_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          caption?: string | null;
          uploaded_by?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
