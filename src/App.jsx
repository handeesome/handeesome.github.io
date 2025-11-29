import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import "./styles/index.js";

import Home from "./pages/Home";
import Footer from "./components/Footer";
import Header from "./components/header/Header";
import GoToTopButton from "./components/GoToTopButton.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
import { bookShelfRoutes } from "./routes/bookShelfRoutes.jsx";
import { gamesRoutes } from "./routes/gameRoutes.jsx";

const Projects = lazy(() => import("./pages/Projects").then((module) => ({ default: module.Projects })));
const ProjectPage = lazy(() => import("./pages/Projects").then((module) => ({ default: module.ProjectPage })));
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
          {gamesRoutes}
        </Routes>
      </Suspense>
      <Footer />
      <GoToTopButton />
    </AuthProvider>
  );
}

export default App;
