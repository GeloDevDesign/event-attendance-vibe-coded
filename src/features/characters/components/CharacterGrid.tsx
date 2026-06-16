import type { JSX } from "react";

import type { Id } from "../../../../convex/_generated/dataModel";
import { CharacterCard } from "./CharacterCard";
import type { CharacterRecord } from "../types/character.types";

export interface CharacterGridProps {
  characters: CharacterRecord[];
  selectedCharacterId?: Id<"characters">;
  emptyMessage?: string;
  onSelect?(characterId: Id<"characters">): void;
  onToggleActive?(characterId: Id<"characters">, isActive: boolean): void;
  onEdit?(character: CharacterRecord): void;
}

export function CharacterGrid({
  characters,
  selectedCharacterId,
  emptyMessage = "No characters available.",
  onSelect,
  onToggleActive,
  onEdit,
}: CharacterGridProps): JSX.Element {
  if (characters.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <section
      aria-label="Character grid"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          isSelected={character.id === selectedCharacterId}
          onSelect={onSelect}
          onToggleActive={onToggleActive}
          onEdit={onEdit}
        />
      ))}
    </section>
  );
}
