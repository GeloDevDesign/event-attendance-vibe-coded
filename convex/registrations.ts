import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const registerForEvent = mutation({
  args: {
    eventId: v.id("events"),
    characterId: v.id("characters"),
    firstName: v.string(),
    lastName: v.string(),
  },
  handler: async () => {
    return null;
  },
});

export const getRegistrationByEventAndUser = query({
  args: { eventId: v.id("events") },
  handler: async () => {
    return null;
  },
});

export const listRegistrationsByEvent = query({
  args: { eventId: v.id("events") },
  handler: async () => {
    return [];
  },
});

export const listJoinedEvents = query({
  args: {},
  handler: async () => {
    return [];
  },
});

export const getRegistrationCountByEvent = query({
  args: { eventId: v.id("events") },
  handler: async () => {
    return null;
  },
});
