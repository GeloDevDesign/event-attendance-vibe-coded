import type { MapAttendee } from "../types/attendance-map.types";

export interface AttendeeMapDataState {
  attendees: MapAttendee[];
  isLoading: boolean;
  error: string | null;
}

export function useAttendeeMapData(): AttendeeMapDataState {
  return {
    attendees: [],
    isLoading: false,
    error: null,
  };
}
