import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as ordersService from "../services/orders";
import type { Order } from "../types";

export function useOrders(userId?: string) {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: () => ordersService.getOrders(userId),
    enabled: !!userId,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (order: Parameters<typeof ordersService.createOrder>[0]) =>
      ordersService.createOrder(order),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Order["status"] }) =>
      ordersService.updateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}
