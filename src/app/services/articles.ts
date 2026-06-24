import { supabase } from "../lib/supabase";
import type { Article } from "../types";

export async function getArticles(category?: string, search?: string): Promise<Article[]> {
  let query = supabase.from("articles").select("*");
  if (category && category !== "All") query = query.eq("category", category);
  if (search) query = query.ilike("title", `%${search}%`);
  const { data, error } = await query.order("id");
  if (error) throw error;
  return (data ?? []).map(a => ({ ...a, readTime: a.read_time }));
}

export async function getArticle(id: number): Promise<Article | null> {
  const { data, error } = await supabase.from("articles").select("*").eq("id", id).single();
  if (error) throw error;
  return data ? { ...data, readTime: data.read_time } : null;
}

export async function createArticle(article: {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  image: string;
  featured: boolean;
}): Promise<Article> {
  const { data, error } = await supabase.from("articles").insert({
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    read_time: article.readTime,
    author: article.author,
    date: article.date,
    image: article.image,
    featured: article.featured,
  }).select().single();
  if (error) throw error;
  return { ...data, readTime: data.read_time };
}

export async function updateArticle(id: number, article: {
  title?: string;
  excerpt?: string;
  category?: string;
  readTime?: string;
  author?: string;
  date?: string;
  image?: string;
  featured?: boolean;
}): Promise<Article> {
  const db: Record<string, any> = {};
  if (article.title !== undefined) db.title = article.title;
  if (article.excerpt !== undefined) db.excerpt = article.excerpt;
  if (article.category !== undefined) db.category = article.category;
  if (article.readTime !== undefined) db.read_time = article.readTime;
  if (article.author !== undefined) db.author = article.author;
  if (article.date !== undefined) db.date = article.date;
  if (article.image !== undefined) db.image = article.image;
  if (article.featured !== undefined) db.featured = article.featured;
  const { data, error } = await supabase.from("articles").update(db).eq("id", id).select().single();
  if (error) throw error;
  return { ...data, readTime: data.read_time };
}

export async function deleteArticle(id: number): Promise<void> {
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}
