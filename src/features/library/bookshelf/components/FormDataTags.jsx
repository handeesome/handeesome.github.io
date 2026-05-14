// components/FormDataTags.jsx
import { Check } from "lucide-react";

const FormDataTags = ({
  items = [],
  colors = {},
  selectedItems = [],
  setSelectedItems,
  onItemsToggle,
}) => {
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

  if (items.length === 0) {
    return <div className="form-data-tags-empty">No options yet</div>;
  }

  return (
    <div className="form-data-tags">
      {items.map((item, index) => {
        const isSelected = selectedItems.includes(item);
        const color =
          colors[item] || defaultColors[index % defaultColors.length];
        return (
          <button
            key={item}
            type="button"
            className={`btn book-tag form-data-tag ${
              isSelected ? "selected" : ""
            }`}
            onClick={() => toggleItem(item)}
            style={{
              "--tag-color": color,
              "--tag-color-rgb": "108, 117, 125",
            }}>
            <span>{item}</span>
            {isSelected && <Check size={13} strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  );
};

export default FormDataTags;
