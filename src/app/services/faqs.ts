import { supabase } from "../lib/supabase";
import type { FAQ } from "../types";

export async function getFaqs(): Promise<FAQ[]> {
  const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}
