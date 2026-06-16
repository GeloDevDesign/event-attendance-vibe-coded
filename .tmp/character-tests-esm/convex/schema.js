import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
const eventStatusValidator = v.union(v.literal("draft"), v.literal("open"), v.literal("ongoing"), v.literal("completed"), v.literal("cancelled"));
const userRoleValidator = v.union(v.literal("admin"), v.literal("public"));
export default defineSchema({
    users: defineTable({
        tokenIdentifier: v.string(),
        name: v.string(),
        email: v.string(),
        role: userRoleValidator,
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_email", ["email"])
        .index("by_tokenIdentifier", ["tokenIdentifier"])
        .index("by_role", ["role"]),
    events: defineTable({
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
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_status", ["status"])
        .index("by_createdBy", ["createdBy"])
        .index("by_eventDate", ["eventDate"])
        .index("by_attendanceStartAt", ["attendanceStartAt"]),
    characters: defineTable({
        name: v.string(),
        imageUrl: v.string(),
        isActive: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_isActive", ["isActive"])
        .index("by_name", ["name"]),
    eventRegistrations: defineTable({
        eventId: v.id("events"),
        userId: v.id("users"),
        characterId: v.id("characters"),
        firstName: v.string(),
        lastName: v.string(),
        isAccepted: v.boolean(),
        registeredAt: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_eventId", ["eventId"])
        .index("by_userId", ["userId"])
        .index("by_characterId", ["characterId"])
        .index("by_eventId_and_userId", ["eventId", "userId"])
        .index("by_eventId_and_isAccepted", ["eventId", "isAccepted"]),
    attendanceRecords: defineTable({
        eventId: v.id("events"),
        registrationId: v.id("eventRegistrations"),
        userId: v.id("users"),
        latitude: v.number(),
        longitude: v.number(),
        accuracyMeters: v.number(),
        distanceMeters: v.number(),
        isInsideRadius: v.literal(true),
        isPresent: v.literal(true),
        checkedInAt: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_eventId", ["eventId"])
        .index("by_registrationId", ["registrationId"])
        .index("by_userId", ["userId"])
        .index("by_eventId_and_isPresent", ["eventId", "isPresent"])
        .index("by_eventId_and_userId", ["eventId", "userId"]),
});
