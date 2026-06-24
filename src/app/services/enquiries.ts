import { supabase } from "../lib/supabase";
import type { Enquiry } from "../types";

export async function getEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createEnquiry(enquiry: {
  name: string; email: string; subject: string; message: string;
}): Promise<Enquiry> {
  const { data, error } = await supabase.from("enquiries").insert(enquiry).select().single();
  if (error) throw error;
  return data;
}

export async function markEnquiryRead(id: number): Promise<void> {
  const { error } = await supabase.from("enquiries").update({ is_read: true }).eq("id", id);
  if (error) throw error;
}

export async function deleteEnquiry(id: number): Promise<void> {
  const { error } = await supabase.from("enquiries").delete().eq("id", id);
  if (error) throw error;
}
