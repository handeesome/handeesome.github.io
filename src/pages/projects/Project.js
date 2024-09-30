import React from "react";
import HelloWorld from "./HelloWorld";
import PageHeader from "../../components/header/PageHeader";
import Board from "../../components/Board";
const Project = ({ toggleMode, isDarkMode }) => {
  return (
    <div>
      <PageHeader toggleMode={toggleMode} isDarkMode={isDarkMode} />
      <Board isDarkMode={isDarkMode}>
        <HelloWorld />
      </Board>
    </div>
  );
};

export default Project;
