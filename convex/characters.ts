import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";

const characterFields = {
  name: v.string(),
  imageUrl: v.string(),
  isActive: v.boolean(),
};

const defaultCharacters = [
  { name: "Drop", imageUrl: "/Characters/Drop_Idle.gif" },
  { name: "Ghosts", imageUrl: "/Characters/Ghosts_idle.gif" },
  { name: "Grandpa", imageUrl: "/Characters/Grandpa_idle.gif" },
  { name: "Mouth", imageUrl: "/Characters/Mouth_idle.gif" },
  { name: "Robo", imageUrl: "/Characters/Robo_idle.gif" },
  { name: "Skull", imageUrl: "/Characters/Skull_idle.gif" },
] as const;

function normalizeCharacterInput(args: { name: string; imageUrl: string }) {
  const name = args.name.trim();
  const imageUrl = args.imageUrl.trim();

  if (name.length === 0) {
    throw new Error("Character name is required.");
  }

  if (imageUrl.length === 0) {
    throw new Error("Character image URL is required.");
  }

  return { name, imageUrl };
}

async function getAuthenticatedUser(
  ctx: QueryCtx | MutationCtx,
): Promise<Doc<"users">> {
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

export const listActiveCharacters = query({
  args: {},
  handler: async (ctx) => {
    const activeCharacters = await ctx.db
      .query("characters")
      .withIndex("by_isActive", (queryBuilder) => queryBuilder.eq("isActive", true))
      .take(100);

    return activeCharacters;
  },
});

export const listAllCharacters = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const characters = await ctx.db.query("characters").withIndex("by_name").take(100);
    return characters;
  },
});

export const createCharacter = mutation({
  args: characterFields,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const normalized = normalizeCharacterInput(args);
    const now = Date.now();

    const characterId = await ctx.db.insert("characters", {
      name: normalized.name,
      imageUrl: normalized.imageUrl,
      isActive: args.isActive,
      createdAt: now,
      updatedAt: now,
    });

    return characterId;
  },
});

export const updateCharacter = mutation({
  args: {
    characterId: v.id("characters"),
    ...characterFields,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const normalized = normalizeCharacterInput(args);

    const existingCharacter = await ctx.db.get(args.characterId);
    if (!existingCharacter) {
      throw new Error("Character was not found.");
    }

    await ctx.db.patch(args.characterId, {
      name: normalized.name,
      imageUrl: normalized.imageUrl,
      isActive: args.isActive,
      updatedAt: Date.now(),
    });

    return args.characterId;
  },
});

export const setCharacterActiveState = mutation({
  args: {
    characterId: v.id("characters"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existingCharacter = await ctx.db.get(args.characterId);
    if (!existingCharacter) {
      throw new Error("Character was not found.");
    }

    await ctx.db.patch(args.characterId, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });

    return args.characterId;
  },
});

export const seedDefaultCharacters = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const now = Date.now();
    const seededCharacterIds = [];

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
        seededCharacterIds.push(existingCharacter._id);
        continue;
      }

      const characterId = await ctx.db.insert("characters", {
        name: character.name,
        imageUrl: character.imageUrl,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
      seededCharacterIds.push(characterId);
    }

    return seededCharacterIds;
  },
});
