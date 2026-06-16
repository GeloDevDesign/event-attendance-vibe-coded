import type { Id } from "../../../../convex/_generated/dataModel";
import type { EventStatus } from "../../events/types/event.types";

export interface EventRegistrationRecord {
  id: Id<"eventRegistrations">;
  eventId: Id<"events">;
  userId: Id<"users">;
  characterId: Id<"characters">;
  firstName: string;
  lastName: string;
  isAccepted: boolean;
  registeredAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface JoinedEventRecord {
  id: Id<"eventRegistrations">;
  eventId: Id<"events">;
  eventName: string;
  locationName: string;
  eventDate: number;
  attendanceStartAt: number;
  attendanceEndAt: number;
  eventStatus: EventStatus;
  eventImageUrl?: string;
  characterId: Id<"characters">;
  characterName: string;
  characterImageUrl: string;
  firstName: string;
  lastName: string;
  isAccepted: boolean;
  registeredAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface RegistrationFormValues {
  firstName: string;
  lastName: string;
  characterId: Id<"characters">;
}

export interface EventRegistrationFormProps {
  eventId: Id<"events">;
  eventName?: string;
  characters: import("../../characters/types/character.types").CharacterRecord[];
  isSubmitting: boolean;
  error: string | null;
  onSubmit(values: RegistrationFormValues): Promise<EventRegistrationRecord | null>;
  onSuccess(registration: EventRegistrationRecord): void;
}

export interface RegistrationValidationResult {
  isValid: boolean;
  errors: string[];
  normalizedValues: RegistrationFormValues;
}
