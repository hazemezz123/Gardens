export type Page = "home" | "about" | "products" | "product-detail" | "tips" | "contact" | "admin" | "cart";

export interface Product {
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
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  image: string;
  featured: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Profile {
  id: string;
  name: string;
  role: "admin" | "customer";
  avatar_url: string | null;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: string;
  status: "pending" | "processing" | "dispatched" | "delivered";
  total: number;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at: string;
}

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface WishlistItem {
  id: number;
  user_id: string;
  product_id: number;
  created_at: string;
}

export interface ProductFilters {
  category?: string;
  difficulty?: string;
  maxPrice?: number;
  search?: string;
}
