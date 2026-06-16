"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("convex/server");
const values_1 = require("convex/values");
const eventStatusValidator = values_1.v.union(values_1.v.literal("draft"), values_1.v.literal("open"), values_1.v.literal("ongoing"), values_1.v.literal("completed"), values_1.v.literal("cancelled"));
const userRoleValidator = values_1.v.union(values_1.v.literal("admin"), values_1.v.literal("public"));
exports.default = (0, server_1.defineSchema)({
    users: (0, server_1.defineTable)({
        tokenIdentifier: values_1.v.string(),
        name: values_1.v.string(),
        email: values_1.v.string(),
        role: userRoleValidator,
        createdAt: values_1.v.number(),
        updatedAt: values_1.v.number(),
    })
        .index("by_email", ["email"])
        .index("by_tokenIdentifier", ["tokenIdentifier"])
        .index("by_role", ["role"]),
    events: (0, server_1.defineTable)({
        name: values_1.v.string(),
        locationName: values_1.v.string(),
        latitude: values_1.v.number(),
        longitude: values_1.v.number(),
        radiusMeters: values_1.v.number(),
        maximumParticipants: values_1.v.number(),
        eventDate: values_1.v.number(),
        attendanceStartAt: values_1.v.number(),
        attendanceEndAt: values_1.v.number(),
        status: eventStatusValidator,
        createdBy: values_1.v.id("users"),
        createdAt: values_1.v.number(),
        updatedAt: values_1.v.number(),
    })
        .index("by_status", ["status"])
        .index("by_createdBy", ["createdBy"])
        .index("by_eventDate", ["eventDate"])
        .index("by_attendanceStartAt", ["attendanceStartAt"]),
    characters: (0, server_1.defineTable)({
        name: values_1.v.string(),
        imageUrl: values_1.v.string(),
        isActive: values_1.v.boolean(),
        createdAt: values_1.v.number(),
        updatedAt: values_1.v.number(),
    })
        .index("by_isActive", ["isActive"])
        .index("by_name", ["name"]),
    eventRegistrations: (0, server_1.defineTable)({
        eventId: values_1.v.id("events"),
        userId: values_1.v.id("users"),
        characterId: values_1.v.id("characters"),
        firstName: values_1.v.string(),
        lastName: values_1.v.string(),
        isAccepted: values_1.v.boolean(),
        registeredAt: values_1.v.number(),
        createdAt: values_1.v.number(),
        updatedAt: values_1.v.number(),
    })
        .index("by_eventId", ["eventId"])
        .index("by_userId", ["userId"])
        .index("by_characterId", ["characterId"])
        .index("by_eventId_and_userId", ["eventId", "userId"])
        .index("by_eventId_and_isAccepted", ["eventId", "isAccepted"]),
    attendanceRecords: (0, server_1.defineTable)({
        eventId: values_1.v.id("events"),
        registrationId: values_1.v.id("eventRegistrations"),
        userId: values_1.v.id("users"),
        latitude: values_1.v.number(),
        longitude: values_1.v.number(),
        accuracyMeters: values_1.v.number(),
        distanceMeters: values_1.v.number(),
        isInsideRadius: values_1.v.literal(true),
        isPresent: values_1.v.literal(true),
        checkedInAt: values_1.v.number(),
        createdAt: values_1.v.number(),
        updatedAt: values_1.v.number(),
    })
        .index("by_eventId", ["eventId"])
        .index("by_registrationId", ["registrationId"])
        .index("by_userId", ["userId"])
        .index("by_eventId_and_isPresent", ["eventId", "isPresent"])
        .index("by_eventId_and_userId", ["eventId", "userId"]),
});
