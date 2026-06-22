import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as wishlistService from "../services/wishlist";
import { useAuth } from "./useAuth";

export function useWishlist() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: () => wishlistService.getWishlist(user!.id),
    enabled: !!user,
  });
}

export function useAddWishlistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string; productId: number }) =>
      wishlistService.addWishlistItem(userId, productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useRemoveWishlistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string; productId: number }) =>
      wishlistService.removeWishlistItem(userId, productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}
