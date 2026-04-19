import { useRef, useEffect, useState, forwardRef } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

const Board = forwardRef(({ title, titleRight, children }, ref) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { theme } = useTheme();

  // Use the forwarded ref; if none provided, fallback to internal ref
  const internalRef = useRef(null);
  const boardRef = ref || internalRef;

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
    const introComponent = boardRef.current;
    if (introComponent && scrollPosition < 205) {
      const distance = scrollPosition * 0.5;
      introComponent.style.transform = `translateY(-${distance}px)`;
    }
  }, [scrollPosition, boardRef]);
  return (
    <div
      className="container "
      style={{
        transition: "transform ease-in-out",
        top: "-80px",
        position: "relative",
      }}
      ref={boardRef}
    >
      <div className="row justify-content-center">
        <div
          className="col-md-10 rounded shadow-lg"
          id="board"
          style={{
            backgroundColor: theme === "light" ? "#e7e7e7" : "#252d38",
            paddingBottom: "3rem",
          }}
        >
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="d-flex justify-content-between align-items-center mt-5">
                <div className="h4 mb-0">{title}</div>
                {titleRight && <div>{titleRight}</div>}
              </div>
              <hr />
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Board;
