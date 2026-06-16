import { useMemo, useState, type JSX } from "react";

import type { Id } from "../../convex/_generated/dataModel";
import { CharacterForm } from "../features/characters/components/CharacterForm";
import { CharacterGrid } from "../features/characters/components/CharacterGrid";
import { useCharacters } from "../features/characters/hooks/useCharacters";
import type {
  CharacterFormValues,
  CharacterRecord,
} from "../features/characters/types/character.types";
import { PixelLayout } from "../components/PixelLayout";

export function AdminCharactersPage(): JSX.Element {
  const {
    characters,
    isLoading,
    error,
    isEmpty,
    createCharacter,
    updateCharacter,
    setCharacterActiveState,
    seedDefaultCharacters,
  } = useCharacters({ scope: "all" });

  const [selectedCharacter, setSelectedCharacter] = useState<CharacterRecord | null>(null);
  const [pageMessage, setPageMessage] = useState<string | null>(null);

  const formTitle = useMemo(
    () => (selectedCharacter ? `Edit ${selectedCharacter.name}` : "Create character"),
    [selectedCharacter],
  );

  async function handleCreate(values: CharacterFormValues) {
    await createCharacter(values);
    setSelectedCharacter(null);
    setPageMessage("Character created successfully.");
  }

  async function handleUpdate(values: CharacterFormValues) {
    if (!selectedCharacter) {
      await handleCreate(values);
      return;
    }

    await updateCharacter({
      characterId: selectedCharacter.id,
      ...values,
    });
    setPageMessage("Character updated successfully.");
  }

  async function handleToggleActive(
    characterId: Id<"characters">,
    isActive: boolean,
  ) {
    await setCharacterActiveState({ characterId, isActive });
    setPageMessage(
      isActive ? "Character activated successfully." : "Character deactivated successfully.",
    );
  }

  async function handleSeedDefaultCharacters() {
    const characterIds = await seedDefaultCharacters();
    setPageMessage(`${characterIds.length} default characters are ready.`);
  }

  return (
    <PixelLayout maxWidth="max-w-[1000px]">
      <header className="mb-8 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-end border-b-4 border-black pb-6">
        <div>
          <h1 className="text-2xl text-black mb-2 uppercase drop-shadow-[1px_1px_0_#fff]">Characters</h1>
          <p className="text-[10px] text-stone-700 leading-relaxed">Create, edit, activate, and deactivate selectable characters.</p>
        </div>
        <button 
          className="h-12 border-4 border-black bg-[#3db5e6] px-4 text-[10px] text-white tracking-widest transition hover:bg-[#5cd0fc] active:translate-y-[2px] active:translate-x-[2px] shadow-[4px_4px_0_0_#000] active:shadow-none"
          type="button" 
          onClick={() => void handleSeedDefaultCharacters()}
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          SEED DEFAULT
        </button>
      </header>

      <div className="grid lg:grid-cols-[350px_1fr] gap-8">
        <section>
          <h2 className="text-[12px] text-black mb-4 uppercase drop-shadow-[1px_1px_0_#fff]">{formTitle}</h2>
          <div className="border-4 border-black bg-[#111] p-6 shadow-[inset_4px_4px_0_rgba(0,0,0,0.5)]">
            <CharacterForm
              initialValues={selectedCharacter ?? undefined}
              onSubmit={selectedCharacter ? handleUpdate : handleCreate}
              submitLabel={selectedCharacter ? "UPDATE" : "CREATE"}
            />
          </div>
        </section>

        <section>
          <h2 className="text-[12px] text-black mb-4 uppercase drop-shadow-[1px_1px_0_#fff]">Roster</h2>
          {isLoading ? <p className="text-[10px] border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000] mb-4">Loading characters...</p> : null}
          {error ? <p className="text-[10px] border-4 border-black bg-red-500 text-white p-4 shadow-[4px_4px_0_0_#000] mb-4" role="alert">{error}</p> : null}
          {pageMessage ? <p className="text-[10px] border-4 border-black bg-emerald-400 p-4 shadow-[4px_4px_0_0_#000] mb-4">{pageMessage}</p> : null}
          
          <div className="bg-[#ebd2a9] border-4 border-black p-4 shadow-[inset_4px_4px_0_rgba(0,0,0,0.1)] h-[500px] overflow-y-auto">
            {isEmpty ? (
              <p className="text-[10px]">No characters have been created yet.</p>
            ) : !isLoading && !error ? (
              <CharacterGrid
                characters={characters}
                onEdit={setSelectedCharacter}
                onToggleActive={handleToggleActive}
                emptyMessage="No characters have been created yet."
              />
            ) : null}
          </div>
        </section>
      </div>
    </PixelLayout>
  );
}
