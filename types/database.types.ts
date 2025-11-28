export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string
          slug: string
          title: string
          short_description: string | null
          long_description: string | null
          price_usd: number
          price_cad: number | null
          price_gbp: number | null
          price_aud: number | null
          price_inr: number | null
          stripe_product_id: string | null
          stripe_price_id_usd: string | null
          stripe_price_id_cad: string | null
          stripe_price_id_gbp: string | null
          stripe_price_id_aud: string | null
          stripe_price_id_inr: string | null
          level: string
          category: string | null
          total_modules: number
          total_hours: number
          featured: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          short_description?: string | null
          long_description?: string | null
          price_usd?: number
          price_cad?: number | null
          price_gbp?: number | null
          price_aud?: number | null
          price_inr?: number | null
          stripe_product_id?: string | null
          stripe_price_id_usd?: string | null
          stripe_price_id_cad?: string | null
          stripe_price_id_gbp?: string | null
          stripe_price_id_aud?: string | null
          stripe_price_id_inr?: string | null
          level?: string
          category?: string | null
          total_modules?: number
          total_hours?: number
          featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          short_description?: string | null
          long_description?: string | null
          price_usd?: number
          price_cad?: number | null
          price_gbp?: number | null
          price_aud?: number | null
          price_inr?: number | null
          stripe_product_id?: string | null
          stripe_price_id_usd?: string | null
          stripe_price_id_cad?: string | null
          stripe_price_id_gbp?: string | null
          stripe_price_id_aud?: string | null
          stripe_price_id_inr?: string | null
          level?: string
          category?: string | null
          total_modules?: number
          total_hours?: number
          featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      course_modules: {
        Row: {
          id: string
          course_id: string
          module_number: number
          title: string
          description: string | null
          content: string | null
          estimated_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          module_number: number
          title: string
          description?: string | null
          content?: string | null
          estimated_minutes?: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          module_number?: number
          title?: string
          description?: string | null
          content?: string | null
          estimated_minutes?: number
          created_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          course_id: string
          module_number: number
          questions: Json
          pass_percentage: number
        }
        Insert: {
          id?: string
          course_id: string
          module_number: number
          questions: Json
          pass_percentage?: number
        }
        Update: {
          id?: string
          course_id?: string
          module_number?: number
          questions?: Json
          pass_percentage?: number
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          course_id: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          amount_paid: number
          currency: string
          status: string
          purchased_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          amount_paid: number
          currency?: string
          status?: string
          purchased_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          amount_paid?: number
          currency?: string
          status?: string
          purchased_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          completed_modules: number[]
          current_module: number
          completion_percentage: number
          started_at: string
          last_accessed: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          completed_modules?: number[]
          current_module?: number
          completion_percentage?: number
          started_at?: string
          last_accessed?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          completed_modules?: number[]
          current_module?: number
          completion_percentage?: number
          started_at?: string
          last_accessed?: string
          completed_at?: string | null
        }
      }
      quiz_results: {
        Row: {
          id: string
          user_id: string
          course_id: string
          module_number: number
          score: number
          total_questions: number
          percentage: number
          passed: boolean
          answers: Json
          attempt_number: number
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          module_number: number
          score: number
          total_questions: number
          percentage: number
          passed: boolean
          answers: Json
          attempt_number?: number
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          module_number?: number
          score?: number
          total_questions?: number
          percentage?: number
          passed?: boolean
          answers?: Json
          attempt_number?: number
          completed_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          user_id: string
          course_id: string
          certificate_number: string
          student_name: string
          course_title: string
          pdf_url: string | null
          issued_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          certificate_number: string
          student_name: string
          course_title: string
          pdf_url?: string | null
          issued_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          certificate_number?: string
          student_name?: string
          course_title?: string
          pdf_url?: string | null
          issued_at?: string
        }
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
  }
}
