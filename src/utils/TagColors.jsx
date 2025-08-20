export const TAG_COLORS = {
  fiction: "#FF5733", // Red-orange
  biography: "#D35400", // Dark orange
  essays: "#E67E22", // Orange
  philosophy: "#9B59B6", // Purple
  religion: "#F39C12", // Yellow-orange
  history: "#3498DB", // Blue
  "social-science": "#1ABC9C", // Teal
  economics: "#2ECC71", // Green
  "political-science": "#27AE60", // Dark green
  psychology: "#E74C3C", // Red
  music: "#E91E63", // Pink
  programming: "#F1C40F", // Yellow
  classics: "#8E44AD", // Dark purple
  contemporary: "#95A5A6", // Gray
  satire: "#FF6B35", // Bright orange
};
export const getTagColor = (tag) => {
  return TAG_COLORS[tag] || "#6c757d"; // Default gray if tag not found
};
