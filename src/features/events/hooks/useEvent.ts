import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { UseEventResult } from "../types/event.types";

export function useEvent(eventId?: Id<"events">): UseEventResult {
  const event = useQuery(api.events.getEventById, eventId ? { eventId } : "skip");

  return {
    event: event ?? null,
    isLoading: event === undefined,
    error: null,
  };
}
