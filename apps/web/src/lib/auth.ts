import type { AccessToken, RefreshToken } from "@woj/contract";
import { useAuthStore } from "../hooks/useAuthStore";
import { orpc } from "./orpc";

const REFRESH_MARGIN = 30;

export async function login(username: string, password: string) {
  const tokens = await orpc.tokens.create(undefined, {
    context: { authorization: `Basic ${btoa(`${username}:${password}`)}` },
  });
  useAuthStore.getState().setTokens(tokens);
}

export function logout() {
  useAuthStore.getState().clear();
}

function isExpiring(payload: AccessToken | RefreshToken) {
  return payload.exp - Date.now() / 1000 < REFRESH_MARGIN;
}

let pendingRefresh: Promise<void> | undefined;

async function refresh(refreshToken: string) {
  try {
    const tokens = await orpc.tokens.create(undefined, {
      context: { authorization: `Bearer ${refreshToken}` },
    });
    useAuthStore.getState().setTokens(tokens);
  } catch {
    logout();
  } finally {
    pendingRefresh = undefined;
  }
}

export async function getAccessToken() {
  const { tokens } = useAuthStore.getState();
  if (!tokens) return undefined;
  if (isExpiring(tokens.access.payload)) {
    if (isExpiring(tokens.refresh.payload)) {
      logout();
      return undefined;
    }
    if (pendingRefresh == null) {
      pendingRefresh = refresh(tokens.refresh.raw);
    }
    await pendingRefresh;
  }
  return useAuthStore.getState().tokens?.access.raw;
}
