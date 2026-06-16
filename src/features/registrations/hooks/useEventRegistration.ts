import type { EventRegistrationRecord, RegistrationFormValues } from "../types/registration.types";

export interface UseEventRegistrationResult {
  isSubmitting: boolean;
  error: string | null;
  submit(values: RegistrationFormValues): Promise<EventRegistrationRecord | null>;
}

export function useEventRegistration(): UseEventRegistrationResult {
  return {
    isSubmitting: false,
    error: null,
    async submit() {
      return null;
    },
  };
}
