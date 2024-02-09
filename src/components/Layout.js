import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ toggleMode, isDarkMode, children }) => {
  return (
    <div>
      <Header toggleMode={toggleMode} isDarkMode={isDarkMode} />
      {children}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Layout;
