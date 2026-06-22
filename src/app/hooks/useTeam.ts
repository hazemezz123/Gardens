import { useQuery } from "@tanstack/react-query";
import * as teamService from "../services/team";

export function useTeam() {
  return useQuery({
    queryKey: ["team"],
    queryFn: () => teamService.getTeam(),
    staleTime: 5 * 60 * 1000,
  });
}
