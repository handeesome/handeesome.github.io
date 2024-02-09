import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import backgroundImageLight from "../assets/images/background_light.jpg";
import backgroundImageDark from "../assets/images/background_dark.jpg";
import { Link } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";

const Header = ({ toggleMode, isDarkMode }) => {
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
          minHeight: "100vh",
        }}>
        <Navbar
          // bg={isScrolled ? "#1f3144" : "transparent"}
          // bg="transparent"
          data-bs-theme={isScrolled ? "dark" : "light"}
          expand="lg"
          fixed="top"
          style={{
            backgroundColor: isScrolled ? "#1f3144" : "transparent",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            height: isScrolled ? "50px" : "60px",
            transition: "height 0.3s ease-in-out",
          }}>
          <Container>
            <Navbar.Brand
              style={{ fontSize: "1.5rem", color: isDarkMode ? "white" : "" }}
              href="#home">
              Cenhan's Site
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto " variant="underline">
                <Nav.Link
                  href="#home"
                  className={isDarkMode ? "text-white" : ""}>
                  Home
                </Nav.Link>
                <Nav.Link
                  href="#projects"
                  className={isDarkMode ? "text-white" : ""}>
                  Projects
                </Nav.Link>
                <Nav.Link
                  href="#study-notes"
                  className={isDarkMode ? "text-white" : ""}>
                  Study Notes
                </Nav.Link>
                <Nav.Link
                  href="#book-list"
                  className={isDarkMode ? "text-white" : ""}>
                  Book List
                </Nav.Link>
                <div
                  onClick={toggleMode}
                  style={{ cursor: "pointer" }}
                  className="align-items-center d-flex ">
                  <FontAwesomeIcon
                    icon={isDarkMode ? faSun : faMoon}
                    className={`fa-2xl ${
                      isDarkMode || isScrolled ? "text-white" : ""
                    }`}
                  />
                </div>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="container d-flex vh-100 justify-content-center align-items-center">
          <div className=" p-5">
            <h2>
              <span style={{ color: isDarkMode ? "white" : "" }}>
                Hello World!!
              </span>
            </h2>
          </div>
        </div>

        <Link to="introduction" offset={-180}>
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
      </div>
    </div>
  );
};

export default Header;
