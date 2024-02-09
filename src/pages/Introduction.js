import React, { useRef, useEffect, useState } from "react";

const Item = ({ title, description, isDarkMode }) => (
  <div className="card mb-3" data-bs-theme={isDarkMode ? "dark" : "light"}>
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      <p className="card-text">{description}</p>
    </div>
  </div>
);
const Introduction = ({ isDarkMode }) => {
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
    if (introComponent && scrollPosition < 376) {
      const distance = scrollPosition * 0.5;
      introComponent.style.transform = `translateY(-${distance}px)`;
    }
  }, [scrollPosition]);

  const items = [
    { title: "Item 1", description: "Description for Item 1" },
    { title: "Item 2", description: "Description for Item 2" },
    { title: "Item 3", description: "Description for Item 3" },
    { title: "Item 1", description: "Description for Item 1" },
    { title: "Item 2", description: "Description for Item 2" },
    { title: "Item 3", description: "Description for Item 3" },
    { title: "Item 1", description: "Description for Item 1" },
    { title: "Item 2", description: "Description for Item 2" },
    { title: "Item 3", description: "Description for Item 3" },
    { title: "Item 1", description: "Description for Item 1" },
    { title: "Item 2", description: "Description for Item 2" },
    { title: "Item 3", description: "Description for Item 3" },
  ];
  return (
    <div
      className="container pt-5 pb-5"
      id="introduction"
      style={{
        transition: "transform ease-in-out",
      }}
      ref={introComponentRef}>
      <div className="row justify-content-center">
        <div
          className="col-md-10 rounded shadow-lg "
          style={{ backgroundColor: isDarkMode ? "#252d38" : "white" }}>
          <div className="row justify-content-center">
            <div className="col-md-10">
              {/* Map over the array of items and render individual Item introComponents */}
              {items.map((item, index) => (
                <div key={index} className="mb-5 mt-5">
                  <Item
                    title={item.title}
                    description={item.description}
                    isDarkMode={isDarkMode}
                  />
                </div>
              ))}
            </div>
            <div className="w-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
