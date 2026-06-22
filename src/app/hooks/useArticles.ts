import { useQuery } from "@tanstack/react-query";
import * as articlesService from "../services/articles";

export function useArticles(category?: string, search?: string) {
  return useQuery({
    queryKey: ["articles", category, search],
    queryFn: () => articlesService.getArticles(category, search),
    staleTime: 5 * 60 * 1000,
  });
}
