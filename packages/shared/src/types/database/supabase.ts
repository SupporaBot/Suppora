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
      guild_stats: {
        Row: {
          ai_questions_answered: number
          guild_id: string
          tickets_created: number
          tickets_resolved: number
        }
        Insert: {
          ai_questions_answered?: number
          guild_id: string
          tickets_created?: number
          tickets_resolved?: number
        }
        Update: {
          ai_questions_answered?: number
          guild_id?: string
          tickets_created?: number
          tickets_resolved?: number
        }
        Relationships: [
          {
            foreignKeyName: "guild_stats_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: true
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guilds: {
        Row: {
          id: string
          joined_at: string
          name: string
          owner_id: string
        }
        Insert: {
          id: string
          joined_at?: string
          name: string
          owner_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          name?: string
          owner_id?: string
        }
        Relationships: []
      }
      panels: {
        Row: {
          created_at: string
          description: string | null
          extra_actions: Json | null
          form_data: Json | null
          guild_id: string
          id: string
          max_open_user_tickets: number | null
          restrict_creator_roles: string[] | null
          restrict_staff_teams: boolean
          staff_team_ids: string[] | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          extra_actions?: Json | null
          form_data?: Json | null
          guild_id: string
          id?: string
          max_open_user_tickets?: number | null
          restrict_creator_roles?: string[] | null
          restrict_staff_teams?: boolean
          staff_team_ids?: string[] | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          extra_actions?: Json | null
          form_data?: Json | null
          guild_id?: string
          id?: string
          max_open_user_tickets?: number | null
          restrict_creator_roles?: string[] | null
          restrict_staff_teams?: boolean
          staff_team_ids?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "panels_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          discord_access_token: string
          discord_id: string
          discord_refresh_token: string
          discord_tokens_expires_at: string
          id: string
          manageable_guild_ids: string[]
          username: string
        }
        Insert: {
          created_at?: string
          discord_access_token: string
          discord_id: string
          discord_refresh_token: string
          discord_tokens_expires_at: string
          id?: string
          manageable_guild_ids?: string[]
          username: string
        }
        Update: {
          created_at?: string
          discord_access_token?: string
          discord_id?: string
          discord_refresh_token?: string
          discord_tokens_expires_at?: string
          id?: string
          manageable_guild_ids?: string[]
          username?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string
          guild_id: string
          id: string
          role_id_off_call: string | null
          role_id_on_call: string | null
          title: string
        }
        Insert: {
          created_at?: string
          guild_id: string
          id?: string
          role_id_off_call?: string | null
          role_id_on_call?: string | null
          title: string
        }
        Update: {
          created_at?: string
          guild_id?: string
          id?: string
          role_id_off_call?: string | null
          role_id_on_call?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "Teams_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          channel_id: string
          created_at: string
          creator_id: string
          guild_id: string
          id: string
          panel_data: Json | null
          panel_id: string | null
          staff_ids: string[] | null
          status: Database["public"]["Enums"]["Ticket Status"]
          thread_id: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          creator_id: string
          guild_id: string
          id?: string
          panel_data?: Json | null
          panel_id?: string | null
          staff_ids?: string[] | null
          status: Database["public"]["Enums"]["Ticket Status"]
          thread_id: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          creator_id?: string
          guild_id?: string
          id?: string
          panel_data?: Json | null
          panel_id?: string | null
          staff_ids?: string[] | null
          status?: Database["public"]["Enums"]["Ticket Status"]
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_panel_id_fkey"
            columns: ["panel_id"]
            isOneToOne: false
            referencedRelation: "panels"
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
      "Ticket Status": "open" | "ongoing" | "resolved"
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
      "Ticket Status": ["open", "ongoing", "resolved"],
    },
  },
} as const
