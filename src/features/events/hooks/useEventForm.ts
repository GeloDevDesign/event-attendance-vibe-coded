import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "../../../../convex/_generated/api";
import type { EventFormValues } from "../types/event.types";
import type { UseEventFormResult } from "../types/event.types";

export function useEventForm(): UseEventFormResult {
  const createEvent = useMutation(api.events.createEvent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    isSubmitting,
    error,
    async submit(values: EventFormValues) {
      setIsSubmitting(true);
      setError(null);

      try {
        await createEvent(values);
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Event creation failed.");
      } finally {
        setIsSubmitting(false);
      }
    },
  };
}
