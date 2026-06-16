import { jsx as _jsx } from "react/jsx-runtime";
import { getActiveCharacters, sortCharactersByName } from "../services/characterService";
import { CharacterGrid } from "./CharacterGrid";
export function CharacterSelector({ characters, selectedCharacterId, onSelect, disabled = false, emptyMessage = "No active characters are available right now.", }) {
    const selectableCharacters = sortCharactersByName(getActiveCharacters(characters));
    if (disabled) {
        return _jsx("p", { children: "Character selection is currently unavailable." });
    }
    return (_jsx(CharacterGrid, { characters: selectableCharacters, selectedCharacterId: selectedCharacterId, onSelect: onSelect, emptyMessage: emptyMessage }));
}
