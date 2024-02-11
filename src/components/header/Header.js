import React, { useState, useEffect } from "react";
import backgroundImageLight from "../../assets/images/background_light.jpg";
import backgroundImageDark from "../../assets/images/background_dark.jpg";
import NavBar from "./NavBar";
const Header = ({ toggleMode, isDarkMode, picHeight }) => {
  const [isScrolled, setIsScrolled] = useState(false);

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
    const container = document.querySelector(".header-container");
    if (container) {
      container.style.backgroundImage = isDarkMode
        ? `url(${backgroundImageDark})`
        : `url(${backgroundImageLight})`;
    }
  }, [isDarkMode]);
  return (
    <div>
      <div
        className="container-fluid header-container"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: `${picHeight}vh`,
        }}>
        <NavBar
          isScrolled={isScrolled}
          isDarkMode={isDarkMode}
          toggleMode={toggleMode}
        />
        <div className="container d-flex h-100 justify-content-center align-items-center">
          <div className=" p-5">
            <h2>
              <span style={{ color: isDarkMode ? "white" : "" }}>
                Hello World!! from the other side
              </span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
