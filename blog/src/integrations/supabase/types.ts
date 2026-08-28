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
      ad_slots: {
        Row: {
          active: boolean
          body: string | null
          created_at: string
          cta_text: string | null
          cta_url: string | null
          custom_html: string | null
          id: string
          image: Json | null
          image_url: string | null
          label: string
          slot_key: string
          title: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          body?: string | null
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          custom_html?: string | null
          id?: string
          image?: Json | null
          image_url?: string | null
          label: string
          slot_key: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          body?: string | null
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          custom_html?: string | null
          id?: string
          image?: Json | null
          image_url?: string | null
          label?: string
          slot_key?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string | null
          author_name: string | null
          author_user_id: string | null
          blocks: Json | null
          body: string
          category_id: string | null
          cover_image: Json | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          facebook_url: string | null
          featured: boolean
          gallery_images: Json
          id: string
          instagram_url: string | null
          key_moments: Json
          layout_size: string
          linkedin_url: string | null
          published: boolean
          published_at: string
          pull_quote: string | null
          questions: Json
          read_time_minutes: number
          secondary_image: Json | null
          secondary_image_url: string | null
          slug: string
          subtitle: string | null
          tags_text: string | null
          title: string
          twitter_url: string | null
          updated_at: string
          view_count: number
          seo_title: string | null
          seo_description: string | null
          scheduled_at: string | null
          status: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          author_user_id?: string | null
          blocks?: Json | null
          body?: string
          category_id?: string | null
          cover_image?: Json | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          facebook_url?: string | null
          featured?: boolean
          gallery_images?: Json
          id?: string
          instagram_url?: string | null
          key_moments?: Json
          layout_size?: string
          linkedin_url?: string | null
          published?: boolean
          published_at?: string
          pull_quote?: string | null
          questions?: Json
          read_time_minutes?: number
          secondary_image?: Json | null
          secondary_image_url?: string | null
          slug: string
          subtitle?: string | null
          tags_text?: string | null
          title: string
          twitter_url?: string | null
          updated_at?: string
          view_count?: number
          seo_title?: string | null
          seo_description?: string | null
          scheduled_at?: string | null
          status?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          author_user_id?: string | null
          blocks?: Json | null
          body?: string
          category_id?: string | null
          cover_image?: Json | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          facebook_url?: string | null
          featured?: boolean
          gallery_images?: Json
          id?: string
          instagram_url?: string | null
          key_moments?: Json
          layout_size?: string
          linkedin_url?: string | null
          published?: boolean
          published_at?: string
          pull_quote?: string | null
          questions?: Json
          read_time_minutes?: number
          secondary_image?: Json | null
          secondary_image_url?: string | null
          slug?: string
          subtitle?: string | null
          tags_text?: string | null
          title?: string
          twitter_url?: string | null
          updated_at?: string
          view_count?: number
          seo_title?: string | null
          seo_description?: string | null
          scheduled_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          id: string
          title: string | null
          image_url: string
          link_url: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          title?: string | null
          image_url: string
          link_url?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          title?: string | null
          image_url?: string
          link_url?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          nav_position: string
          slug: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          nav_position?: string
          slug: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          nav_position?: string
          slug?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      comments: {
        Row: {
          approved: boolean
          article_id: string
          author_name: string
          body: string
          created_at: string
          id: string
          parent_id: string | null
        }
        Insert: {
          approved?: boolean
          article_id: string
          author_name: string
          body: string
          created_at?: string
          id?: string
          parent_id?: string | null
        }
        Update: {
          approved?: boolean
          article_id?: string
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      editor_permissions: {
        Row: {
          can_edit_others: boolean
          created_at: string
          user_id: string
        }
        Insert: {
          can_edit_others?: boolean
          created_at?: string
          user_id: string
        }
        Update: {
          can_edit_others?: boolean
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      homepage_blocks: {
        Row: {
          block_key: string
          block_type: string
          category_slug: string | null
          created_at: string
          enabled: boolean
          id: string
          sort_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          block_key: string
          block_type?: string
          category_slug?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          sort_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          block_key?: string
          block_type?: string
          category_slug?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          sort_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_popups: {
        Row: {
          body: string | null
          category_id: string | null
          created_at: string
          cta_label: string | null
          delay_seconds: number
          enabled: boolean
          headline: string
          id: string
          image: Json | null
          scope: string
          scroll_trigger_pct: number
          updated_at: string
        }
        Insert: {
          body?: string | null
          category_id?: string | null
          created_at?: string
          cta_label?: string | null
          delay_seconds?: number
          enabled?: boolean
          headline: string
          id?: string
          image?: Json | null
          scope?: string
          scroll_trigger_pct?: number
          updated_at?: string
        }
        Update: {
          body?: string | null
          category_id?: string | null
          created_at?: string
          cta_label?: string | null
          delay_seconds?: number
          enabled?: boolean
          headline?: string
          id?: string
          image?: Json | null
          scope?: string
          scroll_trigger_pct?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_popups_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          value: string | null
        }
        Insert: {
          key: string
          value?: string | null
        }
        Update: {
          key?: string
          value?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      app_role: "admin" | "editor" | "user"
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
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
