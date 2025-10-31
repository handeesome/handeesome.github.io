import { Navbar, Nav, Container } from "react-bootstrap";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import { useTheme } from "../../ThemeContext";
import { useState } from "react";

const NavBar = ({ isScrolled }) => {
  const { theme, toggleTheme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const navbarClasses = `navbar-custom ${isScrolled ? "scrolled" : ""}`;

  const closeNavbar = () => {
    setExpanded(false);
  };
  return (
    <Navbar
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={setExpanded}
      className={navbarClasses}
      style={{
        backgroundColor: isScrolled
          ? "var(--navbar-bg-scrolled)"
          : "transparent",
        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        height: isScrolled ? "50px" : "60px",
        transition: "height 0.3s ease-in-out",
      }}>
      <Container>
        <Navbar.Brand href="/">Cenhan's Site</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <FontAwesomeIcon
            icon={faBars}
            style={{
              color: theme === "dark" ? "#fff" : "#000",
              fontSize: "1.5rem",
            }}
          />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" variant="underline">
            <Link to="/" className="nav-link" onClick={closeNavbar}>
              Home
            </Link>
            <Link to="/projects" className="nav-link" onClick={closeNavbar}>
              Projects
            </Link>
            {/* <Link to="/study-notes" className="nav-link" onClick={closeNavbar}>
              Study Notes
            </Link> */}
            <Link to="/book-shelf" className="nav-link" onClick={closeNavbar}>
              📚 Book Shelf
            </Link>

            <div
              style={{ cursor: "pointer" }}
              className="align-items-center d-flex theme-toggle"
              onClick={() => {
                toggleTheme();
                closeNavbar();
              }}>
              <FontAwesomeIcon
                icon={theme === "dark" ? faSun : faMoon}
                className="fa-2xl"
              />
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
