export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      answers: {
        Row: {
          answer: string
          card_number: number
          card_slug: string
          created_at: string
          id: string
          question: string
          reading_id: string
        }
        Insert: {
          answer?: string
          card_number: number
          card_slug: string
          created_at?: string
          id?: string
          question: string
          reading_id: string
        }
        Update: {
          answer?: string
          card_number?: number
          card_slug?: string
          created_at?: string
          id?: string
          question?: string
          reading_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_reading_id_fkey"
            columns: ["reading_id"]
            isOneToOne: false
            referencedRelation: "readings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          birth_date: string | null
          birth_place: string | null
          birth_time: string | null
          created_at: string
          display_name: string | null
          id: string
          sun_sign: string | null
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          birth_place?: string | null
          birth_time?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          sun_sign?: string | null
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          birth_place?: string | null
          birth_time?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          sun_sign?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      readings: {
        Row: {
          astro: Json | null
          card_image: string | null
          created_at: string
          full_guide: Json | null
          id: string
          summary: Json | null
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          astro?: Json | null
          card_image?: string | null
          created_at?: string
          full_guide?: Json | null
          id?: string
          summary?: Json | null
          tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          astro?: Json | null
          card_image?: string | null
          created_at?: string
          full_guide?: Json | null
          id?: string
          summary?: Json | null
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
