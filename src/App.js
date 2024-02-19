import { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import HelloWorld from "./pages/projects/HelloWolrd";

export const ThemeContext = createContext(null);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [theme, setTheme] = useState("dark");
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleMode }}>
      <div id={theme}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <HomeHeader toggleMode={toggleMode} isDarkMode={isDarkMode} />
                  <Home isDarkMode={isDarkMode} />
                </div>
              }></Route>
            <Route
              path="/projects"
              element={
                <div>
                  <PageHeader toggleMode={toggleMode} isDarkMode={isDarkMode} />
                  <Projects isDarkMode={isDarkMode} />
                </div>
              }></Route>
            <Route
              path="/projects/:projectId"
              element={
                <Project toggleMode={toggleMode} isDarkMode={isDarkMode} />
              }></Route>

            <Route
              path="/study-notes"
              element={
                <div>
                  <PageHeader toggleMode={toggleMode} isDarkMode={isDarkMode} />
                  <StudyNotes isDarkMode={isDarkMode} />
                </div>
              }></Route>
            <Route
              path="/book-lists"
              element={
                <div>
                  <PageHeader toggleMode={toggleMode} isDarkMode={isDarkMode} />
                  <BookLists isDarkMode={isDarkMode} />
                </div>
              }></Route>
            <Route
              path="*"
              element={
                <div>
                  <PageHeader toggleMode={toggleMode} isDarkMode={isDarkMode} />
                </div>
              }
            />
          </Routes>
          <Footer isDarkMode={isDarkMode} />
        </BrowserRouter>
      </div>
    </ThemeContext.Provider>

    // <Test />
  );
}

export default App;
