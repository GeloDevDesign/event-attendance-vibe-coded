"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveCharacters = getActiveCharacters;
exports.sortCharactersByName = sortCharactersByName;
exports.isCharacterSelectable = isCharacterSelectable;
exports.validateCharacterFormValues = validateCharacterFormValues;
function getActiveCharacters(characters) {
    return characters.filter((character) => character.isActive);
}
function sortCharactersByName(characters) {
    return [...characters].sort((left, right) => left.name.localeCompare(right.name));
}
function isCharacterSelectable(character) {
    return character.isActive;
}
function validateCharacterFormValues(values) {
    const errors = [];
    if (values.name.trim().length === 0) {
        errors.push("Character name is required.");
    }
    if (values.imageUrl.trim().length === 0) {
        errors.push("Character image URL is required.");
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
