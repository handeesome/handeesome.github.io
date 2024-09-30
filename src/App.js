import { createContext, useState } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Test from "./Test";
import Projects from "./pages/Projects";
import StudyNotes from "./pages/StudyNotes";
import BookLists from "./pages/BookLists";
import Footer from "./components/Footer";
import HomeHeader from "./components/header/HomeHeader";
import PageHeader from "./components/header/PageHeader";
import Project from "./pages/projects/Project";
import HelloWorld from "./pages/projects/HelloWorld";
import Header from "./components/header/Header";
import backgroundImageDark from "./assets/images/background_dark_old.jpg";

export const ThemeContext = createContext(null);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [theme, setTheme] = useState("dark");
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };
  return (
    // <ThemeContext.Provider value={{ theme, toggleMode }}>
    <div id={theme}>
      <>
        <Header
          toggleMode={toggleMode}
          isDarkMode={isDarkMode}
          picHeight={80}
        />

        <Routes>
          <Route path="/" element={<Home isDarkMode={isDarkMode} />}></Route>
          <Route
            path="/projects"
            element={<Projects isDarkMode={isDarkMode} />}></Route>

          {/* <Route
            path="/projects/:projectId"
            element={
              <Project toggleMode={toggleMode} isDarkMode={isDarkMode} />
            }></Route> */}

          <Route
            path="/study-notes"
            element={<StudyNotes isDarkMode={isDarkMode} />}></Route>
          <Route
            path="/book-lists"
            element={<BookLists isDarkMode={isDarkMode} />}></Route>
        </Routes>
        <Footer isDarkMode={isDarkMode} />
      </>
    </div>
    // </ThemeContext.Provider>

    // <Test />
  );
}

export default App;
