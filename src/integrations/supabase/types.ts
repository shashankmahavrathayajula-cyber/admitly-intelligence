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
      essay_analyses: {
        Row: {
          created_at: string | null
          essay_type: string | null
          id: string
          result: Json | null
          school_name: string | null
          university_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          essay_type?: string | null
          id?: string
          result?: Json | null
          school_name?: string | null
          university_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          essay_type?: string | null
          id?: string
          result?: Json | null
          school_name?: string | null
          university_name?: string
          user_id?: string
        }
        Relationships: []
      }
      evaluation_cache: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          payload_hash: string
          result: Json
          university_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          payload_hash: string
          result: Json
          university_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          payload_hash?: string
          result?: Json
          university_name?: string
          user_id?: string
        }
        Relationships: []
      }
      evaluation_results: {
        Row: {
          academic_strength: number
          activity_impact: number
          alignment_score: number
          band: string | null
          band_reasoning: string | null
          core_insight: string | null
          created_at: string | null
          evaluation_id: string
          honors_awards: number
          id: string
          institutional_fit: number
          most_important_next_step: string | null
          narrative_strength: number
          strengths: Json | null
          suggestions: Json | null
          university_name: string
          weaknesses: Json | null
        }
        Insert: {
          academic_strength: number
          activity_impact: number
          alignment_score: number
          band?: string | null
          band_reasoning?: string | null
          core_insight?: string | null
          created_at?: string | null
          evaluation_id: string
          honors_awards: number
          id?: string
          institutional_fit: number
          most_important_next_step?: string | null
          narrative_strength: number
          strengths?: Json | null
          suggestions?: Json | null
          university_name: string
          weaknesses?: Json | null
        }
        Update: {
          academic_strength?: number
          activity_impact?: number
          alignment_score?: number
          band?: string | null
          band_reasoning?: string | null
          core_insight?: string | null
          created_at?: string | null
          evaluation_id?: string
          honors_awards?: number
          id?: string
          institutional_fit?: number
          most_important_next_step?: string | null
          narrative_strength?: number
          strengths?: Json | null
          suggestions?: Json | null
          university_name?: string
          weaknesses?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_results_evaluation_id_fkey"
            columns: ["evaluation_id"]
            isOneToOne: false
            referencedRelation: "evaluations"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluations: {
        Row: {
          application_snapshot: Json
          created_at: string | null
          id: string
          universities: string[]
          user_id: string
        }
        Insert: {
          application_snapshot: Json
          created_at?: string | null
          id?: string
          universities: string[]
          user_id: string
        }
        Update: {
          application_snapshot?: Json
          created_at?: string | null
          id?: string
          universities?: string[]
          user_id?: string
        }
        Relationships: []
      }
      gap_analyses: {
        Row: {
          created_at: string | null
          id: string
          result: Json | null
          timeline_stage: string | null
          university_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          result?: Json | null
          timeline_stage?: string | null
          university_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          result?: Json | null
          timeline_stage?: string | null
          university_name?: string
          user_id?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          current_uses: number | null
          expires_at: string
          id: string
          max_uses: number | null
          tier: string
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          current_uses?: number | null
          expires_at: string
          id?: string
          max_uses?: number | null
          tier?: string
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          current_uses?: number | null
          expires_at?: string
          id?: string
          max_uses?: number | null
          tier?: string
        }
        Relationships: []
      }
      school_requests: {
        Row: {
          created_at: string | null
          id: string
          school_name: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          school_name: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          school_name?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          expires_at: string | null
          id: string
          purchased_at: string | null
          stripe_customer_id: string | null
          stripe_session_id: string | null
          tier: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          id?: string
          purchased_at?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          tier?: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          id?: string
          purchased_at?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          tier?: string
          user_id?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          created_at: string | null
          description: string
          id: string
          page_url: string | null
          status: string | null
          subject: string | null
          type: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          page_url?: string | null
          status?: string | null
          subject?: string | null
          type: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          page_url?: string | null
          status?: string | null
          subject?: string | null
          type?: string
          user_email?: string | null
          user_id?: string | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
