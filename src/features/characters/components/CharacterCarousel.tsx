import { useState, useEffect, type JSX } from "react";

import type { Id } from "../../../../convex/_generated/dataModel";
import type { CharacterRecord } from "../types/character.types";

export interface CharacterCarouselProps {
  characters: CharacterRecord[];
  selectedCharacterId?: Id<"characters">;
  onSelect(characterId: Id<"characters">): void;
}

export function CharacterCarousel({
  characters,
  selectedCharacterId,
  onSelect,
}: CharacterCarouselProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync index with selectedCharacterId if it changes externally
  useEffect(() => {
    if (selectedCharacterId) {
      const index = characters.findIndex(c => c.id === selectedCharacterId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [selectedCharacterId, characters]);

  function handlePrevious() {
    const newIndex = currentIndex === 0 ? characters.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onSelect(characters[newIndex].id);
  }

  function handleNext() {
    const newIndex = currentIndex === characters.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onSelect(characters[newIndex].id);
  }

  if (characters.length === 0) return <></>;

  const currentCharacter = characters[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full font-['Press_Start_2P']">
      <div className="flex items-center justify-between w-full mb-4 px-2">
        <button
          type="button"
          onClick={handlePrevious}
          className="w-10 h-10 border-4 border-black bg-white flex items-center justify-center shadow-[4px_4px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#000] transition-all hover:bg-stone-200"
        >
          <span className="text-[12px] -ml-1">◀</span>
        </button>

        <div className="bg-[#111] border-4 border-black w-[120px] h-[120px] flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,1)] mx-4">
          <img
            src={currentCharacter.imageUrl}
            alt={currentCharacter.name}
            className="w-20 h-20 object-contain [image-rendering:pixelated]"
          />
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="w-10 h-10 border-4 border-black bg-white flex items-center justify-center shadow-[4px_4px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#000] transition-all hover:bg-stone-200"
        >
          <span className="text-[12px] -mr-1">▶</span>
        </button>
      </div>
      
      <div className="text-center mt-2 w-full px-2">
        <h3 className="text-[14px] text-black drop-shadow-[1px_1px_0_#fff] uppercase mb-2">
          {currentCharacter.name}
        </h3>
        <p className="text-[8px] text-stone-600 leading-relaxed min-h-[30px]">
          Hero #{currentIndex + 1} of {characters.length}
        </p>
      </div>
    </div>
  );
}
