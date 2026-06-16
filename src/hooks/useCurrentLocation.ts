import type { BrowserLocation } from "../features/attendance/types/attendance.types";

export interface CurrentLocationState {
  location: BrowserLocation | null;
  isLoading: boolean;
  error: string | null;
  requestLocation(): Promise<void>;
}

export function useCurrentLocation(): CurrentLocationState {
  return {
    location: null,
    isLoading: false,
    error: null,
    async requestLocation() {
      return;
    },
  };
}
