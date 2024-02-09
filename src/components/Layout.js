import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ toggleMode, isDarkMode, children }) => {
  return (
    <div>
      <Header toggleMode={toggleMode} isDarkMode={isDarkMode} />
      {React.Children.map(children, (child) => {
        // Clone the child element and pass isDarkMode as a prop
        return React.cloneElement(child, { isDarkMode });
      })}
      <Footer />
    </div>
  );
};

export default Layout;
