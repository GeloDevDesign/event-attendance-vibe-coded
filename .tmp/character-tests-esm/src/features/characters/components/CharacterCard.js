import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function CharacterCard({ character, isSelected = false, onSelect, onToggleActive, onEdit, }) {
    const statusLabel = character.isActive ? "Active" : "Inactive";
    return (_jsxs("article", { "aria-label": `Character ${character.name}`, "data-selected": isSelected, style: {
            border: "1px solid #d1d5db",
            borderRadius: "0.75rem",
            padding: "1rem",
            display: "grid",
            gap: "0.75rem",
        }, children: [_jsx("img", { src: character.imageUrl, alt: character.name, style: {
                    width: "100%",
                    maxWidth: "9rem",
                    aspectRatio: "1 / 1",
                    objectFit: "contain",
                } }), _jsxs("div", { children: [_jsx("h3", { style: { margin: 0 }, children: character.name }), _jsx("p", { style: { margin: "0.25rem 0 0", color: "#4b5563" }, children: statusLabel })] }), _jsxs("div", { style: { display: "flex", gap: "0.5rem", flexWrap: "wrap" }, children: [onSelect ? (_jsx("button", { type: "button", onClick: () => onSelect(character.id), disabled: !character.isActive, "aria-pressed": isSelected, children: isSelected ? "Selected" : "Select" })) : null, onEdit ? (_jsx("button", { type: "button", onClick: () => onEdit(character), children: "Edit" })) : null, onToggleActive ? (_jsx("button", { type: "button", onClick: () => onToggleActive(character.id, !character.isActive), children: character.isActive ? "Deactivate" : "Activate" })) : null] })] }));
}
