/// <reference types="node" />
import assert from "node:assert/strict";

import type { Id } from "../../../../convex/_generated/dataModel";
import {
  getActiveCharacters,
  validateCharacterFormValues,
} from "../services/characterService";
import type { CharacterRecord } from "../types/character.types";

const characters: CharacterRecord[] = [
  {
    id: "active-character" as Id<"characters">,
    name: "Astra",
    imageUrl: "/characters/astra.png",
    isActive: true,
    createdAt: 1,
    updatedAt: 1,
  },
  {
    id: "inactive-character" as Id<"characters">,
    name: "Bruno",
    imageUrl: "/characters/bruno.png",
    isActive: false,
    createdAt: 2,
    updatedAt: 2,
  },
];

const activeCharacters = getActiveCharacters(characters);
assert.equal(activeCharacters.length, 1);
assert.equal(activeCharacters[0]?.name, "Astra");

const invalidValues = validateCharacterFormValues({
  name: "   ",
  imageUrl: "   ",
  isActive: true,
});
assert.equal(invalidValues.isValid, false);
assert.equal(invalidValues.errors.length, 2);

const validValues = validateCharacterFormValues({
  name: "Pixel Knight",
  imageUrl: "/characters/pixel-knight.png",
  isActive: true,
});
assert.equal(validValues.isValid, true);
assert.deepEqual(validValues.errors, []);

console.log("CharacterGrid unit tests passed.");
