export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      call_history: {
        Row: {
          call_successful: boolean | null
          created_at: string
          data_collection_results: Json | null
          duration: number
          elevenlabs_conversation_id: string | null
          elevenlabs_recording_url: string | null
          evaluation_criteria_results: Json | null
          id: string
          recording_url: string | null
          scenario_id: string
          transcript: string | null
          transcript_summary: string | null
          user_id: string | null
        }
        Insert: {
          call_successful?: boolean | null
          created_at?: string
          data_collection_results?: Json | null
          duration: number
          elevenlabs_conversation_id?: string | null
          elevenlabs_recording_url?: string | null
          evaluation_criteria_results?: Json | null
          id?: string
          recording_url?: string | null
          scenario_id: string
          transcript?: string | null
          transcript_summary?: string | null
          user_id?: string | null
        }
        Update: {
          call_successful?: boolean | null
          created_at?: string
          data_collection_results?: Json | null
          duration?: number
          elevenlabs_conversation_id?: string | null
          elevenlabs_recording_url?: string | null
          evaluation_criteria_results?: Json | null
          id?: string
          recording_url?: string | null
          scenario_id?: string
          transcript?: string | null
          transcript_summary?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_call_history_scenario"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      personas: {
        Row: {
          appearance: string
          avatar_url: string | null
          background: string
          company: string
          created_at: string
          first_message: string
          id: string
          name: string
          personality: string
          prompt: string
          role: string
          updated_at: string
          voice_id: string
        }
        Insert: {
          appearance: string
          avatar_url?: string | null
          background: string
          company: string
          created_at?: string
          first_message: string
          id?: string
          name: string
          personality: string
          prompt: string
          role: string
          updated_at?: string
          voice_id: string
        }
        Update: {
          appearance?: string
          avatar_url?: string | null
          background?: string
          company?: string
          created_at?: string
          first_message?: string
          id?: string
          name?: string
          personality?: string
          prompt?: string
          role?: string
          updated_at?: string
          voice_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          id: string
          industry: string | null
          name: string | null
          product_description: string | null
          product_name: string | null
          role: string | null
          target_market: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id: string
          industry?: string | null
          name?: string | null
          product_description?: string | null
          product_name?: string | null
          role?: string | null
          target_market?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name?: string | null
          product_description?: string | null
          product_name?: string | null
          role?: string | null
          target_market?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      scenarios: {
        Row: {
          category: string
          created_at: string
          description: string
          difficulty: string
          id: string
          persona_id: string
          scenario_id: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          difficulty: string
          id?: string
          persona_id: string
          scenario_id: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          difficulty?: string
          id?: string
          persona_id?: string
          scenario_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenarios_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
