import { supabase } from "../lib/supabase";
import type { Article } from "../types";

export async function getArticles(category?: string, search?: string): Promise<Article[]> {
  let query = supabase.from("articles").select("*");
  if (category && category !== "All") query = query.eq("category", category);
  if (search) query = query.ilike("title", `%${search}%`);
  const { data, error } = await query.order("id");
  if (error) throw error;
  return data ?? [];
}

export async function getArticle(id: number): Promise<Article | null> {
  const { data, error } = await supabase.from("articles").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}
