import { jsx as _jsx } from "react/jsx-runtime";
import { CharacterCard } from "./CharacterCard";
export function CharacterGrid({ characters, selectedCharacterId, emptyMessage = "No characters available.", onSelect, onToggleActive, onEdit, }) {
    if (characters.length === 0) {
        return _jsx("p", { children: emptyMessage });
    }
    return (_jsx("section", { "aria-label": "Character grid", style: {
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
        }, children: characters.map((character) => (_jsx(CharacterCard, { character: character, isSelected: character.id === selectedCharacterId, onSelect: onSelect, onToggleActive: onToggleActive, onEdit: onEdit }, character.id))) }));
}
