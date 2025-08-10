import React from "react";
import Header from "./Header";

const PageHeader = ({ toggleMode, isDarkMode }) => {
  return (
    <Header toggleMode={toggleMode} isDarkMode={isDarkMode} picHeight={60} />
  );
};

export default PageHeader;
