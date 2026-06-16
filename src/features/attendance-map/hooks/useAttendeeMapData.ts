import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { MapAttendee } from "../types/attendance-map.types";

export interface AttendeeMapDataState {
  attendees: MapAttendee[];
  isLoading: boolean;
  error: string | null;
}

export function useAttendeeMapData(eventId?: Id<"events">): AttendeeMapDataState {
  const attendees =
    useQuery(
      api.mapData.getAdminAttendanceMapData,
      eventId ? { eventId } : "skip",
    ) ?? undefined;

  return {
    attendees: attendees ?? [],
    isLoading: attendees === undefined,
    error: null,
  };
}
