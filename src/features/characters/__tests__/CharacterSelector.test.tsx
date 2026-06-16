/// <reference types="node" />
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import type { Id } from "../../../../convex/_generated/dataModel";
import { CharacterGrid } from "../components/CharacterGrid";
import { CharacterSelector } from "../components/CharacterSelector";
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

const selectorMarkup = renderToStaticMarkup(
  <CharacterSelector
    characters={characters}
    selectedCharacterId={"active-character" as Id<"characters">}
    onSelect={() => undefined}
  />,
);

assert.match(selectorMarkup, /Astra/);
assert.doesNotMatch(selectorMarkup, /Bruno/);
assert.match(selectorMarkup, /Selected/);

const emptyGridMarkup = renderToStaticMarkup(
  <CharacterGrid characters={[]} emptyMessage="No characters available." />,
);

assert.match(emptyGridMarkup, /No characters available\./);

console.log("CharacterSelector feature tests passed.");
