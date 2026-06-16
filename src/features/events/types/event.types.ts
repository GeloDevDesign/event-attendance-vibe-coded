import type { Id } from "../../../../convex/_generated/dataModel";

export type EventStatus =
  | "draft"
  | "open"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface EventRecord {
  id: Id<"events">;
  name: string;
  locationName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  maximumParticipants: number;
  eventDate: number;
  attendanceStartAt: number;
  attendanceEndAt: number;
  status: EventStatus;
  imageUrl?: string;
  createdBy: Id<"users">;
  createdAt: number;
  updatedAt: number;
}

export interface EventFormValues {
  name: string;
  locationName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  maximumParticipants: number;
  eventDate: number;
  attendanceStartAt: number;
  attendanceEndAt: number;
  status: EventStatus;
  imageUrl?: string;
}

export interface UseEventsResult {
  events: EventRecord[];
  isLoading: boolean;
  error: string | null;
}

export interface UseEventResult {
  event: EventRecord | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseEventFormResult {
  isSubmitting: boolean;
  error: string | null;
  submit(values: EventFormValues): Promise<void>;
}
