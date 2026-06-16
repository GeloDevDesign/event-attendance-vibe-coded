import { jsx as _jsx } from "react/jsx-runtime";
/// <reference types="node" />
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { CharacterGrid } from "../components/CharacterGrid";
import { CharacterSelector } from "../components/CharacterSelector";
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
const selectorMarkup = renderToStaticMarkup(_jsx(CharacterSelector, { characters: characters, selectedCharacterId: "active-character", onSelect: () => undefined }));
assert.match(selectorMarkup, /Astra/);
assert.doesNotMatch(selectorMarkup, /Bruno/);
assert.match(selectorMarkup, /Selected/);
const emptyGridMarkup = renderToStaticMarkup(_jsx(CharacterGrid, { characters: [], emptyMessage: "No characters available." }));
assert.match(emptyGridMarkup, /No characters available\./);
console.log("CharacterSelector feature tests passed.");
