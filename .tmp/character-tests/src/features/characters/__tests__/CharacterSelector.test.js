"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
/// <reference types="node" />
const strict_1 = __importDefault(require("node:assert/strict"));
const server_1 = require("react-dom/server");
const CharacterGrid_1 = require("../components/CharacterGrid");
const CharacterSelector_1 = require("../components/CharacterSelector");
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
const selectorMarkup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(CharacterSelector_1.CharacterSelector, { characters: characters, selectedCharacterId: "active-character", onSelect: () => undefined }));
strict_1.default.match(selectorMarkup, /Astra/);
strict_1.default.doesNotMatch(selectorMarkup, /Bruno/);
strict_1.default.match(selectorMarkup, /Selected/);
const emptyGridMarkup = (0, server_1.renderToStaticMarkup)((0, jsx_runtime_1.jsx)(CharacterGrid_1.CharacterGrid, { characters: [], emptyMessage: "No characters available." }));
strict_1.default.match(emptyGridMarkup, /No characters available\./);
console.log("CharacterSelector feature tests passed.");
