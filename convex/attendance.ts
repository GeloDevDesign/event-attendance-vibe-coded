import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const checkInAttendance = mutation({
  args: {
    eventId: v.id("events"),
    registrationId: v.id("eventRegistrations"),
    latitude: v.number(),
    longitude: v.number(),
    accuracyMeters: v.number(),
  },
  handler: async () => {
    return null;
  },
});

export const getAttendanceByRegistration = query({
  args: { registrationId: v.id("eventRegistrations") },
  handler: async () => {
    return null;
  },
});

export const listAttendanceByEvent = query({
  args: { eventId: v.id("events") },
  handler: async () => {
    return [];
  },
});

export const getAttendanceStatistics = query({
  args: { eventId: v.id("events") },
  handler: async () => {
    return null;
  },
});
