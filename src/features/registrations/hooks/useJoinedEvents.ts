import type { EventRegistrationRecord } from "../types/registration.types";

export interface UseJoinedEventsResult {
  registrations: EventRegistrationRecord[];
  isLoading: boolean;
  error: string | null;
}

export function useJoinedEvents(): UseJoinedEventsResult {
  return {
    registrations: [],
    isLoading: false,
    error: null,
  };
}
