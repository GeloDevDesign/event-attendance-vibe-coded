import { createConvexAuthState } from "../services/authenticationService";
import type { UseAuthenticationResult } from "../types/authentication.types";

export function useAuthentication(): UseAuthenticationResult {
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
    async login() {
      return;
    },
    async register() {
      return;
    },
    async logout() {
      return;
    },
    auth: createConvexAuthState(),
  };
}
