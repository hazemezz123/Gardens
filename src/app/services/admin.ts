import { supabase } from "../lib/supabase";

export interface OrderWithCustomer {
  id: number;
  total: number;
  status: string;
  created_at: string;
  customer_name: string | null;
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
