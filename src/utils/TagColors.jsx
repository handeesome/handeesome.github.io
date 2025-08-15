export const TAG_COLORS = {
  fiction: "#FF5733",
  philosophy: "#9b59b6",
  religion: "#f39c12",
  economics: "#2ECC71",
  history: "#3498db",
  programming: "#F1C40F",
  biography: "#D35400",
  "social-science": "#1ABC9C",
  music: "#E91E63",
};
export const getTagColor = (tag) => {
  return TAG_COLORS[tag] || "#6c757d"; // Default gray if tag not found
};
