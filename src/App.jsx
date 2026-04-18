import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import "./styles/index.js";

import Home from "./pages/Home";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/header/Header";
import GoToTopButton from "./components/GoToTopButton.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import {
  bookShelfRoutes,
  editBookshelfRoute,
} from "./routes/bookShelfRoutes.jsx";
import { gamesRoutes } from "./routes/gameRoutes.jsx";

const Projects = lazy(() =>
  import("./pages/projects").then((module) => ({ default: module.Projects }))
);
const ProjectPage = lazy(() =>
  import("./pages/projects").then((module) => ({ default: module.ProjectPage }))
);
const StudyNotes = lazy(() => import("./pages/StudyNotes"));

function App() {
  return (
    <AuthProvider>
      <Header picHeight={80} />
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/study-notes" element={<StudyNotes />} />
          {bookShelfRoutes}
          {editBookshelfRoute}
          {gamesRoutes}
        </Routes>
      </Suspense>
      <Footer />
      <GoToTopButton />
    </AuthProvider>
  );
}

export default App;
