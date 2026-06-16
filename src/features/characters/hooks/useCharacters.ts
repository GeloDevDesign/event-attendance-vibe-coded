import { useMutation, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
  getActiveCharacters,
  sortCharactersByName,
} from "../services/characterService";
import type {
  CharacterFormValues,
  CharacterRecord,
  CharacterScope,
  SetCharacterActiveStateValues,
  UpdateCharacterValues,
} from "../types/character.types";

export interface UseCharactersOptions {
  scope?: CharacterScope;
}

export interface UseCharactersResult {
  characters: CharacterRecord[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  createCharacter(values: CharacterFormValues): Promise<Id<"characters">>;
  updateCharacter(values: UpdateCharacterValues): Promise<Id<"characters">>;
  setCharacterActiveState(
    values: SetCharacterActiveStateValues,
  ): Promise<Id<"characters">>;
  seedDefaultCharacters(): Promise<Id<"characters">[]>;
}

function toCharacterRecord(character: Doc<"characters">): CharacterRecord {
  return {
    id: character._id,
    name: character.name,
    imageUrl: character.imageUrl,
    isActive: character.isActive,
    createdAt: character.createdAt,
    updatedAt: character.updatedAt,
  };
}

export function useCharacters(options: UseCharactersOptions = {}): UseCharactersResult {
  const scope = options.scope ?? "active";
  const rawCharacters =
    useQuery(
      scope === "all" ? api.characters.listAllCharacters : api.characters.listActiveCharacters,
      {},
    ) ?? undefined;

  const createCharacterMutation = useMutation(api.characters.createCharacter);
  const updateCharacterMutation = useMutation(api.characters.updateCharacter);
  const setCharacterActiveStateMutation = useMutation(
    api.characters.setCharacterActiveState,
  );
  const seedDefaultCharactersMutation = useMutation(api.characters.seedDefaultCharacters);

  const characterRecords = (rawCharacters ?? []).map(toCharacterRecord);
  const characters = sortCharactersByName(
    scope === "active" ? getActiveCharacters(characterRecords) : characterRecords,
  );

  return {
    characters,
    isLoading: rawCharacters === undefined,
    error: null,
    isEmpty: rawCharacters !== undefined && characters.length === 0,
    async createCharacter(values) {
      return await createCharacterMutation(values);
    },
    async updateCharacter(values) {
      return await updateCharacterMutation(values);
    },
    async setCharacterActiveState(values) {
      return await setCharacterActiveStateMutation(values);
    },
    async seedDefaultCharacters() {
      return await seedDefaultCharactersMutation({});
    },
  };
}
