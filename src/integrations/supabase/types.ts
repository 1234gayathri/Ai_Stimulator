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
      interview_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          feedback: string | null
          id: string
          mode: string
          overall_score: number | null
          resume_analysis_id: string | null
          round_type: string
          signals: Json | null
          status: string
          target_role: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          mode?: string
          overall_score?: number | null
          resume_analysis_id?: string | null
          round_type: string
          signals?: Json | null
          status?: string
          target_role?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          mode?: string
          overall_score?: number | null
          resume_analysis_id?: string | null
          round_type?: string
          signals?: Json | null
          status?: string
          target_role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_sessions_resume_analysis_id_fkey"
            columns: ["resume_analysis_id"]
            isOneToOne: false
            referencedRelation: "resume_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_turns: {
        Row: {
          audio_path: string | null
          content: string
          created_at: string
          id: string
          metrics: Json | null
          role: string
          session_id: string
          turn_index: number
          user_id: string
          video_path: string | null
        }
        Insert: {
          audio_path?: string | null
          content: string
          created_at?: string
          id?: string
          metrics?: Json | null
          role: string
          session_id: string
          turn_index: number
          user_id: string
          video_path?: string | null
        }
        Update: {
          audio_path?: string | null
          content?: string
          created_at?: string
          id?: string
          metrics?: Json | null
          role?: string
          session_id?: string
          turn_index?: number
          user_id?: string
          video_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_turns_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interview_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          completed: boolean
          created_at: string
          difficulty: string
          estimated_weeks: number | null
          id: string
          position: number
          progress_pct: number
          resources: Json
          roadmap_id: string
          title: string
          topics: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          difficulty: string
          estimated_weeks?: number | null
          id?: string
          position: number
          progress_pct?: number
          resources?: Json
          roadmap_id: string
          title: string
          topics?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          difficulty?: string
          estimated_weeks?: number | null
          id?: string
          position?: number
          progress_pct?: number
          resources?: Json
          roadmap_id?: string
          title?: string
          topics?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          headline: string | null
          id: string
          target_role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          headline?: string | null
          id: string
          target_role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          headline?: string | null
          id?: string
          target_role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          employability_score: number | null
          id: string
          is_public: boolean
          payload: Json
          slug: string | null
          target_role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          employability_score?: number | null
          id?: string
          is_public?: boolean
          payload: Json
          slug?: string | null
          target_role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          employability_score?: number | null
          id?: string
          is_public?: boolean
          payload?: Json
          slug?: string | null
          target_role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      resume_analyses: {
        Row: {
          ats_score: number | null
          created_at: string
          gaps: Json
          id: string
          overall_score: number | null
          raw: Json | null
          resume_id: string
          salary_estimate: Json | null
          skills: Json
          strengths: Json
          summary: string | null
          target_role: string | null
          user_id: string
        }
        Insert: {
          ats_score?: number | null
          created_at?: string
          gaps?: Json
          id?: string
          overall_score?: number | null
          raw?: Json | null
          resume_id: string
          salary_estimate?: Json | null
          skills?: Json
          strengths?: Json
          summary?: string | null
          target_role?: string | null
          user_id: string
        }
        Update: {
          ats_score?: number | null
          created_at?: string
          gaps?: Json
          id?: string
          overall_score?: number | null
          raw?: Json | null
          resume_id?: string
          salary_estimate?: Json | null
          skills?: Json
          strengths?: Json
          summary?: string | null
          target_role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_analyses_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      resumes: {
        Row: {
          created_at: string
          extracted_text: string | null
          id: string
          mime_type: string
          original_filename: string
          size_bytes: number
          storage_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          extracted_text?: string | null
          id?: string
          mime_type: string
          original_filename: string
          size_bytes: number
          storage_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          extracted_text?: string | null
          id?: string
          mime_type?: string
          original_filename?: string
          size_bytes?: number
          storage_path?: string
          user_id?: string
        }
        Relationships: []
      }
      roadmaps: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          resume_analysis_id: string | null
          summary: string | null
          target_role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          resume_analysis_id?: string | null
          summary?: string | null
          target_role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          resume_analysis_id?: string | null
          summary?: string | null
          target_role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmaps_resume_analysis_id_fkey"
            columns: ["resume_analysis_id"]
            isOneToOne: false
            referencedRelation: "resume_analyses"
            referencedColumns: ["id"]
          },
        ]
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
