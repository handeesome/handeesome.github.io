import { useLocation } from "react-router-dom";
import Header from "../../components/layout/header/Header";
import NavBar from "../../components/layout/header/NavBar";

export default function ProjectsHeader() {
  const { pathname } = useLocation();
  const isProjectRoute = pathname === "/projects" || pathname.startsWith("/projects/");
  return isProjectRoute ? (
    <div className="projects-navigation" style={{ height: 50 }}>
      <NavBar isScrolled />
    </div>
  ) : <Header picHeight={80} />;
}
