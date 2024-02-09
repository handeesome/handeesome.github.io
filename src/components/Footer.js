import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer = ({ isDarkMode }) => {
  return (
    <footer className={`container ${isDarkMode ? "text-light" : "text-dark"}`}>
      <div className="row justify-content-md-center">
        <div className="col-md-5 ">
          <p>&copy; 2024 Cenhan Du. All Rights Reserved.</p>
          {/* Add more footer content, links, or social media icons as needed */}
        </div>
        <div className="col-md-5 justify-content-end d-flex list-unstyled">
          <li className="ms-3">
            <a href="https://www.linkedin.com/in/cenhan-du-5251111ba/">
              <FontAwesomeIcon icon={faLinkedin} className="fa-2x" />
            </a>
          </li>
          <li className="ms-3">
            <a href="https://github.com/handeesome">
              <FontAwesomeIcon icon={faGithub} className="fa-2x" />
            </a>
          </li>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
