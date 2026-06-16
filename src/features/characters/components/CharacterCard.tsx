import type { JSX } from "react";

import type { Id } from "../../../../convex/_generated/dataModel";
import type { CharacterRecord } from "../types/character.types";
import { PixelButton } from "../../../components/PixelButton";

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
      className={`grid gap-3 border-4 border-black p-4 text-left shadow-[4px_4px_0_0_#000] ${
        isSelected ? "bg-emerald-200" : "bg-white"
      }`}
    >
      <div className="bg-[#111] border-4 border-black rounded-lg w-[80px] h-[80px] flex items-center justify-center shadow-[inset_2px_2px_0_rgba(0,0,0,0.5)]">
        <img
          src={character.imageUrl}
          alt={character.name}
          className="h-16 w-16 object-contain [image-rendering:pixelated]"
        />
      </div>
      <div>
        <h3 className="text-[12px] text-black uppercase drop-shadow-[1px_1px_0_#fff] leading-snug">{character.name}</h3>
        <p className="text-[10px] text-stone-600 mt-1 uppercase">{statusLabel}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {onSelect ? (
          <PixelButton
            variant={isSelected ? "accent" : "primary"}
            className="!w-auto !min-h-[40px] !px-3"
            type="button"
            onClick={() => onSelect(character.id)}
            disabled={!character.isActive}
            aria-pressed={isSelected}
          >
            {isSelected ? "SELECTED" : "SELECT"}
          </PixelButton>
        ) : null}
        {onEdit ? (
          <PixelButton variant="secondary" className="!w-auto !min-h-[40px] !px-3" type="button" onClick={() => onEdit(character)}>
            EDIT
          </PixelButton>
        ) : null}
        {onToggleActive ? (
          <PixelButton
            variant="secondary"
            className="!w-auto !min-h-[40px] !px-3"
            type="button"
            onClick={() => onToggleActive(character.id, !character.isActive)}
          >
            {character.isActive ? "DEACTIVATE" : "ACTIVATE"}
          </PixelButton>
        ) : null}
      </div>
    </article>
  );
}
