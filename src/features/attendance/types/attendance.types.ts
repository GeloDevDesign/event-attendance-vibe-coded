import type { Id } from "../../../../convex/_generated/dataModel";

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface BrowserLocation extends Coordinate {
  accuracyMeters: number;
}

export interface AttendanceRecord {
  id: Id<"attendanceRecords">;
  eventId: Id<"events">;
  registrationId: Id<"eventRegistrations">;
  userId: Id<"users">;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  distanceMeters: number;
  isInsideRadius: boolean;
  isPresent: true;
  checkedInAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface AttendanceAttemptInput extends BrowserLocation {
  eventId: Id<"events">;
  registrationId: Id<"eventRegistrations">;
}

export interface AttendanceResultData {
  isPresent: boolean;
  isInsideRadius: boolean;
  distanceMeters: number;
  allowedRadiusMeters: number;
  checkedInAt?: number;
  message: string;
}
