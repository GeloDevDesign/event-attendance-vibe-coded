"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterCard = CharacterCard;
const jsx_runtime_1 = require("react/jsx-runtime");
function CharacterCard({ character, isSelected = false, onSelect, onToggleActive, onEdit, }) {
    const statusLabel = character.isActive ? "Active" : "Inactive";
    return ((0, jsx_runtime_1.jsxs)("article", { "aria-label": `Character ${character.name}`, "data-selected": isSelected, style: {
            border: "1px solid #d1d5db",
            borderRadius: "0.75rem",
            padding: "1rem",
            display: "grid",
            gap: "0.75rem",
        }, children: [(0, jsx_runtime_1.jsx)("img", { src: character.imageUrl, alt: character.name, style: {
                    width: "100%",
                    maxWidth: "9rem",
                    aspectRatio: "1 / 1",
                    objectFit: "contain",
                } }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { style: { margin: 0 }, children: character.name }), (0, jsx_runtime_1.jsx)("p", { style: { margin: "0.25rem 0 0", color: "#4b5563" }, children: statusLabel })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: "flex", gap: "0.5rem", flexWrap: "wrap" }, children: [onSelect ? ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => onSelect(character.id), disabled: !character.isActive, "aria-pressed": isSelected, children: isSelected ? "Selected" : "Select" })) : null, onEdit ? ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => onEdit(character), children: "Edit" })) : null, onToggleActive ? ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => onToggleActive(character.id, !character.isActive), children: character.isActive ? "Deactivate" : "Activate" })) : null] })] }));
}
