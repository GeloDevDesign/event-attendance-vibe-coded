import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import type {
  EventRegistrationRecord,
  RegistrationFormValues,
} from "../types/registration.types";

export interface UseEventRegistrationOptions {
  eventId?: Id<"events">;
}

export interface UseEventRegistrationResult {
  isSubmitting: boolean;
  error: string | null;
  submit(values: RegistrationFormValues): Promise<EventRegistrationRecord | null>;
}

export function useEventRegistration(
  options: UseEventRegistrationOptions = {},
): UseEventRegistrationResult {
  const registerForEventMutation = useMutation(api.registrations.registerForEvent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    isSubmitting,
    error,
    async submit(values) {
      if (!options.eventId) {
        const message = "An event is required for registration.";
        setError(message);
        return null;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        return await registerForEventMutation({
          eventId: options.eventId,
          ...values,
        });
      } catch (caughtError) {
        const message =
          caughtError instanceof Error ? caughtError.message : "Registration failed.";
        setError(message);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
  };
}
