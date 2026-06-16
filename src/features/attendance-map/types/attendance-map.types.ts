import type { Id } from "../../../../convex/_generated/dataModel";

export interface MapAttendee {
  registrationId: Id<"eventRegistrations">;
  userId: Id<"users">;
  attendeeName: string;
  characterName: string;
  characterImageUrl: string;
  isPresent: boolean;
  latitude: number | null;
  longitude: number | null;
  accuracyMeters: number | null;
  distanceMeters: number | null;
  checkedInAt: number | null;
}

export interface EventMapLocation {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  locationName: string;
}

export interface AttendanceMapProps {
  event: EventMapLocation;
  attendee?: MapAttendee;
  userLocation?: {
    latitude: number;
    longitude: number;
    accuracyMeters: number;
    characterImageUrl?: string;
  };
}

export interface AdminAttendanceMapProps {
  eventId: Id<"events">;
  event: EventMapLocation;
}
