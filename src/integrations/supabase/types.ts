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
      activities: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      analytics_data: {
        Row: {
          category: string
          created_at: string | null
          date: string
          id: string
          value: number
        }
        Insert: {
          category: string
          created_at?: string | null
          date: string
          id?: string
          value: number
        }
        Update: {
          category?: string
          created_at?: string | null
          date?: string
          id?: string
          value?: number
        }
        Relationships: []
      }
      appeals: {
        Row: {
          category: string
          content: string | null
          created_at: string | null
          id: string
          priority: string | null
          status: string | null
          submitted_by: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          content?: string | null
          created_at?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          submitted_by?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          submitted_by?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      appointment_slots: {
        Row: {
          created_at: string
          current_appointments: number | null
          date: string
          end_time: string
          id: string
          is_available: boolean | null
          max_appointments: number | null
          specialist_id: string | null
          start_time: string
        }
        Insert: {
          created_at?: string
          current_appointments?: number | null
          date: string
          end_time: string
          id?: string
          is_available?: boolean | null
          max_appointments?: number | null
          specialist_id?: string | null
          start_time: string
        }
        Update: {
          created_at?: string
          current_appointments?: number | null
          date?: string
          end_time?: string
          id?: string
          is_available?: boolean | null
          max_appointments?: number | null
          specialist_id?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_slots_specialist_id_fkey"
            columns: ["specialist_id"]
            isOneToOne: false
            referencedRelation: "specialists"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          id: string
          location: string | null
          notes: string | null
          service_id: string | null
          specialist_name: string | null
          specialist_position: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          service_id?: string | null
          specialist_name?: string | null
          specialist_position?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          service_id?: string | null
          specialist_name?: string | null
          specialist_position?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_reservations: {
        Row: {
          approved_by: string | null
          asset_id: string | null
          created_at: string
          end_date: string
          id: string
          notes: string | null
          purpose: string
          reserved_by: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          asset_id?: string | null
          created_at?: string
          end_date: string
          id?: string
          notes?: string | null
          purpose: string
          reserved_by?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          asset_id?: string | null
          created_at?: string
          end_date?: string
          id?: string
          notes?: string | null
          purpose?: string
          reserved_by?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_reservations_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string
          created_at: string
          file_path: string | null
          file_size: string | null
          file_type: string | null
          id: string
          name: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          category: string
          created_at?: string
          file_path?: string | null
          file_size?: string | null
          file_type?: string | null
          id?: string
          name: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          file_path?: string | null
          file_size?: string | null
          file_type?: string | null
          id?: string
          name?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          answer_uk: string
          category: string | null
          category_uk: string | null
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          question: string
          question_uk: string
          updated_at: string
        }
        Insert: {
          answer: string
          answer_uk: string
          category?: string | null
          category_uk?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          question: string
          question_uk: string
          updated_at?: string
        }
        Update: {
          answer?: string
          answer_uk?: string
          category?: string | null
          category_uk?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          question?: string
          question_uk?: string
          updated_at?: string
        }
        Relationships: []
      }
      infrastructure_projects: {
        Row: {
          actual_completion_date: string | null
          actual_cost: number | null
          affected_assets: string[] | null
          budget: number | null
          contractor: string | null
          created_at: string
          description: string | null
          description_uk: string | null
          documents: string[] | null
          gps_coordinates: string | null
          id: string
          location: string | null
          name: string
          name_uk: string
          planned_completion_date: string | null
          progress_percentage: number | null
          project_type: string
          responsible_manager: string | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          actual_completion_date?: string | null
          actual_cost?: number | null
          affected_assets?: string[] | null
          budget?: number | null
          contractor?: string | null
          created_at?: string
          description?: string | null
          description_uk?: string | null
          documents?: string[] | null
          gps_coordinates?: string | null
          id?: string
          location?: string | null
          name: string
          name_uk: string
          planned_completion_date?: string | null
          progress_percentage?: number | null
          project_type: string
          responsible_manager?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          actual_completion_date?: string | null
          actual_cost?: number | null
          affected_assets?: string[] | null
          budget?: number | null
          contractor?: string | null
          created_at?: string
          description?: string | null
          description_uk?: string | null
          documents?: string[] | null
          gps_coordinates?: string | null
          id?: string
          location?: string | null
          name?: string
          name_uk?: string
          planned_completion_date?: string | null
          progress_percentage?: number | null
          project_type?: string
          responsible_manager?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_requests: {
        Row: {
          actual_cost: number | null
          asset_id: string | null
          assigned_to: string | null
          completion_date: string | null
          created_at: string
          description: string | null
          description_uk: string | null
          estimated_cost: number | null
          id: string
          labor_hours: number | null
          materials_used: Json | null
          priority: string
          request_type: string
          requested_by: string | null
          scheduled_date: string | null
          status: string
          title: string
          title_uk: string
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          asset_id?: string | null
          assigned_to?: string | null
          completion_date?: string | null
          created_at?: string
          description?: string | null
          description_uk?: string | null
          estimated_cost?: number | null
          id?: string
          labor_hours?: number | null
          materials_used?: Json | null
          priority?: string
          request_type: string
          requested_by?: string | null
          scheduled_date?: string | null
          status?: string
          title: string
          title_uk: string
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          asset_id?: string | null
          assigned_to?: string | null
          completion_date?: string | null
          created_at?: string
          description?: string | null
          description_uk?: string | null
          estimated_cost?: number | null
          id?: string
          labor_hours?: number | null
          materials_used?: Json | null
          priority?: string
          request_type?: string
          requested_by?: string | null
          scheduled_date?: string | null
          status?: string
          title?: string
          title_uk?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_schedules: {
        Row: {
          asset_id: string | null
          checklist: Json | null
          created_at: string
          estimated_duration_hours: number | null
          frequency_days: number
          id: string
          is_active: boolean | null
          last_performed: string | null
          maintenance_type: string
          next_due: string
          responsible_team: string | null
          updated_at: string
        }
        Insert: {
          asset_id?: string | null
          checklist?: Json | null
          created_at?: string
          estimated_duration_hours?: number | null
          frequency_days: number
          id?: string
          is_active?: boolean | null
          last_performed?: string | null
          maintenance_type: string
          next_due: string
          responsible_team?: string | null
          updated_at?: string
        }
        Update: {
          asset_id?: string | null
          checklist?: Json | null
          created_at?: string
          estimated_duration_hours?: number | null
          frequency_days?: number
          id?: string
          is_active?: boolean | null
          last_performed?: string | null
          maintenance_type?: string
          next_due?: string
          responsible_team?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics: {
        Row: {
          created_at: string | null
          id: string
          metric_change: number | null
          metric_name: string
          metric_target: number | null
          metric_value: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_change?: number | null
          metric_name: string
          metric_target?: number | null
          metric_value: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_change?: number | null
          metric_name?: string
          metric_target?: number | null
          metric_value?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string | null
          content_uk: string | null
          created_at: string | null
          id: string
          image_url: string | null
          summary: string | null
          summary_uk: string | null
          title: string
          title_uk: string
        }
        Insert: {
          content?: string | null
          content_uk?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          summary?: string | null
          summary_uk?: string | null
          title: string
          title_uk: string
        }
        Update: {
          content?: string | null
          content_uk?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          summary?: string | null
          summary_uk?: string | null
          title?: string
          title_uk?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          patronymic: string | null
          phone: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          patronymic?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          patronymic?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          acquisition_date: string | null
          asset_id: string | null
          book_value: number | null
          category: string
          category_uk: string
          commissioning_date: string | null
          condition_status: string | null
          created_at: string | null
          description: string | null
          description_uk: string | null
          documents: string[] | null
          gps_coordinates: string | null
          id: string
          images: string[] | null
          last_inspection_date: string | null
          legal_status: string | null
          location: string | null
          maintenance_schedule: string | null
          model: string | null
          name: string
          name_uk: string
          next_maintenance_date: string | null
          residual_value: number | null
          responsible_department: string | null
          responsible_person: string | null
          serial_number: string | null
          service_life_years: number | null
          status: string | null
          subcategory: string | null
          subcategory_uk: string | null
          supplier: string | null
          technical_specs: Json | null
          type: string | null
          updated_at: string | null
          utilization_rate: number | null
          value: number | null
          warranty_expiry_date: string | null
        }
        Insert: {
          acquisition_date?: string | null
          asset_id?: string | null
          book_value?: number | null
          category: string
          category_uk: string
          commissioning_date?: string | null
          condition_status?: string | null
          created_at?: string | null
          description?: string | null
          description_uk?: string | null
          documents?: string[] | null
          gps_coordinates?: string | null
          id?: string
          images?: string[] | null
          last_inspection_date?: string | null
          legal_status?: string | null
          location?: string | null
          maintenance_schedule?: string | null
          model?: string | null
          name: string
          name_uk: string
          next_maintenance_date?: string | null
          residual_value?: number | null
          responsible_department?: string | null
          responsible_person?: string | null
          serial_number?: string | null
          service_life_years?: number | null
          status?: string | null
          subcategory?: string | null
          subcategory_uk?: string | null
          supplier?: string | null
          technical_specs?: Json | null
          type?: string | null
          updated_at?: string | null
          utilization_rate?: number | null
          value?: number | null
          warranty_expiry_date?: string | null
        }
        Update: {
          acquisition_date?: string | null
          asset_id?: string | null
          book_value?: number | null
          category?: string
          category_uk?: string
          commissioning_date?: string | null
          condition_status?: string | null
          created_at?: string | null
          description?: string | null
          description_uk?: string | null
          documents?: string[] | null
          gps_coordinates?: string | null
          id?: string
          images?: string[] | null
          last_inspection_date?: string | null
          legal_status?: string | null
          location?: string | null
          maintenance_schedule?: string | null
          model?: string | null
          name?: string
          name_uk?: string
          next_maintenance_date?: string | null
          residual_value?: number | null
          responsible_department?: string | null
          responsible_person?: string | null
          serial_number?: string | null
          service_life_years?: number | null
          status?: string | null
          subcategory?: string | null
          subcategory_uk?: string | null
          supplier?: string | null
          technical_specs?: Json | null
          type?: string | null
          updated_at?: string | null
          utilization_rate?: number | null
          value?: number | null
          warranty_expiry_date?: string | null
        }
        Relationships: []
      }
      service_reviews: {
        Row: {
          appointment_id: string | null
          created_at: string
          id: string
          is_anonymous: boolean | null
          rating: number
          review_text: string | null
          service_id: string | null
          user_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          rating: number
          review_text?: string | null
          service_id?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          rating?: number
          review_text?: string | null
          service_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          average_rating: number | null
          category: string
          category_uk: string
          contact_info: Json | null
          cost: string | null
          cost_uk: string | null
          created_at: string | null
          description: string | null
          description_uk: string | null
          id: string
          legal_basis: string | null
          legal_basis_uk: string | null
          life_situations: string[] | null
          life_situations_uk: string[] | null
          name: string
          name_uk: string
          processing_time: string | null
          providing_authority: string | null
          providing_authority_uk: string | null
          requests: number | null
          required_documents: string[] | null
          required_documents_uk: string[] | null
          status: string | null
          steps_to_obtain: string[] | null
          steps_to_obtain_uk: string[] | null
          subcategory: string | null
          subcategory_uk: string | null
          target_audience: string | null
          target_audience_uk: string | null
          total_reviews: number | null
        }
        Insert: {
          average_rating?: number | null
          category: string
          category_uk: string
          contact_info?: Json | null
          cost?: string | null
          cost_uk?: string | null
          created_at?: string | null
          description?: string | null
          description_uk?: string | null
          id?: string
          legal_basis?: string | null
          legal_basis_uk?: string | null
          life_situations?: string[] | null
          life_situations_uk?: string[] | null
          name: string
          name_uk: string
          processing_time?: string | null
          providing_authority?: string | null
          providing_authority_uk?: string | null
          requests?: number | null
          required_documents?: string[] | null
          required_documents_uk?: string[] | null
          status?: string | null
          steps_to_obtain?: string[] | null
          steps_to_obtain_uk?: string[] | null
          subcategory?: string | null
          subcategory_uk?: string | null
          target_audience?: string | null
          target_audience_uk?: string | null
          total_reviews?: number | null
        }
        Update: {
          average_rating?: number | null
          category?: string
          category_uk?: string
          contact_info?: Json | null
          cost?: string | null
          cost_uk?: string | null
          created_at?: string | null
          description?: string | null
          description_uk?: string | null
          id?: string
          legal_basis?: string | null
          legal_basis_uk?: string | null
          life_situations?: string[] | null
          life_situations_uk?: string[] | null
          name?: string
          name_uk?: string
          processing_time?: string | null
          providing_authority?: string | null
          providing_authority_uk?: string | null
          requests?: number | null
          required_documents?: string[] | null
          required_documents_uk?: string[] | null
          status?: string | null
          steps_to_obtain?: string[] | null
          steps_to_obtain_uk?: string[] | null
          subcategory?: string | null
          subcategory_uk?: string | null
          target_audience?: string | null
          target_audience_uk?: string | null
          total_reviews?: number | null
        }
        Relationships: []
      }
      specialists: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          department: string
          id: string
          is_available: boolean | null
          name: string
          position: string
          services: string[] | null
          working_hours: Json | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          department: string
          id?: string
          is_available?: boolean | null
          name: string
          position: string
          services?: string[] | null
          working_hours?: Json | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          department?: string
          id?: string
          is_available?: boolean | null
          name?: string
          position?: string
          services?: string[] | null
          working_hours?: Json | null
        }
        Relationships: []
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
          role: Database["public"]["Enums"]["app_role"]
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
      work_logs: {
        Row: {
          asset_id: string | null
          cost: number | null
          created_at: string
          end_time: string | null
          id: string
          materials_used: Json | null
          notes: string | null
          performed_by: string | null
          photos: string[] | null
          request_id: string | null
          start_time: string | null
          work_description: string
          work_description_uk: string
          work_type: string
        }
        Insert: {
          asset_id?: string | null
          cost?: number | null
          created_at?: string
          end_time?: string | null
          id?: string
          materials_used?: Json | null
          notes?: string | null
          performed_by?: string | null
          photos?: string[] | null
          request_id?: string | null
          start_time?: string | null
          work_description: string
          work_description_uk: string
          work_type: string
        }
        Update: {
          asset_id?: string | null
          cost?: number | null
          created_at?: string
          end_time?: string | null
          id?: string
          materials_used?: Json | null
          notes?: string | null
          performed_by?: string | null
          photos?: string[] | null
          request_id?: string | null
          start_time?: string | null
          work_description?: string
          work_description_uk?: string
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_logs_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_logs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "maintenance_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "employee" | "resident"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "employee", "resident"],
    },
  },
} as const
