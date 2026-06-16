import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

const defaultCharacters = [
  { name: "Drop", imageUrl: "/Characters/Drop_Idle.gif" },
  { name: "Ghosts", imageUrl: "/Characters/Ghosts_idle.gif" },
  { name: "Grandpa", imageUrl: "/Characters/Grandpa_idle.gif" },
  { name: "Mouth", imageUrl: "/Characters/Mouth_idle.gif" },
  { name: "Robo", imageUrl: "/Characters/Robo_idle.gif" },
  { name: "Skull", imageUrl: "/Characters/Skull_idle.gif" },
] as const;

const demoEvents = [
  {
    name: "Demo Event: Rizal Park Meetup",
    locationName: "Rizal Park, Manila",
    latitude: 14.5826,
    longitude: 120.9787,
    radiusMeters: 120,
    imageUrl: "/rizal-shrine.png",
  },
  {
    name: "Demo Event: Intramuros Walk",
    locationName: "Fort Santiago, Intramuros, Manila",
    latitude: 14.5942,
    longitude: 120.9709,
    radiusMeters: 120,
    imageUrl: "/intramuros-removebg-preview.png",
  },
  {
    name: "Demo Event: The Pop Up Katipunan",
    locationName: "The Pop Up Katipunan, Quezon City",
    latitude: 14.633674587379092,
    longitude: 121.07353627681734,
    radiusMeters: 120,
    imageUrl: "/popup.png",
  },
] as const;

const demoAttendees = [
  {
    firstName: "Drew",
    lastName: "Drop",
    email: "demo.drop@example.com",
    characterName: "Drop",
    offset: { latitude: 0.00012, longitude: 0.0001 },
  },
  {
    firstName: "Gina",
    lastName: "Ghost",
    email: "demo.ghosts@example.com",
    characterName: "Ghosts",
    offset: { latitude: -0.0001, longitude: 0.00008 },
  },
  {
    firstName: "Greg",
    lastName: "Grandpa",
    email: "demo.grandpa@example.com",
    characterName: "Grandpa",
    offset: { latitude: 0.00008, longitude: -0.00012 },
  },
  {
    firstName: "Mia",
    lastName: "Mouth",
    email: "demo.mouth@example.com",
    characterName: "Mouth",
    offset: { latitude: -0.00009, longitude: -0.00006 },
  },
  {
    firstName: "Rex",
    lastName: "Robo",
    email: "demo.robo@example.com",
    characterName: "Robo",
    offset: { latitude: 0.00016, longitude: -0.00002 },
  },
  {
    firstName: "Sky",
    lastName: "Skull",
    email: "demo.skull@example.com",
    characterName: "Skull",
    offset: { latitude: -0.00014, longitude: 0.00014 },
  },
] as const;

const demoEmails = [
  "demo.admin@example.com",
  ...demoAttendees.map((attendee) => attendee.email),
];

// We will keep this exported if needed by tests, but prefix with _ to ignore unused warning if unused
export const _demoEmails = demoEmails;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function calculateDistanceInMeters(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
) {
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

  return (
    earthRadiusMeters *
    2 *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
}

function toPublicUser(user: Doc<"users">) {
  return {
    id: user._id,
    name: user.name ?? "EventQuest Admin",
    email: user.email ?? "",
    role: user.role ?? "public",
    createdAt: user.createdAt ?? user._creationTime,
    updatedAt: user.updatedAt ?? user._creationTime,
  };
}

export const bootstrapCurrentUserAsAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const currentUserId = await getAuthUserId(ctx);

    if (!currentUserId) {
      throw new Error("Authentication is required.");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser) {
      throw new Error("Authenticated user was not found.");
    }

    const existingAdmins = await ctx.db
      .query("users")
      .withIndex("by_role", (queryBuilder) => queryBuilder.eq("role", "admin"))
      .take(1);

    if (existingAdmins.length > 0 && currentUser.role !== "admin") {
      throw new Error("Admin account has already been bootstrapped.");
    }

    const now = Date.now();
    await ctx.db.patch(currentUserId, {
      role: "admin",
      createdAt: currentUser.createdAt ?? currentUser._creationTime,
      updatedAt: now,
    });

    const updatedUser = await ctx.db.get(currentUserId);
    if (!updatedUser) {
      throw new Error("Updated admin user was not found.");
    }

    return toPublicUser(updatedUser);
  },
});

