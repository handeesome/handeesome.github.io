import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Test from "./Test";
import Projects from "./pages/Projects";
import StudyNotes from "./pages/StudyNotes";
import BookLists from "./pages/BookLists";
import Footer from "./components/Footer";
import HomeHeader from "./components/header/HomeHeader";
import PageHeader from "./components/header/PageHeader";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <div style={{ background: isDarkMode ? "#181c27" : "#e7e7e7" }}>
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

    // <Test />
  );
}

export default App;
