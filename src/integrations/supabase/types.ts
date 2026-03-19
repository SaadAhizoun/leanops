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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          active: boolean | null
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      assessment_questions: {
        Row: {
          assessment_id: string
          category: string | null
          created_at: string | null
          id: string
          question: string
          sort_order: number | null
        }
        Insert: {
          assessment_id: string
          category?: string | null
          created_at?: string | null
          id?: string
          question: string
          sort_order?: number | null
        }
        Update: {
          assessment_id?: string
          category?: string | null
          created_at?: string | null
          id?: string
          question?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_results: {
        Row: {
          answers: Json
          assessment_id: string
          created_at: string | null
          id: string
          interpretation: string | null
          max_score: number | null
          percentage: number | null
          recommendations: string | null
          total_score: number | null
          user_id: string
        }
        Insert: {
          answers?: Json
          assessment_id: string
          created_at?: string | null
          id?: string
          interpretation?: string | null
          max_score?: number | null
          percentage?: number | null
          recommendations?: string | null
          total_score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          assessment_id?: string
          created_at?: string | null
          id?: string
          interpretation?: string | null
          max_score?: number | null
          percentage?: number | null
          recommendations?: string | null
          total_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      case_actions: {
        Row: {
          blockers: string | null
          case_id: string | null
          completion_pct: number | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          owner_name: string | null
          priority: string | null
          project_id: string | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          blockers?: string | null
          case_id?: string | null
          completion_pct?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          owner_name?: string | null
          priority?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          blockers?: string | null
          case_id?: string | null
          completion_pct?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          owner_name?: string | null
          priority?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_actions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_notes: {
        Row: {
          case_id: string
          content: string
          created_at: string | null
          id: string
          stage: number | null
          user_id: string
        }
        Insert: {
          case_id: string
          content: string
          created_at?: string | null
          id?: string
          stage?: number | null
          user_id: string
        }
        Update: {
          case_id?: string
          content?: string
          created_at?: string | null
          id?: string
          stage?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_notes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          archived: boolean | null
          area: string | null
          business_impact: string | null
          collaborators: string[] | null
          created_at: string | null
          current_stage: number | null
          department: string | null
          due_date: string | null
          id: string
          impact_type: string | null
          impacted_kpi: string | null
          owner_name: string | null
          priority: string | null
          problem_type: string | null
          sector: string | null
          site: string | null
          stage_data: Json | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          archived?: boolean | null
          area?: string | null
          business_impact?: string | null
          collaborators?: string[] | null
          created_at?: string | null
          current_stage?: number | null
          department?: string | null
          due_date?: string | null
          id?: string
          impact_type?: string | null
          impacted_kpi?: string | null
          owner_name?: string | null
          priority?: string | null
          problem_type?: string | null
          sector?: string | null
          site?: string | null
          stage_data?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          archived?: boolean | null
          area?: string | null
          business_impact?: string | null
          collaborators?: string[] | null
          created_at?: string | null
          current_stage?: number | null
          department?: string | null
          due_date?: string | null
          id?: string
          impact_type?: string | null
          impacted_kpi?: string | null
          owner_name?: string | null
          priority?: string | null
          problem_type?: string | null
          sector?: string | null
          site?: string | null
          stage_data?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          read: boolean | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          read?: boolean | null
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean | null
          subject?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledge_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      knowledge_tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      knowledge_topics: {
        Row: {
          category_id: string | null
          checklist: string | null
          common_mistakes: string | null
          created_at: string | null
          id: string
          overview: string | null
          practical_examples: string | null
          published: boolean | null
          related_tools: string | null
          slug: string
          step_by_step: string | null
          title: string
          updated_at: string | null
          when_to_use: string | null
          why_it_matters: string | null
        }
        Insert: {
          category_id?: string | null
          checklist?: string | null
          common_mistakes?: string | null
          created_at?: string | null
          id?: string
          overview?: string | null
          practical_examples?: string | null
          published?: boolean | null
          related_tools?: string | null
          slug: string
          step_by_step?: string | null
          title: string
          updated_at?: string | null
          when_to_use?: string | null
          why_it_matters?: string | null
        }
        Update: {
          category_id?: string | null
          checklist?: string | null
          common_mistakes?: string | null
          created_at?: string | null
          id?: string
          overview?: string | null
          practical_examples?: string | null
          published?: boolean | null
          related_tools?: string | null
          slug?: string
          step_by_step?: string | null
          title?: string
          updated_at?: string | null
          when_to_use?: string | null
          why_it_matters?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_topics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "knowledge_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string | null
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      problem_templates: {
        Row: {
          common_pitfalls: string[] | null
          created_at: string | null
          default_metrics: string[] | null
          description: string | null
          hints: Json | null
          id: string
          name: string
          recommended_sequence: string[] | null
          recommended_tools: string[] | null
          updated_at: string | null
        }
        Insert: {
          common_pitfalls?: string[] | null
          created_at?: string | null
          default_metrics?: string[] | null
          description?: string | null
          hints?: Json | null
          id?: string
          name: string
          recommended_sequence?: string[] | null
          recommended_tools?: string[] | null
          updated_at?: string | null
        }
        Update: {
          common_pitfalls?: string[] | null
          created_at?: string | null
          default_metrics?: string[] | null
          description?: string | null
          hints?: Json | null
          id?: string
          name?: string
          recommended_sequence?: string[] | null
          recommended_tools?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          onboarded: boolean | null
          organization: string | null
          sector: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          onboarded?: boolean | null
          organization?: string | null
          sector?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          onboarded?: boolean | null
          organization?: string | null
          sector?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      project_tasks: {
        Row: {
          assignee: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          project_id: string
          sort_order: number | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assignee?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id: string
          sort_order?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assignee?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string
          sort_order?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          archived: boolean | null
          budget: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          objective: string | null
          owner_name: string | null
          risk_level: string | null
          sponsor: string | null
          start_date: string | null
          status: string | null
          team: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          archived?: boolean | null
          budget?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          objective?: string | null
          owner_name?: string | null
          risk_level?: string | null
          sponsor?: string | null
          start_date?: string | null
          status?: string | null
          team?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          archived?: boolean | null
          budget?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          objective?: string | null
          owner_name?: string | null
          risk_level?: string | null
          sponsor?: string | null
          start_date?: string | null
          status?: string | null
          team?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      toolkits: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          instructions: string | null
          published: boolean | null
          slug: string
          template_schema: Json | null
          title: string
          updated_at: string | null
          what_it_is: string | null
          when_to_use: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          published?: boolean | null
          slug: string
          template_schema?: Json | null
          title: string
          updated_at?: string | null
          what_it_is?: string | null
          when_to_use?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          published?: boolean | null
          slug?: string
          template_schema?: Json | null
          title?: string
          updated_at?: string | null
          what_it_is?: string | null
          when_to_use?: string | null
        }
        Relationships: []
      }
      topic_tag_links: {
        Row: {
          id: string
          tag_id: string
          topic_id: string
        }
        Insert: {
          id?: string
          tag_id: string
          topic_id: string
        }
        Update: {
          id?: string
          tag_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_tag_links_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "knowledge_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_tag_links_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "knowledge_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "user"
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
    Enums: {
      app_role: ["super_admin", "admin", "user"],
    },
  },
} as const