export const seedDefaultData = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let created = 0;
    let updated = 0;

    for (const character of defaultCharacters) {
      const existingCharacter = await ctx.db
        .query("characters")
        .withIndex("by_name", (queryBuilder) =>
          queryBuilder.eq("name", character.name),
        )
        .unique();

      if (existingCharacter) {
        await ctx.db.patch(existingCharacter._id, {
          imageUrl: character.imageUrl,
          isActive: true,
          updatedAt: now,
        });
        updated += 1;
        continue;
      }

      await ctx.db.insert("characters", {
        name: character.name,
        imageUrl: character.imageUrl,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
      created += 1;
    }

    return {
      characters: {
        created,
        updated,
        total: defaultCharacters.length,
      },
    };
  },
});

export const clearAuthAndUsers = mutation({
  args: {},
  handler: async (ctx) => {
    // This deletes ALL auth records and user records to fix InvalidAccountId
    const authSessions = await ctx.db.query("authSessions").collect();
    for (const session of authSessions) await ctx.db.delete(session._id);

    const authAccounts = await ctx.db.query("authAccounts").collect();
    for (const account of authAccounts) await ctx.db.delete(account._id);
    
    const users = await ctx.db.query("users").collect();
    for (const user of users) await ctx.db.delete(user._id);

    return { clearedSessions: authSessions.length, clearedAccounts: authAccounts.length, clearedUsers: users.length };
  }
});

export const clearAuthAndUsers = mutation({
  args: {},
  handler: async (ctx) => {
    // This deletes ALL auth records and user records to fix InvalidAccountId
    const authSessions = await ctx.db.query("authSessions").collect();
    for (const session of authSessions) await ctx.db.delete(session._id);

    const authAccounts = await ctx.db.query("authAccounts").collect();
    for (const account of authAccounts) await ctx.db.delete(account._id);
    
    const users = await ctx.db.query("users").collect();
    for (const user of users) await ctx.db.delete(user._id);

    return { clearedSessions: authSessions.length, clearedAccounts: authAccounts.length, clearedUsers: users.length };
  }
});

export const dumpAuth = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("authAccounts").collect();
  }
});

