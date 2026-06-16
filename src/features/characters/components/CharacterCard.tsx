import type { JSX } from "react";

import type { Id } from "../../../../convex/_generated/dataModel";
import type { CharacterRecord } from "../types/character.types";

export interface CharacterCardProps {
  character: CharacterRecord;
  isSelected?: boolean;
  onSelect?(characterId: Id<"characters">): void;
  onToggleActive?(characterId: Id<"characters">, isActive: boolean): void;
  onEdit?(character: CharacterRecord): void;
}

export function CharacterCard({
  character,
  isSelected = false,
  onSelect,
  onToggleActive,
  onEdit,
}: CharacterCardProps): JSX.Element {
  const statusLabel = character.isActive ? "Active" : "Inactive";

  return (
    <article
      aria-label={`Character ${character.name}`}
      data-selected={isSelected}
      style={{
        border: "1px solid #d1d5db",
        borderRadius: "0.75rem",
        padding: "1rem",
        display: "grid",
        gap: "0.75rem",
      }}
    >
      <img
        src={character.imageUrl}
        alt={character.name}
        style={{
          width: "100%",
          maxWidth: "9rem",
          aspectRatio: "1 / 1",
          objectFit: "contain",
        }}
      />
      <div>
        <h3 style={{ margin: 0 }}>{character.name}</h3>
        <p style={{ margin: "0.25rem 0 0", color: "#4b5563" }}>{statusLabel}</p>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(character.id)}
            disabled={!character.isActive}
            aria-pressed={isSelected}
          >
            {isSelected ? "Selected" : "Select"}
          </button>
        ) : null}
        {onEdit ? (
          <button type="button" onClick={() => onEdit(character)}>
            Edit
          </button>
        ) : null}
        {onToggleActive ? (
          <button
            type="button"
            onClick={() => onToggleActive(character.id, !character.isActive)}
          >
            {character.isActive ? "Deactivate" : "Activate"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
