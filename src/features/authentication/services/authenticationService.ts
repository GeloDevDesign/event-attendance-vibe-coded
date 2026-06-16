import type {
  ConvexAuthState,
  LoginFormValues,
  RegisterAccountFormValues,
} from "../types/authentication.types";

export async function login(values: LoginFormValues): Promise<void> {
  void values;
}

export async function register(values: RegisterAccountFormValues): Promise<void> {
  void values;
}

export async function logout(): Promise<void> {
  return;
}

export function createConvexAuthState(): ConvexAuthState {
  return {
    isLoading: false,
    isAuthenticated: false,
    async fetchAccessToken() {
      return null;
    },
  };
}
