import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/index.js";

import Home from "./pages/Home";

import StudyNotes from "./pages/StudyNotes";
import { Projects, ProjectPage } from "./pages/Projects";
import {
  MyBookShelf,
  BookAnalytics,
  TimeTracker,
  FirebaseBookshelf,
  BookNotes,
  UserSelection,
  BookShelf,
} from "./pages/BookShelf";
import Footer from "./components/Footer";
import Header from "./components/header/Header";
import GoToTopButton from "./components/GoToTopButton.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Header picHeight={80} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="/study-notes" element={<StudyNotes />} />
        <Route path="/book-shelf" element={<UserSelection />} />
        <Route path="/book-shelf/:userName" element={<BookShelf />} />
        <Route path="/book-shelf/cenhan" element={<MyBookShelf />} />
        <Route path="/edit-bookshelf" element={<FirebaseBookshelf />} />
        <Route
          path="/book-shelf/book/:bookId/analytics"
          element={<BookAnalytics />}
        />
        <Route path="/book-shelf/book/:bookId/notes" element={<BookNotes />} />
        <Route
          path="/book-shelf/cenhan/time-tracker"
          element={<TimeTracker />}
        />
      </Routes>
      <Footer />
      <GoToTopButton />
    </AuthProvider>
  );
}

export default App;
