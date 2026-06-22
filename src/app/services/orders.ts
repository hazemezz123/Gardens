import { supabase } from "../lib/supabase";
import type { Order, OrderItem } from "../types";

export async function getOrders(userId?: string): Promise<Order[]> {
  let query = supabase.from("orders").select("*");
  if (userId) query = query.eq("user_id", userId);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createOrder(order: {
  user_id: string; status?: string; total: number;
}): Promise<Order> {
  const { data, error } = await supabase.from("orders").insert(order).select().single();
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id: number, status: Order["status"]): Promise<Order> {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}
