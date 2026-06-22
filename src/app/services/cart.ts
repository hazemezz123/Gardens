import { supabase } from "../lib/supabase";

export async function getCartItems(userId: string) {
  const { data, error } = await supabase.from("cart_items").select("*, products(*)").eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}

export async function upsertCartItem(userId: string, productId: number, quantity: number): Promise<void> {
  const { error } = await supabase.from("cart_items").upsert(
    { user_id: userId, product_id: productId, quantity },
    { onConflict: "user_id, product_id" }
  );
  if (error) throw error;
}

export async function removeCartItem(userId: string, productId: number): Promise<void> {
  const { error } = await supabase.from("cart_items").delete().eq("user_id", userId).eq("product_id", productId);
  if (error) throw error;
}

export async function clearCart(userId: string): Promise<void> {
  const { error } = await supabase.from("cart_items").delete().eq("user_id", userId);
  if (error) throw error;
}
