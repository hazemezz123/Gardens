import { supabase } from "../lib/supabase";
import type { TeamMember } from "../types";

export async function getTeam(): Promise<TeamMember[]> {
  const { data, error } = await supabase.from("team").select("*").order("id");
  if (error) throw error;
  return data ?? [];
}
