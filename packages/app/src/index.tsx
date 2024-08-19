import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { persister, queryClient } from "@/queryClient";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <PersistQueryClientProvider
      persistOptions={{ persister }}
      client={queryClient}
    >
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </PersistQueryClientProvider>
  </StrictMode>,
);
