import type { UseEventsResult } from "../types/event.types";

export function useEvents(): UseEventsResult {
  return {
    events: [],
    isLoading: false,
    error: null,
  };
}
