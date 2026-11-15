import { ORPCError } from "@orpc/client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MutationCache, QueryClient } from "@tanstack/react-query";
import { toastManager } from "@/components/ui/Toast";

function getErrorDescription(error: unknown) {
  if (error instanceof ORPCError) {
    if (error.code === "UNAUTHORIZED") return "Session expirée";
    if (error.code === "CONFLICT") return "Cet élément existe déjà";
  }
  return "Une erreur est survenue";
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
    },
  },
  mutationCache: new MutationCache({
    onError(error) {
      toastManager.add({
        type: "error",
        title: "Erreur",
        description: getErrorDescription(error),
      });
    },
  }),
});

export const persister = createAsyncStoragePersister({
  storage: localStorage,
  key: "woj-query",
});
