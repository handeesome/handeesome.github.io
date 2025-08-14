import { Navbar, Nav, Container } from "react-bootstrap";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useTheme } from "../../ThemeContext";
import { faMonument } from "@fortawesome/free-solid-svg-icons";

const NavBar = ({ isScrolled }) => {
  const { theme, toggleTheme } = useTheme();

  const navbarClasses = `navbar-custom ${isScrolled ? "scrolled" : ""}`;

  return (
    <Navbar
      expand="lg"
      fixed="top"
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
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" variant="underline">
            <Link to="/" className="nav-link ">
              Home
            </Link>
            <Link to="/projects" className="nav-link">
              Projects
            </Link>
            <Link to="/study-notes" className="nav-link">
              Study Notes
            </Link>
            <Link to="/book-shelf" className="nav-link">
              Book Shelf
            </Link>
            <Link to="./book-shelf2" className="nav-link">
              Book Shelf 2
            </Link>

            <div
              style={{ cursor: "pointer" }}
              className="align-items-center d-flex theme-toggle"
              onClick={toggleTheme}>
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
