import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavBar = ({ isScrolled, isDarkMode, toggleMode }) => {
  return (
    <Navbar
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
            <Nav.Link href="/" className={isDarkMode ? "text-white" : ""}>
              Home
            </Nav.Link>
            <Nav.Link
              href="/projects"
              className={isDarkMode ? "text-white" : ""}>
              Projects
            </Nav.Link>
            <Nav.Link
              href="/study-notes"
              className={isDarkMode ? "text-white" : ""}>
              Study Notes
            </Nav.Link>
            <Nav.Link
              href="/book-list"
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
  );
};

export default NavBar;
