import { fetchApi } from "@/utils/fetchApi";
import { Tag } from "@/features/tag/domain/Tag";
import { useQuery } from "@tanstack/react-query";

export const getTags = () => {
  return fetchApi<Tag[]>("tags");
};

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });
};
