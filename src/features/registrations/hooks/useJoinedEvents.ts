import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { sortJoinedEventsByDate } from "../services/registrationService";
import type { JoinedEventRecord } from "../types/registration.types";

export interface UseJoinedEventsResult {
  registrations: JoinedEventRecord[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
}

export function useJoinedEvents(): UseJoinedEventsResult {
  const registrations = useQuery(api.registrations.listJoinedEvents, {}) ?? undefined;

  const joinedEvents = sortJoinedEventsByDate(registrations ?? []);

  return {
    registrations: joinedEvents,
    isLoading: registrations === undefined,
    error: null,
    isEmpty: registrations !== undefined && joinedEvents.length === 0,
  };
}
