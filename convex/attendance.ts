import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

type AttendanceRecordDoc = Doc<"attendanceRecords">;

function validateCoordinates(args: {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
}) {
  if (args.latitude < -90 || args.latitude > 90) {
    throw new Error("Latitude must be between -90 and 90.");
  }

  if (args.longitude < -180 || args.longitude > 180) {
    throw new Error("Longitude must be between -180 and 180.");
  }

  if (args.accuracyMeters < 0) {
    throw new Error("GPS accuracy must be zero or greater.");
  }
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function calculateDistanceInMeters(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }) {
  const earthRadiusMeters = 6371000;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

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

async function getAttendanceByRegistrationInternal(
  ctx: QueryCtx | MutationCtx,
  registrationId: Id<"eventRegistrations">,
) {
  return await ctx.db
    .query("attendanceRecords")
    .withIndex("by_registrationId", (queryBuilder) =>
      queryBuilder.eq("registrationId", registrationId),
    )
    .unique();
}

function toAttendanceRecord(record: AttendanceRecordDoc) {
  return {
    id: record._id,
    eventId: record.eventId,
    registrationId: record.registrationId,
    userId: record.userId,
    latitude: record.latitude,
    longitude: record.longitude,
    accuracyMeters: record.accuracyMeters,
    distanceMeters: record.distanceMeters,
    isInsideRadius: record.isInsideRadius,
    isPresent: record.isPresent,
    checkedInAt: record.checkedInAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const checkInAttendance = mutation({
  args: {
    eventId: v.id("events"),
    registrationId: v.id("eventRegistrations"),
    latitude: v.number(),
    longitude: v.number(),
    accuracyMeters: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    validateCoordinates(args);

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event was not found.");
    }

    if (event.status === "cancelled" || event.status === "completed") {
      throw new Error("Attendance is closed for this event.");
    }

    const registration = await ctx.db.get(args.registrationId);
    if (!registration || registration.eventId !== args.eventId) {
      throw new Error("Registration was not found for this event.");
    }

    if (registration.userId !== user._id) {
      throw new Error("You can only check in for your own registration.");
    }

    if (!registration.isAccepted) {
      throw new Error("Registration is not accepted.");
    }

    const now = Date.now();
    if (now < event.attendanceStartAt) {
      throw new Error("Attendance is not open yet.");
    }

    if (now > event.attendanceEndAt) {
      throw new Error("Attendance is already closed.");
    }

    const existingAttendance = await getAttendanceByRegistrationInternal(
      ctx,
      args.registrationId,
    );
    if (existingAttendance) {
      throw new Error("Attendance has already been completed.");
    }

    const distanceMeters = calculateDistanceInMeters(
      { latitude: event.latitude, longitude: event.longitude },
      { latitude: args.latitude, longitude: args.longitude },
    );
    const isInsideRadius = distanceMeters <= event.radiusMeters;

    if (!isInsideRadius) {
      return {
        isPresent: false,
        isInsideRadius: false,
        distanceMeters,
        allowedRadiusMeters: event.radiusMeters,
        message: "You are not within the event location.",
      };
    }

    const attendanceId = await ctx.db.insert("attendanceRecords", {
      eventId: args.eventId,
      registrationId: args.registrationId,
      userId: user._id,
      latitude: args.latitude,
      longitude: args.longitude,
      accuracyMeters: args.accuracyMeters,
      distanceMeters,
      isInsideRadius: true,
      isPresent: true,
      checkedInAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return {
      attendanceId,
      isPresent: true,
      isInsideRadius: true,
      distanceMeters,
      allowedRadiusMeters: event.radiusMeters,
      checkedInAt: now,
      message: "Attendance accepted.",
    };
  },
});

export const getAttendanceByRegistration = query({
  args: { registrationId: v.id("eventRegistrations") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const registration = await ctx.db.get(args.registrationId);
    if (!registration || registration.userId !== user._id) {
      return null;
    }

    const attendance = await getAttendanceByRegistrationInternal(
      ctx,
      args.registrationId,
    );

    return attendance ? toAttendanceRecord(attendance) : null;
  },
});

export const listPublicAttendanceByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) {
      return [];
    }

    const attendanceRecords = await ctx.db
      .query("attendanceRecords")
      .withIndex("by_eventId_and_isPresent", (queryBuilder) => queryBuilder.eq("eventId", args.eventId).eq("isPresent", true))
      .take(100);

    const results = [];
    for (const record of attendanceRecords) {
      const registration = await ctx.db.get(record.registrationId);
      if (!registration) continue;
      
      const character = await ctx.db.get(registration.characterId);
      if (!character) continue;

      results.push({
        id: record._id,
        userId: record.userId,
        latitude: record.latitude,
        longitude: record.longitude,
        firstName: registration.firstName,
        lastName: registration.lastName,
        characterImageUrl: character.imageUrl,
      });
    }

    return results;
  },
});

export const getAttendanceStatistics = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (user.role !== "admin") {
      throw new Error("Admin access is required.");
    }

    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_eventId_and_isAccepted", (queryBuilder) =>
        queryBuilder.eq("eventId", args.eventId).eq("isAccepted", true),
      )
      .take(1000);

    const presentRecords = await ctx.db
      .query("attendanceRecords")
      .withIndex("by_eventId_and_isPresent", (queryBuilder) =>
        queryBuilder.eq("eventId", args.eventId).eq("isPresent", true),
      )
      .take(1000);

    return {
      totalRegistered: registrations.length,
      present: presentRecords.length,
      notPresent: Math.max(registrations.length - presentRecords.length, 0),
    };
  },
});
