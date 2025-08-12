import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useTheme } from "../../ThemeContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();

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

  return (
    <div className="header-container">
      <div
        className="header-background"
        style={{
          backgroundImage:
            theme === "light"
              ? 'url("/src/assets/images/background_light.jpg")'
              : 'url("/src/assets/images/background_dark.jpg")',
        }}>
        <NavBar isScrolled={isScrolled} />
        <div className="container d-flex h-100 justify-content-center align-items-center">
          <div className=" p-5">
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
