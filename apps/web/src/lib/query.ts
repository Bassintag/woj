import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 10 minutes
      staleTime: 1000 * 60 * 60 * 10,
    },
  },
});

export const persister = createAsyncStoragePersister({
  storage: localStorage,
  key: "woj-query",
});
