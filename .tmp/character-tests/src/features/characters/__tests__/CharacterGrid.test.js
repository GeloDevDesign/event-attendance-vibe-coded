"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="node" />
const strict_1 = __importDefault(require("node:assert/strict"));
const characterService_1 = require("../services/characterService");
const characters = [
    {
        id: "active-character",
        name: "Astra",
        imageUrl: "/characters/astra.png",
        isActive: true,
        createdAt: 1,
        updatedAt: 1,
    },
    {
        id: "inactive-character",
        name: "Bruno",
        imageUrl: "/characters/bruno.png",
        isActive: false,
        createdAt: 2,
        updatedAt: 2,
    },
];
const activeCharacters = (0, characterService_1.getActiveCharacters)(characters);
strict_1.default.equal(activeCharacters.length, 1);
strict_1.default.equal(activeCharacters[0]?.name, "Astra");
const invalidValues = (0, characterService_1.validateCharacterFormValues)({
    name: "   ",
    imageUrl: "   ",
    isActive: true,
});
strict_1.default.equal(invalidValues.isValid, false);
strict_1.default.equal(invalidValues.errors.length, 2);
const validValues = (0, characterService_1.validateCharacterFormValues)({
    name: "Pixel Knight",
    imageUrl: "/characters/pixel-knight.png",
    isActive: true,
});
strict_1.default.equal(validValues.isValid, true);
strict_1.default.deepEqual(validValues.errors, []);
console.log("CharacterGrid unit tests passed.");
