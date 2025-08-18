import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/index.js";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import StudyNotes from "./pages/StudyNotes";
import {
  MyBookShelf,
  BookAnalytics,
  TimeTracker,
  FirebaseBookshelf,
  BookNotes,
} from "./pages/BookShelf";
import Footer from "./components/Footer";
import Header from "./components/header/Header";
import GoToTopButton from "./components/GoToTopButton.jsx";

function App() {
  return (
    <>
      <Header picHeight={80} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />

        <Route path="/study-notes" element={<StudyNotes />} />
        <Route path="/book-shelf" element={<MyBookShelf />} />
        <Route path="/book-shelf2" element={<FirebaseBookshelf />} />
        <Route
          path="/book-shelf/book/:bookId/analytics"
          element={<BookAnalytics />}
        />
        <Route path="/book-shelf/book/:bookId/notes" element={<BookNotes />} />
        <Route path="/book-shelf/time-tracker" element={<TimeTracker />} />
      </Routes>
      <Footer />
      <GoToTopButton />
    </>
  );
}

export default App;
