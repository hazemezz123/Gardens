import { supabase } from "../lib/supabase";

export interface OrderWithCustomer {
  id: number;
  total: number;
  status: string;
  created_at: string;
  customer_name: string | null;
}

export interface OrderItemWithProduct {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export async function getDashboardOrders(): Promise<OrderWithCustomer[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("id, total, status, created_at, profiles(name)")
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) throw error;
  return (data ?? []).map((o: any) => ({
    id: o.id,
    total: parseFloat(o.total),
    status: o.status,
    created_at: o.created_at,
    customer_name: o.profiles?.name ?? null,
  }));
}

export async function getAllOrders(statusFilter?: string): Promise<OrderWithCustomer[]> {
  let query = supabase
    .from("orders")
    .select("id, total, status, created_at, profiles(name)")
    .order("created_at", { ascending: false });
  if (statusFilter) query = query.eq("status", statusFilter);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((o: any) => ({
    id: o.id,
    total: parseFloat(o.total),
    status: o.status,
    created_at: o.created_at,
    customer_name: o.profiles?.name ?? null,
  }));
}

export async function getOrderItems(orderId: number): Promise<OrderItemWithProduct[]> {
  const { data, error } = await supabase
    .from("order_items")
    .select("id, product_id, quantity, unit_price, products(name)")
    .eq("order_id", orderId);
  if (error) throw error;
  return (data ?? []).map((i: any) => ({
    id: i.id,
    product_id: i.product_id,
    product_name: i.products?.name ?? "Unknown",
    quantity: i.quantity,
    unit_price: parseFloat(i.unit_price),
    line_total: parseFloat(i.unit_price) * i.quantity,
  }));
}
