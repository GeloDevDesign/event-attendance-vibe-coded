import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      return null;
    }

    return {
      id: user._id,
      name: user.name ?? "EventQuest User",
      email: user.email ?? "",
      role: user.role ?? "public",
      selectedCharacterId: user.selectedCharacterId ?? null,
      createdAt: user.createdAt ?? user._creationTime,
      updatedAt: user.updatedAt ?? user._creationTime,
    };
  },
});

export const getUserRole = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    return user?.role ?? "public";
  },
});

export const setSelectedCharacter = mutation({
  args: {
    characterId: v.id("characters"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Authentication is required.");
    }

    const character = await ctx.db.get(args.characterId);

    if (!character || !character.isActive) {
      throw new Error("Please select an active character.");
    }

    await ctx.db.patch(userId, {
      selectedCharacterId: args.characterId,
      updatedAt: Date.now(),
    });

    return args.characterId;
  },
});
