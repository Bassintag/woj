import "./index.css";

import { registerSW } from "virtual:pwa-register";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { persister, queryClient } from "./lib/query";
import { router } from "./router";

registerSW({ immediate: true });

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
