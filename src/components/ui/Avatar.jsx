const Avatar = ({
  src,
  name,
  size = 120,
  className = "",
  textClass = "text-center mt-2",
  fallbackColor = "#6c757d",
  toggleModal,
}) => {
  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    cursor: "pointer",
  };

  const fallbackStyle = {
    ...avatarStyle,
    backgroundColor: fallbackColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: `${size * 0.4}px`,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2);
  };

  return (
    <>
      <div className={className} style={{ display: "inline-block" }}>
        {src ? (
          <img
            src={src}
            alt={name || "Avatar"}
            style={avatarStyle}
            onClick={toggleModal}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}

        <div
          style={{ ...fallbackStyle, display: src ? "none" : "flex" }}
          onClick={toggleModal}>
          {getInitials(name)}
        </div>

        {name && (
          <div className={textClass}>
            <div className="text-muted fw-medium">{name}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default Avatar;
