import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as enquiriesService from "../services/enquiries";

export function useEnquiries() {
  return useQuery({
    queryKey: ["enquiries"],
    queryFn: () => enquiriesService.getEnquiries(),
  });
}

export function useCreateEnquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (enquiry: Parameters<typeof enquiriesService.createEnquiry>[0]) =>
      enquiriesService.createEnquiry(enquiry),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enquiries"] }),
  });
}

export function useMarkEnquiryRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => enquiriesService.markEnquiryRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enquiries"] }),
  });
}

export function useDeleteEnquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => enquiriesService.deleteEnquiry(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enquiries"] }),
  });
}
