import { useMemo, useState, type JSX } from "react";

import type { Id } from "../../convex/_generated/dataModel";
import { CharacterForm } from "../features/characters/components/CharacterForm";
import { CharacterGrid } from "../features/characters/components/CharacterGrid";
import { useCharacters } from "../features/characters/hooks/useCharacters";
import type {
  CharacterFormValues,
  CharacterRecord,
} from "../features/characters/types/character.types";

export function AdminCharactersPage(): JSX.Element {
  const {
    characters,
    isLoading,
    error,
    isEmpty,
    createCharacter,
    updateCharacter,
    setCharacterActiveState,
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

  return (
    <main style={{ display: "grid", gap: "1.5rem" }}>
      <header>
        <h1>Character Management</h1>
        <p>Create, edit, activate, and deactivate selectable characters.</p>
      </header>

      <section>
        <h2>{formTitle}</h2>
        <CharacterForm
          initialValues={selectedCharacter ?? undefined}
          onSubmit={selectedCharacter ? handleUpdate : handleCreate}
          submitLabel={selectedCharacter ? "Update character" : "Create character"}
        />
      </section>

      <section>
        <h2>Characters</h2>
        {isLoading ? <p>Loading characters...</p> : null}
        {error ? <p role="alert">{error}</p> : null}
        {pageMessage ? <p>{pageMessage}</p> : null}
        {isEmpty ? (
          <p>No characters have been created yet.</p>
        ) : !isLoading && !error ? (
          <CharacterGrid
            characters={characters}
            onEdit={setSelectedCharacter}
            onToggleActive={handleToggleActive}
            emptyMessage="No characters have been created yet."
          />
        ) : null}
      </section>
    </main>
  );
}
