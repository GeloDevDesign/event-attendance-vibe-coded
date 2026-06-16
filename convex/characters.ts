import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";

const characterFields = {
  name: v.string(),
  imageUrl: v.string(),
  isActive: v.boolean(),
};

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
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Authentication is required.");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (queryBuilder) =>
      queryBuilder.eq("tokenIdentifier", identity.tokenIdentifier),
    )
    .unique();

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
