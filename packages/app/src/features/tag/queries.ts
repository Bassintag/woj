import { fetchApi } from "@/utils/fetchApi";
import { queryOptions } from "@tanstack/react-query";
import { TagDto } from "@woj/common/dto";

export const tagKeys = {
  all: () => ["tags"],
};

export const tagsOptions = () => {
  return queryOptions({
    queryKey: tagKeys.all(),
    queryFn: () => fetchApi<TagDto[]>("tags"),
  });
};
