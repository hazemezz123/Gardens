import { useQuery } from "@tanstack/react-query";
import * as faqsService from "../services/faqs";

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: () => faqsService.getFaqs(),
    staleTime: 5 * 60 * 1000,
  });
}
