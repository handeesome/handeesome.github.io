import { Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import StudyNotes from "./pages/StudyNotes";
import BookShelf from "./pages/BookShelf";
import Footer from "./components/Footer";
import Header from "./components/header/Header";

function App() {
  return (
    <>
      <Header picHeight={80} />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/projects" element={<Projects />}></Route>

        <Route path="/study-notes" element={<StudyNotes />}></Route>
        <Route path="/book-shelf" element={<BookShelf />}></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
