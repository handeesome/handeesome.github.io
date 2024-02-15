import React, { useRef, useEffect, useState } from "react";

const Board = ({ isDarkMode, children }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const introComponentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const introComponent = introComponentRef.current;
    if (introComponent && scrollPosition < 205) {
      const distance = scrollPosition * 0.5;
      introComponent.style.transform = `translateY(-${distance}px)`;
    }
  }, [scrollPosition]);
  return (
    <div
      className="container "
      style={{
        transition: "transform ease-in-out",
        top: "-40px",
        position: "relative",
      }}
      ref={introComponentRef}>
      <div className="row justify-content-center">
        <div
          className="col-md-10 rounded shadow-lg"
          id="board"
          style={{
            backgroundColor: isDarkMode ? "#252d38" : "white",
            color: isDarkMode ? "white" : "",
          }}>
          <div className="row justify-content-center">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Board;
