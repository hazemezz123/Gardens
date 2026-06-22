import { supabase } from "../lib/supabase";
import type { Product, ProductFilters } from "../types";

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  let query = supabase.from("products").select("*");

  if (filters?.category && filters.category !== "All") {
    query = query.eq("category", filters.category);
  }
  if (filters?.difficulty && filters.difficulty !== "All") {
    query = query.eq("difficulty", filters.difficulty);
  }
  if (filters?.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }
  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error } = await query.order("id");
  if (error) throw error;
  return data ?? [];
}

export async function getProduct(id: number): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createProduct(product: {
  name: string; price: number; difficulty: string; category: string;
  image: string; rating?: number; reviews?: number; badge?: string; status?: string;
}): Promise<Product> {
  const { data, error } = await supabase.from("products").insert(product).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
