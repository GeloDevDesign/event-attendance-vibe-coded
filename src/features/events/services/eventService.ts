import type { Id } from "../../../../convex/_generated/dataModel";
import type { EventFormValues, EventRecord, EventStatus } from "../types/event.types";

export async function listOpenEvents(): Promise<EventRecord[]> {
  return [];
}

export async function listAllEvents(): Promise<EventRecord[]> {
  return [];
}

export async function getEventById(eventId: Id<"events">): Promise<EventRecord | null> {
  void eventId;
  return null;
}

export async function createEvent(values: EventFormValues): Promise<void> {
  void values;
}

export async function updateEvent(
  eventId: Id<"events">,
  values: EventFormValues,
): Promise<void> {
  void eventId;
  void values;
}

export async function changeEventStatus(
  eventId: Id<"events">,
  status: EventStatus,
): Promise<void> {
  void eventId;
  void status;
}
