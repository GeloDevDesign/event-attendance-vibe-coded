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
      className={`grid gap-3 rounded-md border p-4 text-left ${
        isSelected ? "border-emerald-700 bg-emerald-50" : "border-stone-300 bg-white"
      }`}
    >
      <img
        src={character.imageUrl}
        alt={character.name}
        className="h-20 w-20 object-contain [image-rendering:pixelated]"
      />
      <div>
        <h3 className="font-black text-slate-950">{character.name}</h3>
        <p className="text-sm text-slate-600">{statusLabel}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {onSelect ? (
          <button
            className="rounded-md bg-emerald-950 px-3 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={() => onSelect(character.id)}
            disabled={!character.isActive}
            aria-pressed={isSelected}
          >
            {isSelected ? "Selected" : "Select"}
          </button>
        ) : null}
        {onEdit ? (
          <button className="rounded-md border border-stone-300 px-3 py-2 text-sm font-bold" type="button" onClick={() => onEdit(character)}>
            Edit
          </button>
        ) : null}
        {onToggleActive ? (
          <button
            className="rounded-md border border-stone-300 px-3 py-2 text-sm font-bold"
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
