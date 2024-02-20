import React from "react";
import Header from "./Header";

import { Link } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
const HomeHeader = ({ toggleMode, isDarkMode }) => {
  return (
    <>
      <Header toggleMode={toggleMode} isDarkMode={isDarkMode} picHeight={100} />
      <Link to="introduction" spy={true} offset={-143}>
        <div
          className="btn position-absolute bottom-0 start-0 w-100"
          style={{ height: "100px", borderColor: "transparent" }}>
          <FontAwesomeIcon
            icon={faArrowDown}
            fade
            className="fa-2xl"
            style={{ color: "white" }}
          />
        </div>
      </Link>
    </>
  );
};

export default HomeHeader;
