import type { UserRecord } from "../../../types/user.types";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterAccountFormValues {
  name: string;
  email: string;
  password: string;
}

export interface ConvexAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  fetchAccessToken(): Promise<string | null>;
}

export interface UseAuthenticationResult {
  user: UserRecord | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login(values: LoginFormValues): Promise<void>;
  register(values: RegisterAccountFormValues): Promise<void>;
  logout(): Promise<void>;
  auth: ConvexAuthState;
}
