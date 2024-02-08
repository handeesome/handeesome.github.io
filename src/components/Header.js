import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import backgroundImage from "../assets/images/background.jpg";
import { Link } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faSun } from "@fortawesome/free-solid-svg-icons";

const Header = ({ toggleMode }) => {
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
  return (
    <div>
      <div
        className="container-fluid"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}>
        <Navbar
          bg={isScrolled ? "dark" : "transparent"}
          data-bs-theme={isScrolled ? "dark" : "light"}
          expand="lg"
          fixed="top"
          style={{
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            height: isScrolled ? "50px" : "60px",
            transition: "height 0.3s ease-in-out",
          }}>
          <Container>
            <Navbar.Brand style={{ fontSize: "1.5rem" }} href="#home">
              Cenhan's Site
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto" variant="underline">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#projects">Projects</Nav.Link>
                <Nav.Link href="#study-notes">Study Notes</Nav.Link>
                <Nav.Link href="#book-list">Book List</Nav.Link>
                <div
                  onClick={toggleMode}
                  style={{ cursor: "pointer" }}
                  className="align-items-center d-flex ">
                  <FontAwesomeIcon icon={faSun} className="fa-2xl" />
                </div>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="container d-flex vh-100 justify-content-center align-items-center">
          <div className="bg-transparent text-black p-5">
            <h2>
              <span>Hello World</span>
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
