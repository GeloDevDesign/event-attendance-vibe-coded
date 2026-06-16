/// <reference types="node" />
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import type { Id } from "../../../../convex/_generated/dataModel";
import { EventRegistrationForm } from "../components/EventRegistrationForm";
import { RegistrationList } from "../components/RegistrationList";
import type { CharacterRecord } from "../../characters/types/character.types";
import type { JoinedEventRecord } from "../types/registration.types";

const characters: CharacterRecord[] = [
  {
    id: "character-a" as Id<"characters">,
    name: "Astra",
    imageUrl: "/characters/astra.png",
    isActive: true,
    createdAt: 1,
    updatedAt: 1,
  },
  {
    id: "character-b" as Id<"characters">,
    name: "Bruno",
    imageUrl: "/characters/bruno.png",
    isActive: true,
    createdAt: 2,
    updatedAt: 2,
  },
];

const formMarkup = renderToStaticMarkup(
  <EventRegistrationForm
    eventId={"event-a" as Id<"events">}
    eventName="Launch Night"
    characters={characters}
    isSubmitting={false}
    error="Registration failed."
    onSubmit={async () => null}
    onSuccess={() => undefined}
  />,
);

assert.match(formMarkup, /Launch Night/);
assert.match(formMarkup, /Astra/);
assert.match(formMarkup, /Bruno/);
assert.match(formMarkup, /Registration failed\./);
assert.match(formMarkup, /Register/);

const loadingMarkup = renderToStaticMarkup(
  <EventRegistrationForm
    eventId={"event-a" as Id<"events">}
    eventName="Launch Night"
    characters={characters}
    isSubmitting={true}
    error={null}
    onSubmit={async () => null}
    onSuccess={() => undefined}
  />,
);

assert.match(loadingMarkup, /Registering\.\.\./);
assert.match(loadingMarkup, /disabled/);

const emptyCharactersMarkup = renderToStaticMarkup(
  <EventRegistrationForm
    eventId={"event-a" as Id<"events">}
    eventName="Launch Night"
    characters={[]}
    isSubmitting={false}
    error={null}
    onSubmit={async () => null}
    onSuccess={() => undefined}
  />,
);

assert.match(
  emptyCharactersMarkup,
  /No active characters are available for this event\./,
);

const registrations: JoinedEventRecord[] = [
  {
    id: "registration-a" as Id<"eventRegistrations">,
    eventId: "event-a" as Id<"events">,
    eventName: "Launch Night",
    locationName: "South Hall",
    eventDate: 100,
    attendanceStartAt: 110,
    attendanceEndAt: 120,
    eventStatus: "open",
    characterId: "character-a" as Id<"characters">,
    characterName: "Astra",
    characterImageUrl: "/characters/astra.png",
    firstName: "Ann",
    lastName: "Anders",
    isAccepted: true,
    registeredAt: 10,
    createdAt: 10,
    updatedAt: 10,
  },
];

const listMarkup = renderToStaticMarkup(
  <RegistrationList registrations={registrations} emptyMessage="No joined events." />,
);

assert.match(listMarkup, /Launch Night/);
assert.match(listMarkup, /South Hall/);
assert.match(listMarkup, /Accepted/);
assert.match(listMarkup, /Ann Anders/);

const emptyMarkup = renderToStaticMarkup(
  <RegistrationList registrations={[]} emptyMessage="No joined events." />,
);

assert.match(emptyMarkup, /No joined events\./);

console.log("EventRegistrationForm feature tests passed.");
