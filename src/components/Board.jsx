import { useRef, useEffect, useState } from "react";

const Board = ({ title, titleRight, children }) => {
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
        top: "-80px",
        position: "relative",
      }}
      ref={introComponentRef}>
      <div className="row justify-content-center">
        <div
          className="col-md-10 rounded shadow-lg"
          id="board"
          style={{ backgroundColor: "white" }}>
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="d-flex justify-content-between align-items-center mt-5">
                <p className="h4 mb-0">{title}</p>
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
};

export default Board;
