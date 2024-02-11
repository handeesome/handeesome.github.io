import React, { useRef, useEffect, useState } from "react";

const Card = ({ isDarkMode }) => {
  const Item = ({ title, date, itemLink }) => (
    <a href={itemLink} className="row">
      <div className="col-md-auto">
        <time>{date}</time>
      </div>
      <div className="col-md-auto ">
        <div>{title}</div>
      </div>
    </a>
  );
  const items = [
    { title: "Item 1", date: "2-11", itemLink: "/one" },
    { title: "Item 2", date: "2-12", itemLink: "/two" },
    { title: "Item 3", date: "2-13", itemLink: "/three" },
    { title: "Item 1", date: "2-11", itemLink: "/one" },
    { title: "Item 2", date: "2-12", itemLink: "/two" },
    { title: "Item 3", date: "2-13", itemLink: "/three" },
    { title: "Item 1", date: "2-11", itemLink: "/one" },
    { title: "Item 2", date: "2-12", itemLink: "/two" },
    { title: "Item 3", date: "2-13", itemLink: "/three" },
  ];
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
      console.log(scrollPosition);
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
          className="col-md-10 rounded shadow-lg "
          style={{
            backgroundColor: isDarkMode ? "#252d38" : "white",
            color: isDarkMode ? "white" : "",
          }}>
          <div className="row justify-content-center" id="introduction">
            <div className="col-md-10 list-group">
              <p className="h4 mt-5">number of items</p>
              <hr />
              <p className="h5">2024</p>

              {items.map((item, index) => (
                <div key={index} className="pt-5 pb-5">
                  <Item
                    title={item.title}
                    date={item.date}
                    itemLink={item.itemLink}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
