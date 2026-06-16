import type { Id } from "../../../../convex/_generated/dataModel";

export interface CharacterRecord {
  id: Id<"characters">;
  name: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CharacterFormValues {
  name: string;
  imageUrl: string;
  isActive: boolean;
}

export interface UpdateCharacterValues extends CharacterFormValues {
  characterId: Id<"characters">;
}

export interface SetCharacterActiveStateValues {
  characterId: Id<"characters">;
  isActive: boolean;
}

export type CharacterScope = "active" | "all";

export interface CharacterSelectorProps {
  characters: CharacterRecord[];
  selectedCharacterId?: Id<"characters">;
  onSelect(characterId: Id<"characters">): void;
  disabled?: boolean;
  emptyMessage?: string;
}
