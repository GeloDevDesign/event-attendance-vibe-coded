import type { UseEventFormResult } from "../types/event.types";

export function useEventForm(): UseEventFormResult {
  return {
    isSubmitting: false,
    error: null,
    async submit() {
      return;
    },
  };
}
