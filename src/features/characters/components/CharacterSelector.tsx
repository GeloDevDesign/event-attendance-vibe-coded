import { type JSX, useEffect } from "react";

import { getActiveCharacters, sortCharactersByName } from "../services/characterService";
import type { CharacterSelectorProps } from "../types/character.types";
import { CharacterCarousel } from "./CharacterCarousel";

export function CharacterSelector({
  characters,
  selectedCharacterId,
  onSelect,
  disabled = false,
  emptyMessage = "No active characters are available right now.",
}: CharacterSelectorProps): JSX.Element {
  const selectableCharacters = sortCharactersByName(getActiveCharacters(characters));
  
  useEffect(() => {
    if (selectableCharacters.length > 0 && !selectedCharacterId && onSelect) {
      onSelect(selectableCharacters[0].id);
    }
  }, [selectableCharacters, selectedCharacterId, onSelect]);

  if (disabled) {
    return <p>Character selection is currently unavailable.</p>;
  }

  if (selectableCharacters.length === 0) {
    return <p className="text-[10px] text-black">{emptyMessage}</p>;
  }

  return (
    <CharacterCarousel
      characters={selectableCharacters}
      selectedCharacterId={selectedCharacterId}
      onSelect={onSelect}
    />
  );
}
