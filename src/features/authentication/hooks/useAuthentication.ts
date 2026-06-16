import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { useState } from "react";

import { api } from "../../../../convex/_generated/api";
import { createConvexAuthState } from "../services/authenticationService";
import type {
  LoginFormValues,
  RegisterAccountFormValues,
  UseAuthenticationResult,
} from "../types/authentication.types";

export function useAuthentication(): UseAuthenticationResult {
  const auth = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const currentUser = useQuery(api.users.getCurrentUser, {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(values: LoginFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("email", values.email);
      formData.set("password", values.password);
      formData.set("flow", "signIn");

      await signIn("password", formData);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Sign in failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function register(values: RegisterAccountFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("email", values.email);
      formData.set("password", values.password);
      formData.set("flow", "signUp");
      
      if (values.selectedCharacterId) {
        formData.set("selectedCharacterId", values.selectedCharacterId);
      }

      await signIn("password", formData);

      // We no longer need to call setSelectedCharacter here because it's handled by the auth profile
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Sign up failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    setError(null);
    await signOut();
  }

  return {
    user: currentUser ?? null,
    isLoading: auth.isLoading || currentUser === undefined,
    isAuthenticated: auth.isAuthenticated,
    error,
    isSubmitting,
    login,
    register,
    logout,
    auth: createConvexAuthState(auth),
  };
}
