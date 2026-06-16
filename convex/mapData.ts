import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

async function requireAdmin(ctx: QueryCtx): Promise<Doc<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication is required.");
  }

  const user = await ctx.db.get(userId);
  if (!user || user.role !== "admin") {
    throw new Error("Admin access is required.");
  }

  return user;
}

export const getAdminAttendanceMapData = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_eventId", (queryBuilder) =>
        queryBuilder.eq("eventId", args.eventId),
      )
      .take(100);

    const attendees = [];

    for (const registration of registrations) {
      const [character, attendance] = await Promise.all([
        ctx.db.get(registration.characterId),
        ctx.db
          .query("attendanceRecords")
          .withIndex("by_registrationId", (queryBuilder) =>
            queryBuilder.eq("registrationId", registration._id),
          )
          .unique(),
      ]);

      if (!character) {
        continue;
      }

      attendees.push({
        registrationId: registration._id,
        userId: registration.userId,
        attendeeName: `${registration.firstName} ${registration.lastName}`,
        characterName: character.name,
        characterImageUrl: character.imageUrl,
        isPresent: Boolean(attendance),
        latitude: attendance?.latitude ?? null,
        longitude: attendance?.longitude ?? null,
        accuracyMeters: attendance?.accuracyMeters ?? null,
        distanceMeters: attendance?.distanceMeters ?? null,
        checkedInAt: attendance?.checkedInAt ?? null,
      });
    }

    return attendees;
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
