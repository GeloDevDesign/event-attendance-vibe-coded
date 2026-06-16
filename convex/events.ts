import { getAuthUserId } from "@convex-dev/auth/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";

type EventInput = {
  name: string;
  locationName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  maximumParticipants: number;
  eventDate: number;
  attendanceStartAt: number;
  attendanceEndAt: number;
  status: "draft" | "open" | "ongoing" | "completed" | "cancelled";
  imageUrl?: string;
};

const eventStatusValidator = v.union(
  v.literal("draft"),
  v.literal("open"),
  v.literal("ongoing"),
  v.literal("completed"),
  v.literal("cancelled"),
);

const eventFields = {
  name: v.string(),
  locationName: v.string(),
  latitude: v.number(),
  longitude: v.number(),
  radiusMeters: v.number(),
  maximumParticipants: v.number(),
  eventDate: v.number(),
  attendanceStartAt: v.number(),
  attendanceEndAt: v.number(),
  status: eventStatusValidator,
  imageUrl: v.optional(v.string()),
};

async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx): Promise<Doc<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication is required.");
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("Authenticated user was not found.");
  }

  return user;
}

async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<Doc<"users">> {
  const user = await getAuthenticatedUser(ctx);
  if (user.role !== "admin") {
    throw new Error("Admin access is required.");
  }

  return user;
}

function validateEventInput(args: EventInput): EventInput {
  const name = args.name.trim();
  const locationName = args.locationName.trim();

  if (!name) {
    throw new Error("Event name is required.");
  }

  if (!locationName) {
    throw new Error("Location name is required.");
  }

  if (args.latitude < -90 || args.latitude > 90) {
    throw new Error("Latitude must be between -90 and 90.");
  }

  if (args.longitude < -180 || args.longitude > 180) {
    throw new Error("Longitude must be between -180 and 180.");
  }

  if (args.radiusMeters <= 0) {
    throw new Error("Radius must be greater than zero.");
  }

  if (!Number.isInteger(args.maximumParticipants) || args.maximumParticipants <= 0) {
    throw new Error("Maximum participants must be a positive whole number.");
  }

  if (!Number.isFinite(args.eventDate)) {
    throw new Error("Event date is required.");
  }

  if (!Number.isFinite(args.attendanceStartAt)) {
    throw new Error("Attendance start time is required.");
  }

  if (!Number.isFinite(args.attendanceEndAt)) {
    throw new Error("Attendance end time is required.");
  }

  if (args.attendanceEndAt <= args.attendanceStartAt) {
    throw new Error("Attendance end time must be after the start time.");
  }

  return {
    name,
    locationName,
    latitude: args.latitude,
    longitude: args.longitude,
    radiusMeters: args.radiusMeters,
    maximumParticipants: args.maximumParticipants,
    eventDate: args.eventDate,
    attendanceStartAt: args.attendanceStartAt,
    attendanceEndAt: args.attendanceEndAt,
    status: args.status,
    imageUrl: args.imageUrl?.trim() || undefined,
  };
}

function toEventRecord(event: Doc<"events">) {
  return {
    id: event._id,
    name: event.name,
    locationName: event.locationName,
    latitude: event.latitude,
    longitude: event.longitude,
    radiusMeters: event.radiusMeters,
    maximumParticipants: event.maximumParticipants,
    eventDate: event.eventDate,
    attendanceStartAt: event.attendanceStartAt,
    attendanceEndAt: event.attendanceEndAt,
    status: event.status,
    imageUrl: event.imageUrl,
    createdBy: event.createdBy,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

export const listOpenEvents = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_status", (queryBuilder) => queryBuilder.eq("status", "open"))
      .order("desc")
      .take(100);

    return events.map(toEventRecord);
  },
});

export const listAllEvents = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const events = await ctx.db
      .query("events")
      .withIndex("by_eventDate")
      .order("desc")
      .take(100);

    return events.map(toEventRecord);
  },
});

export const getEventById = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    return event ? toEventRecord(event) : null;
  },
});

export const createEvent = mutation({
  args: eventFields,
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const normalized = validateEventInput(args);
    const now = Date.now();

    return await ctx.db.insert("events", {
      ...normalized,
      createdBy: admin._id,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateEvent = mutation({
  args: {
    eventId: v.id("events"),
    ...eventFields,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existingEvent = await ctx.db.get(args.eventId);
    if (!existingEvent) {
      throw new Error("Event was not found.");
    }

    const normalized = validateEventInput(args);
    await ctx.db.patch(args.eventId, {
      ...normalized,
      updatedAt: Date.now(),
    });

    return args.eventId;
  },
});

export const changeEventStatus = mutation({
  args: {
    eventId: v.id("events"),
    status: eventStatusValidator,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existingEvent = await ctx.db.get(args.eventId);
    if (!existingEvent) {
      throw new Error("Event was not found.");
    }

    await ctx.db.patch(args.eventId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return args.eventId;
  },
});

export const getEventRegistrationCount = query({
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
