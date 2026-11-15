import {
  type AccessToken,
  AccessTokenSchema,
  type RefreshToken,
  RefreshTokenSchema,
  type TokenPair,
} from "@woj/contract";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface DecodedToken<T> {
  raw: string;
  payload: T;
}

export interface AuthState {
  tokens?: {
    access: DecodedToken<AccessToken>;
    refresh: DecodedToken<RefreshToken>;
  };
  setTokens(tokens: TokenPair): void;
  clear(): void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: undefined,
      setTokens({ access, refresh }) {
        set({
          tokens: {
            access: {
              raw: access,
              payload: AccessTokenSchema.parse(jwtDecode(access)),
            },
            refresh: {
              raw: refresh,
              payload: RefreshTokenSchema.parse(jwtDecode(refresh)),
            },
          },
        });
      },
      clear() {
        set({ tokens: undefined });
      },
    }),
    {
      name: "woj-auth",
      storage: createJSONStorage(() => window.sessionStorage),
    },
  ),
);
