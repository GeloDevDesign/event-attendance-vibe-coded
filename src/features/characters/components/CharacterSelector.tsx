import type { JSX } from "react";

import { getActiveCharacters, sortCharactersByName } from "../services/characterService";
import type { CharacterSelectorProps } from "../types/character.types";
import { CharacterGrid } from "./CharacterGrid";

export function CharacterSelector({
  characters,
  selectedCharacterId,
  onSelect,
  disabled = false,
  emptyMessage = "No active characters are available right now.",
}: CharacterSelectorProps): JSX.Element {
  const selectableCharacters = sortCharactersByName(getActiveCharacters(characters));

  if (disabled) {
    return <p>Character selection is currently unavailable.</p>;
  }

  return (
    <CharacterGrid
      characters={selectableCharacters}
      selectedCharacterId={selectedCharacterId}
      onSelect={onSelect}
      emptyMessage={emptyMessage}
    />
  );
}
