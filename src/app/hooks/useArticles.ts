import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as articlesService from "../services/articles";

export function useArticles(category?: string, search?: string) {
  return useQuery({
    queryKey: ["articles", category, search],
    queryFn: () => articlesService.getArticles(category, search),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (article: Parameters<typeof articlesService.createArticle>[0]) =>
      articlesService.createArticle(article),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["articles"] }),
  });
}

export function useUpdateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, article }: { id: number; article: Parameters<typeof articlesService.updateArticle>[1] }) =>
      articlesService.updateArticle(id, article),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["articles"] }),
  });
}

export function useDeleteArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => articlesService.deleteArticle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["articles"] }),
  });
}
