// components/FormDataTags.jsx
import React from "react";
import { useTheme } from "../../ThemeContext";

const FormDataTags = ({
  items = [],
  colors = {},
  selectedItems = [],
  setSelectedItems,
  showInput,
  setShowInput,
  newShelf,
  setNewShelf,
  allShelves,
  setAllShelves,
  onItemsToggle,
}) => {
  const { theme } = useTheme();

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((t) => t !== item) : [...prev, item]
    );

    if (onItemsToggle) {
      onItemsToggle(item);
    }
  };

  const defaultColors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        maxWidth: "300px",
      }}>
      {items.map((item, index) => {
        const isSelected = selectedItems.includes(item);
        const color =
          colors[item] || defaultColors[index % defaultColors.length];
        return (
          <button
            key={item}
            type="button"
            className={`btn book-tag ${isSelected ? "selected" : ""}`}
            onClick={() => toggleItem(item)}
            style={{
              fontSize: "0.6rem",
              padding: "2px 4px",
              "--tag-color": color,
            }}>
            {item} {isSelected && "✓"}
          </button>
        );
      })}
      <div key="input-row" className="row g-2 align-items-center">
        <div className="col" style={{ display: showInput ? "block" : "none" }}>
          <input
            type="text"
            className={`form-control ${
              theme === "dark" ? "bg-dark text-light" : ""
            }`}
            placeholder="New Shelf"
            value={newShelf}
            onChange={(e) => setNewShelf(e.target.value)}
          />
        </div>
        {showInput && (
          <button
            type="button"
            className="btn col-auto"
            onClick={() => {
              setAllShelves([...allShelves, newShelf]);
              setNewShelf("");
              setShowInput(false);
            }}>
            ✔️
          </button>
        )}
      </div>
    </div>
  );
};

export default FormDataTags;
