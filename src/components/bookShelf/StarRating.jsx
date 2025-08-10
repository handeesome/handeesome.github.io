import React from "react";

const StarRating = ({ rating, maxStars = 5, showText = true, size = "sm" }) => {
  // Handle null/undefined ratings
  const numericRating = rating ? parseFloat(rating) : 0;

  // Clamp rating between 0 and maxStars
  const clampedRating = Math.max(0, Math.min(maxStars, numericRating));

  // Size configurations
  const sizeConfig = {
    xs: { fontSize: "0.75rem", gap: "1px" },
    sm: { fontSize: "0.9rem", gap: "2px" },
    md: { fontSize: "1.1rem", gap: "3px" },
    lg: { fontSize: "1.3rem", gap: "4px" },
  };

  const { fontSize, gap } = sizeConfig[size] || sizeConfig.sm;

  // Generate stars array
  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    let starType;
    if (i <= clampedRating) {
      starType = "full";
    } else {
      starType = "empty";
    }
    stars.push(starType);
  }

  const starStyle = {
    display: "inline-block",
    fontSize: fontSize,
    marginRight: gap,
    position: "relative",
    lineHeight: "1",
  };

  const renderStar = (type, index) => {
    const key = `star-${index}`;

    switch (type) {
      case "full":
        return (
          <span key={key} style={{ ...starStyle, color: "#ffc107" }}>
            ★
          </span>
        );

      case "empty":
        return (
          <span key={key} style={{ ...starStyle, color: "#e9ecef" }}>
            ★
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
      }}>
      {/* Stars */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          lineHeight: "1",
        }}>
        {stars.map((starType, index) => renderStar(starType, index))}
      </div>

      {/* Rating text and number */}
      {showText && (
        <div
          style={{
            fontSize: size === "xs" ? "0.75rem" : "0.85rem",
            color: "#6c757d",
            fontWeight: "500",
          }}>
          <span style={{ color: "#495057" }}>
            {numericRating > 0 ? numericRating.toFixed(2) : "N/A"}
          </span>
        </div>
      )}
    </div>
  );
};

export default StarRating;
