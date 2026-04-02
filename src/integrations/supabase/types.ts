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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          app_name: string
          currency: string
          id: string
          logo_url: string | null
          updated_at: string
        }
        Insert: {
          app_name?: string
          currency?: string
          id?: string
          logo_url?: string | null
          updated_at?: string
        }
        Update: {
          app_name?: string
          currency?: string
          id?: string
          logo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          branch: string
          client_name: string
          client_phone: string | null
          created_at: string
          created_by: string | null
          duration_minutes: number
          id: string
          notes: string | null
          service: string
          status: string
          tech_name: string
          updated_at: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          branch?: string
          client_name: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          service: string
          status?: string
          tech_name: string
          updated_at?: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          branch?: string
          client_name?: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          service?: string
          status?: string
          tech_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      branches: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          branch: string
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          branch?: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          branch?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          branch: string
          category: string
          created_at: string
          id: string
          min_stock: number
          name: string
          stock: number
          supplier: string | null
          unit_price: number
          updated_at: string
        }
        Insert: {
          branch?: string
          category?: string
          created_at?: string
          id?: string
          min_stock?: number
          name: string
          stock?: number
          supplier?: string | null
          unit_price?: number
          updated_at?: string
        }
        Update: {
          branch?: string
          category?: string
          created_at?: string
          id?: string
          min_stock?: number
          name?: string
          stock?: number
          supplier?: string | null
          unit_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      inventory_usage: {
        Row: {
          branch: string
          created_at: string
          id: string
          inventory_id: string
          quantity_used: number
          reason: string | null
          used_by: string
        }
        Insert: {
          branch?: string
          created_at?: string
          id?: string
          inventory_id: string
          quantity_used?: number
          reason?: string | null
          used_by: string
        }
        Update: {
          branch?: string
          created_at?: string
          id?: string
          inventory_id?: string
          quantity_used?: number
          reason?: string | null
          used_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_usage_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          branch: string
          created_at: string
          full_name: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          branch?: string
          created_at?: string
          full_name: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          branch?: string
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminder_settings: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          message_template: string
          reminder_type: string
          timing_minutes: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          message_template?: string
          reminder_type: string
          timing_minutes?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          message_template?: string
          reminder_type?: string
          timing_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      saved_reports: {
        Row: {
          created_at: string
          date_range_end: string | null
          date_range_start: string | null
          filters: Json
          id: string
          name: string
          report_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_range_end?: string | null
          date_range_start?: string | null
          filters?: Json
          id?: string
          name: string
          report_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_range_end?: string | null
          date_range_start?: string | null
          filters?: Json
          id?: string
          name?: string
          report_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string
          duration_minutes: number
          id: string
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      staff_schedules: {
        Row: {
          branch: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          start_time: string
          tech_name: string
          updated_at: string
        }
        Insert: {
          branch?: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          start_time: string
          tech_name: string
          updated_at?: string
        }
        Update: {
          branch?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          start_time?: string
          tech_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      time_off_requests: {
        Row: {
          created_at: string
          end_date: string
          id: string
          manager_notes: string | null
          reason: string | null
          start_date: string
          status: string
          tech_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          manager_notes?: string | null
          reason?: string | null
          start_date: string
          status?: string
          tech_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          manager_notes?: string | null
          reason?: string | null
          start_date?: string
          status?: string
          tech_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      walk_ins: {
        Row: {
          arrived_at: string
          branch: string
          client_name: string
          client_phone: string | null
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          service: string
          status: string
          tech_name: string
          updated_at: string
        }
        Insert: {
          arrived_at?: string
          branch?: string
          client_name: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          service: string
          status?: string
          tech_name: string
          updated_at?: string
        }
        Update: {
          arrived_at?: string
          branch?: string
          client_name?: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          service?: string
          status?: string
          tech_name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "branch_manager" | "nail_tech"
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
      app_role: ["admin", "branch_manager", "nail_tech"],
    },
  },
} as const
