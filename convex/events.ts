import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
};

export const listOpenEvents = query({
  args: {},
  handler: async () => {
    return [];
  },
});

export const listAllEvents = query({
  args: {},
  handler: async () => {
    return [];
  },
});

export const getEventById = query({
  args: { eventId: v.id("events") },
  handler: async () => {
    return null;
  },
});

export const createEvent = mutation({
  args: eventFields,
  handler: async () => {
    return null;
  },
});

export const updateEvent = mutation({
  args: {
    eventId: v.id("events"),
    ...eventFields,
  },
  handler: async () => {
    return null;
  },
});

export const changeEventStatus = mutation({
  args: {
    eventId: v.id("events"),
    status: eventStatusValidator,
  },
  handler: async () => {
    return null;
  },
});

export const getEventRegistrationCount = query({
  args: { eventId: v.id("events") },
  handler: async () => {
    return null;
  },
});
