import type { Id } from "../../../../convex/_generated/dataModel";
import type { UseEventResult } from "../types/event.types";

export function useEvent(eventId?: Id<"events">): UseEventResult {
  void eventId;
  return {
    event: null,
    isLoading: false,
    error: null,
  };
}
