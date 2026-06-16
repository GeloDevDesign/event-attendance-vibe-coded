import type { MapAttendee } from "../types/attendance-map.types";

export interface SelectedAttendeeState {
  selectedAttendee: MapAttendee | null;
  setSelectedAttendee(attendee: MapAttendee | null): void;
}

export function useSelectedAttendee(): SelectedAttendeeState {
  return {
    selectedAttendee: null,
    setSelectedAttendee() {
      return;
    },
  };
}
