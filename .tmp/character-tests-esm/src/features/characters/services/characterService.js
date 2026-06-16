export function getActiveCharacters(characters) {
    return characters.filter((character) => character.isActive);
}
export function sortCharactersByName(characters) {
    return [...characters].sort((left, right) => left.name.localeCompare(right.name));
}
export function isCharacterSelectable(character) {
    return character.isActive;
}
export function validateCharacterFormValues(values) {
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
