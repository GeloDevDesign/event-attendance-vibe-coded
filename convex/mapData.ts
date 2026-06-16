import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAdminAttendanceMapData = query({
  args: { eventId: v.id("events") },
  handler: async () => {
    return [];
  },
});

export const getUserAttendanceMapData = query({
  args: {
    eventId: v.id("events"),
    registrationId: v.id("eventRegistrations"),
  },
  handler: async () => {
    return null;
  },
});
