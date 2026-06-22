import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as productsService from "../services/products";
import type { Product, ProductFilters } from "../types";

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productsService.getProducts(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => productsService.getProduct(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product: Parameters<typeof productsService.createProduct>[0]) =>
      productsService.createProduct(product),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Product> }) =>
      productsService.updateProduct(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productsService.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
