import type { Id } from "../../../../convex/_generated/dataModel";
import type {
  EventRegistrationRecord,
  RegistrationFormValues,
} from "../types/registration.types";

export async function registerForEvent(
  eventId: Id<"events">,
  values: RegistrationFormValues,
): Promise<EventRegistrationRecord | null> {
  void eventId;
  void values;
  return null;
}

export async function listJoinedEvents(): Promise<EventRegistrationRecord[]> {
  return [];
}
