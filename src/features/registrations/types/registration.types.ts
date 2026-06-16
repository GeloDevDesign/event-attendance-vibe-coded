import type { Id } from "../../../../convex/_generated/dataModel";

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

export interface RegistrationFormValues {
  firstName: string;
  lastName: string;
  characterId: Id<"characters">;
}

export interface EventRegistrationFormProps {
  eventId: Id<"events">;
  onSuccess(registration: EventRegistrationRecord): void;
}
