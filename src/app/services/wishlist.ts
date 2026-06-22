import { supabase } from "../lib/supabase";

export async function getWishlist(userId: string) {
  const { data, error } = await supabase.from("wishlist_items").select("*, products(*)").eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}

export async function addWishlistItem(userId: string, productId: number): Promise<void> {
  const { error } = await supabase.from("wishlist_items").upsert(
    { user_id: userId, product_id: productId },
    { onConflict: "user_id, product_id" }
  );
  if (error) throw error;
}

export async function removeWishlistItem(userId: string, productId: number): Promise<void> {
  const { error } = await supabase.from("wishlist_items").delete().eq("user_id", userId).eq("product_id", productId);
  if (error) throw error;
}
