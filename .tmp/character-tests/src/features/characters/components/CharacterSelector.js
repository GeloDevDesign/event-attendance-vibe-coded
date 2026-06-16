"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterSelector = CharacterSelector;
const jsx_runtime_1 = require("react/jsx-runtime");
const characterService_1 = require("../services/characterService");
const CharacterGrid_1 = require("./CharacterGrid");
function CharacterSelector({ characters, selectedCharacterId, onSelect, disabled = false, emptyMessage = "No active characters are available right now.", }) {
    const selectableCharacters = (0, characterService_1.sortCharactersByName)((0, characterService_1.getActiveCharacters)(characters));
    if (disabled) {
        return (0, jsx_runtime_1.jsx)("p", { children: "Character selection is currently unavailable." });
    }
    return ((0, jsx_runtime_1.jsx)(CharacterGrid_1.CharacterGrid, { characters: selectableCharacters, selectedCharacterId: selectedCharacterId, onSelect: onSelect, emptyMessage: emptyMessage }));
}
