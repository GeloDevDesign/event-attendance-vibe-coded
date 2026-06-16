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

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  characterImageUrl?: string;
  isCurrentUser?: boolean;
  firstName?: string;
  lastName?: string;
}

export interface AttendanceMapProps {
  event: EventMapLocation;
  attendee?: MapAttendee;
  userLocation?: UserLocation;
  otherUsers?: UserLocation[];
}

export interface AdminAttendanceMapProps {
  eventId: Id<"events">;
  event: EventMapLocation;
}
