import type { PropsWithChildren, ReactNode } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";

export function AuthGate({
  fallback,
  children,
}: PropsWithChildren & { fallback?: ReactNode }) {
  const auth = useAuthStore((s) => s.tokens != null);
  return auth ? children : fallback;
}
