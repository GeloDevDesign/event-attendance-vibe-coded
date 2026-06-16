"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterGrid = CharacterGrid;
const jsx_runtime_1 = require("react/jsx-runtime");
const CharacterCard_1 = require("./CharacterCard");
function CharacterGrid({ characters, selectedCharacterId, emptyMessage = "No characters available.", onSelect, onToggleActive, onEdit, }) {
    if (characters.length === 0) {
        return (0, jsx_runtime_1.jsx)("p", { children: emptyMessage });
    }
    return ((0, jsx_runtime_1.jsx)("section", { "aria-label": "Character grid", style: {
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
        }, children: characters.map((character) => ((0, jsx_runtime_1.jsx)(CharacterCard_1.CharacterCard, { character: character, isSelected: character.id === selectedCharacterId, onSelect: onSelect, onToggleActive: onToggleActive, onEdit: onEdit }, character.id))) }));
}
