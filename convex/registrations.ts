import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";

const registrationFields = {
  firstName: v.string(),
  lastName: v.string(),
  characterId: v.id("characters"),
};

type EventRegistrationDoc = Doc<"eventRegistrations">;
type EventDoc = Doc<"events">;
type CharacterDoc = Doc<"characters">;
type UserDoc = Doc<"users">;

function normalizeRegistrationInput(args: {
  firstName: string;
  lastName: string;
}): { firstName: string; lastName: string } {
  const firstName = args.firstName.trim();
  const lastName = args.lastName.trim();

  if (firstName.length === 0) {
    throw new Error("First name is required.");
  }

  if (lastName.length === 0) {
    throw new Error("Last name is required.");
  }

  return { firstName, lastName };
}

async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx): Promise<UserDoc | null> {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  return await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (queryBuilder) =>
      queryBuilder.eq("tokenIdentifier", identity.tokenIdentifier),
    )
    .unique();
}

function toEventRegistrationRecord(registration: EventRegistrationDoc) {
  return {
    id: registration._id,
    eventId: registration.eventId,
    userId: registration.userId,
    characterId: registration.characterId,
    firstName: registration.firstName,
    lastName: registration.lastName,
    isAccepted: registration.isAccepted,
    registeredAt: registration.registeredAt,
    createdAt: registration.createdAt,
    updatedAt: registration.updatedAt,
  };
}

function toJoinedEventRecord(input: {
  registration: EventRegistrationDoc;
  event: EventDoc;
  character: CharacterDoc;
}) {
  const { registration, event, character } = input;

  return {
    id: registration._id,
    eventId: event._id,
    eventName: event.name,
    locationName: event.locationName,
    eventDate: event.eventDate,
    attendanceStartAt: event.attendanceStartAt,
    attendanceEndAt: event.attendanceEndAt,
    eventStatus: event.status,
    characterId: character._id,
    characterName: character.name,
    characterImageUrl: character.imageUrl,
    firstName: registration.firstName,
    lastName: registration.lastName,
    isAccepted: registration.isAccepted,
    registeredAt: registration.registeredAt,
    createdAt: registration.createdAt,
    updatedAt: registration.updatedAt,
  };
}

async function getEventById(ctx: QueryCtx | MutationCtx, eventId: Id<"events">) {
  const event = await ctx.db.get(eventId);

  if (!event) {
    throw new Error("Event was not found.");
  }

  return event;
}

async function getCharacterById(
  ctx: QueryCtx | MutationCtx,
  characterId: Id<"characters">,
) {
  const character = await ctx.db.get(characterId);

  if (!character) {
    throw new Error("Character was not found.");
  }

  return character;
}

async function getRegistrationByEventAndUserInternal(
  ctx: QueryCtx | MutationCtx,
  eventId: Id<"events">,
  userId: Id<"users">,
) {
  return await ctx.db
    .query("eventRegistrations")
    .withIndex("by_eventId_and_userId", (queryBuilder) =>
      queryBuilder.eq("eventId", eventId).eq("userId", userId),
    )
    .unique();
}

async function getAcceptedRegistrationCount(
  ctx: QueryCtx | MutationCtx,
  eventId: Id<"events">,
  limit = 1000,
) {
  const acceptedRegistrations = await ctx.db
    .query("eventRegistrations")
    .withIndex("by_eventId_and_isAccepted", (queryBuilder) =>
      queryBuilder.eq("eventId", eventId).eq("isAccepted", true),
    )
    .take(limit);

  return acceptedRegistrations.length;
}

export const registerForEvent = mutation({
  args: {
    eventId: v.id("events"),
    ...registrationFields,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) {
      throw new Error("Authentication is required.");
    }

    const event = await getEventById(ctx, args.eventId);
    if (event.status !== "open") {
      throw new Error("Event is not open for registration.");
    }

    const normalized = normalizeRegistrationInput(args);
    const character = await getCharacterById(ctx, args.characterId);
    if (!character.isActive) {
      throw new Error("Character must be active.");
    }

    const existingRegistration = await getRegistrationByEventAndUserInternal(
      ctx,
      args.eventId,
      user._id,
    );
    if (existingRegistration) {
      throw new Error("You are already registered for this event.");
    }

    const acceptedRegistrationCount = await getAcceptedRegistrationCount(
      ctx,
      args.eventId,
      event.maximumParticipants,
    );
    if (acceptedRegistrationCount >= event.maximumParticipants) {
      throw new Error("Event capacity has been reached.");
    }

    const now = Date.now();
    const registrationId = await ctx.db.insert("eventRegistrations", {
      eventId: args.eventId,
      userId: user._id,
      characterId: args.characterId,
      firstName: normalized.firstName,
      lastName: normalized.lastName,
      isAccepted: true,
      registeredAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: registrationId,
      eventId: args.eventId,
      userId: user._id,
      characterId: args.characterId,
      firstName: normalized.firstName,
      lastName: normalized.lastName,
      isAccepted: true,
      registeredAt: now,
      createdAt: now,
      updatedAt: now,
    };
  },
});

export const getRegistrationByEventAndUser = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) {
      return null;
    }

    const registration = await getRegistrationByEventAndUserInternal(
      ctx,
      args.eventId,
      user._id,
    );

    return registration ? toEventRegistrationRecord(registration) : null;
  },
});

export const listRegistrationsByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access is required.");
    }

    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_eventId", (queryBuilder) => queryBuilder.eq("eventId", args.eventId))
      .order("desc")
      .take(100);

    return registrations.map(toEventRegistrationRecord);
  },
});

export const listJoinedEvents = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) {
      return [];
    }

    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_userId", (queryBuilder) => queryBuilder.eq("userId", user._id))
      .order("desc")
      .take(100);

    const joinedEvents = [];
    for (const registration of registrations) {
      const event = await ctx.db.get(registration.eventId);
      const character = await ctx.db.get(registration.characterId);

      if (!event || !character) {
        continue;
      }

      joinedEvents.push(
        toJoinedEventRecord({
          registration,
          event,
          character,
        }),
      );
    }

    return joinedEvents;
  },
});

export const getRegistrationCountByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_eventId_and_isAccepted", (queryBuilder) =>
        queryBuilder.eq("eventId", args.eventId).eq("isAccepted", true),
      )
      .take(1000);

    return registrations.length;
  },
});
