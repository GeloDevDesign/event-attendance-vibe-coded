/// <reference types="node" />
import assert from "node:assert/strict";

import type { Id } from "../../../../convex/_generated/dataModel";
import {
  formatRegistrationStatus,
  sortJoinedEventsByDate,
  validateRegistrationFormValues,
} from "../services/registrationService";
import type { JoinedEventRecord } from "../types/registration.types";

const joinedEvents: JoinedEventRecord[] = [
  {
    id: "registration-b" as Id<"eventRegistrations">,
    eventId: "event-b" as Id<"events">,
    eventName: "Community Day",
    locationName: "North Hall",
    eventDate: 200,
    attendanceStartAt: 210,
    attendanceEndAt: 220,
    eventStatus: "open",
    characterId: "character-b" as Id<"characters">,
    characterName: "Bruno",
    characterImageUrl: "/characters/bruno.png",
    firstName: "Bee",
    lastName: "Bee",
    isAccepted: true,
    registeredAt: 20,
    createdAt: 20,
    updatedAt: 20,
  },
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

const sortedJoinedEvents = sortJoinedEventsByDate(joinedEvents);
assert.equal(sortedJoinedEvents[0]?.eventName, "Community Day");
assert.equal(sortedJoinedEvents[1]?.eventName, "Launch Night");

const invalidForm = validateRegistrationFormValues({
  firstName: "   ",
  lastName: "",
  characterId: "character-a" as Id<"characters">,
});
assert.equal(invalidForm.isValid, false);
assert.equal(invalidForm.errors.length, 2);

const validForm = validateRegistrationFormValues({
  firstName: "  Ava ",
  lastName: " Stone ",
  characterId: "character-a" as Id<"characters">,
});
assert.equal(validForm.isValid, true);
assert.equal(validForm.normalizedValues.firstName, "Ava");
assert.equal(validForm.normalizedValues.lastName, "Stone");

assert.equal(formatRegistrationStatus(true), "Accepted");
assert.equal(formatRegistrationStatus(false), "Pending");

console.log("RegistrationList unit tests passed.");
