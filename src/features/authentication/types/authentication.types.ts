import type { UserRecord } from "../../../types/user.types";
import type { Id } from "../../../../convex/_generated/dataModel";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterAccountFormValues {
  name: string;
  email: string;
  password: string;
  selectedCharacterId: Id<"characters"> | null;
}

export interface ConvexAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  fetchAccessToken(options?: { forceRefreshToken: boolean }): Promise<string | null>;
}

export interface AuthenticationValidationResult<TValues> {
  isValid: boolean;
  errors: string[];
  normalizedValues: TValues;
}

export interface LoginFormProps {
  isSubmitting: boolean;
  error: string | null;
  onSubmit(values: LoginFormValues): Promise<void>;
}

export interface RegisterAccountFormProps {
  isSubmitting: boolean;
  error: string | null;
  onSubmit(values: RegisterAccountFormValues): Promise<void>;
}

export interface UseAuthenticationResult {
  user: UserRecord | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isSubmitting: boolean;
  login(values: LoginFormValues): Promise<void>;
  register(values: RegisterAccountFormValues): Promise<void>;
  logout(): Promise<void>;
  auth: ConvexAuthState;
}
