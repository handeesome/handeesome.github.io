import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/index.js";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import StudyNotes from "./pages/StudyNotes";
import { BookShelf, BookAnalytics, TimeTracker } from "./pages/BookShelf";
import Footer from "./components/Footer";
import Header from "./components/header/Header";

function App() {
  return (
    <>
      <Header picHeight={80} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />

        <Route path="/study-notes" element={<StudyNotes />} />
        <Route path="/book-shelf" element={<BookShelf />} />
        <Route
          path="/book-shelf/book/:bookId/analytics"
          element={<BookAnalytics />}
        />
        <Route path="/book-shelf/time-tracker" element={<TimeTracker />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
