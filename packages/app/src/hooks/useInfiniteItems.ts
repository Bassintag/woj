import { InfiniteData } from "@tanstack/react-query";
import { Page } from "@/domain/Page";
import { useMemo } from "react";

export const useInfiniteItems = <T>(
  data: InfiniteData<Page<T>> | undefined,
) => {
  return useMemo(() => {
    return data?.pages.flatMap((page) => page.items);
  }, [data]);
};
