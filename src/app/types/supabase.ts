export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          price: number;
          difficulty: string;
          category: string;
          image: string;
          rating: number;
          reviews: number;
          badge: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          price: number;
          difficulty: string;
          category: string;
          image: string;
          rating?: number;
          reviews?: number;
          badge?: string;
          status?: string;
        };
        Update: {
          name?: string;
          price?: number;
          difficulty?: string;
          category?: string;
          image?: string;
          rating?: number;
          reviews?: number;
          badge?: string;
          status?: string;
        };
      };
      articles: {
        Row: {
          id: number; title: string; excerpt: string; category: string;
          read_time: string; author: string; date: string; image: string;
          featured: boolean; created_at: string;
        };
        Insert: {
          title: string; excerpt: string; category: string;
          read_time: string; author: string; date: string; image: string;
          featured?: boolean;
        };
        Update: {
          title?: string; excerpt?: string; category?: string;
          read_time?: string; author?: string; date?: string; image?: string;
          featured?: boolean;
        };
      };
      team: {
        Row: { id: number; name: string; role: string; bio: string; image: string; created_at: string; };
        Insert: { name: string; role: string; bio: string; image: string; };
        Update: { name?: string; role?: string; bio?: string; image?: string; };
      };
      faqs: {
        Row: { id: number; question: string; answer: string; sort_order: number; created_at: string; };
        Insert: { question: string; answer: string; sort_order?: number; };
        Update: { question?: string; answer?: string; sort_order?: number; };
      };
      profiles: {
        Row: { id: string; name: string; role: "admin" | "customer"; avatar_url: string | null; created_at: string; };
        Insert: { id: string; name: string; role?: "admin" | "customer"; avatar_url?: string | null; };
        Update: { name?: string; role?: "admin" | "customer"; avatar_url?: string | null; };
      };
      orders: {
        Row: { id: number; user_id: string; status: string; total: number; created_at: string; };
        Insert: { user_id: string; status?: string; total: number; };
        Update: { status?: string; total?: number; };
      };
      order_items: {
        Row: { id: number; order_id: number; product_id: number; quantity: number; unit_price: number; };
        Insert: { order_id: number; product_id: number; quantity?: number; unit_price: number; };
        Update: { quantity?: number; unit_price?: number; };
      };
      cart_items: {
        Row: { id: number; user_id: string; product_id: number; quantity: number; created_at: string; };
        Insert: { user_id: string; product_id: number; quantity?: number; };
        Update: { quantity?: number; };
      };
      enquiries: {
        Row: { id: number; name: string; email: string; subject: string; message: string; is_read: boolean; created_at: string; };
        Insert: { name: string; email: string; subject: string; message: string; };
        Update: { is_read?: boolean; };
      };
      wishlist_items: {
        Row: { id: number; user_id: string; product_id: number; created_at: string; };
        Insert: { user_id: string; product_id: number; };
        Update: Record<string, never>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
