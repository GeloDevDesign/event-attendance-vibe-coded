import type { CharacterFormValues, CharacterRecord } from "../types/character.types";

export interface CharacterValidationResult {
  isValid: boolean;
  errors: string[];
}

export function getActiveCharacters(characters: CharacterRecord[]): CharacterRecord[] {
  return characters.filter((character) => character.isActive);
}

export function sortCharactersByName(characters: CharacterRecord[]): CharacterRecord[] {
  return [...characters].sort((left, right) => left.name.localeCompare(right.name));
}

export function isCharacterSelectable(character: CharacterRecord): boolean {
  return character.isActive;
}

export function validateCharacterFormValues(
  values: CharacterFormValues,
): CharacterValidationResult {
  const errors: string[] = [];

  if (values.name.trim().length === 0) {
    errors.push("Character name is required.");
  }

  if (values.imageUrl.trim().length === 0) {
    errors.push("Character image URL is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
