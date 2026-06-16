import { useState } from "react";
import type { BrowserLocation } from "../features/attendance/types/attendance.types";

export interface CurrentLocationState {
  location: BrowserLocation | null;
  isLoading: boolean;
  error: string | null;
  requestLocation(): Promise<BrowserLocation | null>;
}

export function useCurrentLocation(): CurrentLocationState {
  const [location, setLocation] = useState<BrowserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    location,
    isLoading,
    error,
    async requestLocation() {
      setIsLoading(true);
      setError(null);

      try {
        if (!navigator.geolocation) {
          throw new Error("Browser location is not available.");
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          });
        });

        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: position.coords.accuracy,
        };

        setLocation(nextLocation);
        return nextLocation;
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Location permission was denied or unavailable.",
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
  };
}
