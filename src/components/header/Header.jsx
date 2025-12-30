import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useTheme } from "../../ThemeContext";
import backgroundLight from "/src/assets/images/background_light.webp";
import backgroundDark from "/src/assets/images/background_dark.webp";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setImageLoaded(false); // Reset when theme changes
    const img = new Image();
    img.src = theme === "light" ? backgroundLight : backgroundDark;
    img.onload = () => setImageLoaded(true);
  }, [theme]);

  return (
    <div className="header-container">
      <div
        className="header-background"
        style={{
          backgroundImage: imageLoaded
            ? theme === "light"
              ? `url("${backgroundLight}")`
              : `url("${backgroundDark}")`
            : "none",
          backgroundColor: theme === "light" ? "#f0f0f0" : "#1a1a1a",
          transition: "opacity 0.3s ease",
          opacity: imageLoaded ? 1 : 0.5,
        }}>
        <NavBar isScrolled={isScrolled} />
        <div className="container d-flex h-100 justify-content-center align-items-center">
          <div className="p-5">
            <h2>
              <span>Hello World!! from the other side</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
