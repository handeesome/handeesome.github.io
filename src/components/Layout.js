import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ toggleMode, children }) => {
  return (
    <div>
      <Header toggleMode={toggleMode} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
