import { supabase } from "../lib/supabase";
import type { PexelsImage } from "../lib/pexels";

export async function searchImages(query: string, perPage = 10): Promise<PexelsImage[]> {
  if (!query.trim()) {
    return [];
  }

  const { data, error } = await supabase.functions.invoke("pexels-search", {
    body: { query, per_page: perPage },
  });

  if (error) {
    console.error("Pexels search error:", error);
    throw new Error(`Failed to search images: ${error.message}`);
  }

  return data.photos ?? [];
}
