import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import type { UseEventsResult } from "../types/event.types";

export function useEvents(options: { scope?: "open" | "all" } = {}): UseEventsResult {
  const scope = options.scope ?? "open";
  const rawEvents =
    useQuery(scope === "all" ? api.events.listAllEvents : api.events.listOpenEvents, {}) ??
    undefined;

  return {
    events: rawEvents ?? [],
    isLoading: rawEvents === undefined,
    error: null,
  };
}