export const seedDemoEvents = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const eventDate = new Date(now);
    eventDate.setHours(0, 0, 0, 0);
    let cleanedEvents = 0;
    let cleanedRegistrations = 0;
    let cleanedAttendance = 0;
    let cleanedUsers = 0;

    const eventsToRefresh = await ctx.db
      .query("events")
      .withIndex("by_eventDate")
      .take(100);

    for (const event of eventsToRefresh) {
      const shouldRefreshEvent =
        demoEvents.some((demoEvent) => demoEvent.name === event.name) ||
        (event.name.toLowerCase() === "test" &&
          event.locationName.toLowerCase() === "pop up");

      if (!shouldRefreshEvent) {
        continue;
      }

      const attendanceRecords = await ctx.db
        .query("attendanceRecords")
        .withIndex("by_eventId", (queryBuilder) =>
          queryBuilder.eq("eventId", event._id),
        )
        .take(100);

      for (const attendanceRecord of attendanceRecords) {
        await ctx.db.delete(attendanceRecord._id);
        cleanedAttendance += 1;
      }

      const registrations = await ctx.db
        .query("eventRegistrations")
        .withIndex("by_eventId", (queryBuilder) =>
          queryBuilder.eq("eventId", event._id),
        )
        .take(100);

      for (const registration of registrations) {
        await ctx.db.delete(registration._id);
        cleanedRegistrations += 1;
      }

      await ctx.db.delete(event._id);
      cleanedEvents += 1;
    }

    const characterIdsByName = new Map<string, Id<"characters">>();
    for (const character of defaultCharacters) {
      const existingCharacter = (
        await ctx.db
          .query("characters")
          .withIndex("by_name", (queryBuilder) =>
            queryBuilder.eq("name", character.name),
          )
          .take(1)
      )[0];

      if (existingCharacter) {
        await ctx.db.patch(existingCharacter._id, {
          imageUrl: character.imageUrl,
          isActive: true,
          updatedAt: now,
        });
        characterIdsByName.set(character.name, existingCharacter._id);
        continue;
      }

      const characterId = await ctx.db.insert("characters", {
        name: character.name,
        imageUrl: character.imageUrl,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
      characterIdsByName.set(character.name, characterId);
    }

    let demoAdmin = (
      await ctx.db
        .query("users")
        .withIndex("email", (queryBuilder) =>
          queryBuilder.eq("email", "demo.admin@example.com"),
        )
        .take(1)
    )[0];

    if (demoAdmin) {
      await ctx.db.patch(demoAdmin._id, {
        role: "admin",
        selectedCharacterId: characterIdsByName.get("Drop"),
        updatedAt: now,
      });
    } else {
      const newAdminId = await ctx.db.insert("users", {
        name: "Demo Admin",
        email: "demo.admin@example.com",
        role: "admin",
        selectedCharacterId: characterIdsByName.get("Drop"),
        createdAt: now,
        updatedAt: now,
      });
      demoAdmin = await ctx.db.get(newAdminId) as any;
    }

    const adminId = demoAdmin!._id;

    const publicUserIdsByEmail = new Map<string, Id<"users">>();
    for (const attendee of demoAttendees) {
      const characterId = characterIdsByName.get(attendee.characterName);
      
      const existingUser = (
        await ctx.db
          .query("users")
          .withIndex("email", (queryBuilder) =>
            queryBuilder.eq("email", attendee.email),
          )
          .take(1)
      )[0];

      if (existingUser) {
        await ctx.db.patch(existingUser._id, {
          name: `${attendee.firstName} ${attendee.lastName}`,
          role: "public",
          selectedCharacterId: characterId,
          updatedAt: now,
        });
        publicUserIdsByEmail.set(attendee.email, existingUser._id);
        continue;
      }

      const userId = await ctx.db.insert("users", {
        name: `${attendee.firstName} ${attendee.lastName}`,
        email: attendee.email,
        role: "public",
        selectedCharacterId: characterId,
        createdAt: now,
        updatedAt: now,
      });
      publicUserIdsByEmail.set(attendee.email, userId);
    }

    const eventIds = [];
    let eventsCreated = 0;
    let registrationsCreated = 0;
    let attendanceCreated = 0;

    for (const demoEvent of demoEvents) {
      const eventFields = {
        name: demoEvent.name,
        locationName: demoEvent.locationName,
        latitude: demoEvent.latitude,
        longitude: demoEvent.longitude,
        radiusMeters: demoEvent.radiusMeters,
        maximumParticipants: 10,
        eventDate: eventDate.getTime(),
        attendanceStartAt: now - 60 * 60 * 1000,
        attendanceEndAt: now + 6 * 60 * 60 * 1000,
        status: "open" as const,
        imageUrl: demoEvent.imageUrl,
        createdBy: adminId,
        updatedAt: now,
      };

      const eventId = await ctx.db.insert("events", {
        ...eventFields,
        createdAt: now,
      });
      eventsCreated += 1;

      eventIds.push(eventId);

      for (const attendee of demoAttendees) {
        const userId = publicUserIdsByEmail.get(attendee.email);
        const characterId = characterIdsByName.get(attendee.characterName);

        if (!userId || !characterId) {
          continue;
        }

        const registrationId = await ctx.db.insert("eventRegistrations", {
          eventId,
          userId,
          characterId,
          firstName: attendee.firstName,
          lastName: attendee.lastName,
          isAccepted: true,
          registeredAt: now,
          createdAt: now,
          updatedAt: now,
        });
        registrationsCreated += 1;

        const latitude = demoEvent.latitude + attendee.offset.latitude;
        const longitude = demoEvent.longitude + attendee.offset.longitude;
        const distanceMeters = calculateDistanceInMeters(
          { latitude: demoEvent.latitude, longitude: demoEvent.longitude },
          { latitude, longitude },
        );

        await ctx.db.insert("attendanceRecords", {
          eventId,
          registrationId,
          userId,
          latitude,
          longitude,
          accuracyMeters: 8,
          distanceMeters,
          isInsideRadius: true,
          isPresent: true,
          checkedInAt: now,
          createdAt: now,
          updatedAt: now,
        });
        attendanceCreated += 1;
      }
    }

    return {
      events: {
        created: eventsCreated,
        cleaned: cleanedEvents,
        total: demoEvents.length,
        ids: eventIds,
      },
      users: {
        cleaned: cleanedUsers,
        publicUsers: demoAttendees.length,
        adminUsers: 1,
      },
      registrations: {
        created: registrationsCreated,
        cleaned: cleanedRegistrations,
        totalExpected: demoEvents.length * demoAttendees.length,
      },
      attendance: {
        created: attendanceCreated,
        cleaned: cleanedAttendance,
        totalExpected: demoEvents.length * demoAttendees.length,
      },
    };
  },
});
