import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { projects } from "./projectData";
import ProjectPreview from "./ProjectPreview";
import "./Projects.css";

export default function Projects() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const featured = projects.filter(project => project.featured).sort((a, b) => a.featured - b.featured);
  const more = projects.filter(project => !project.featured);

  return (
    <main className="projects-shell projects-index">
      <header className="projects-intro">
        <p className="projects-eyebrow">A few things I’ve built</p>
        <h1 className="projects-title">Projects<span className="projects-title-dot">.</span></h1>
        <p className="projects-lead">Small tools for reading, making, and the everyday problems that turn into projects.</p>
      </header>
      <section aria-labelledby="selected-projects-heading">
        <div className="projects-section-heading"><h2 id="selected-projects-heading">Selected projects</h2><span>A closer look</span></div>
        <div className="projects-featured-grid">
          {featured.map(project => (
            <Link className="project-feature-card" key={project.slug} to={`/projects/${project.slug}`}>
              <div className="project-feature-preview"><ProjectPreview project={project} /></div>
              <div className="project-feature-copy">
                <p className="project-category">{project.category}</p>
                <h3>{project.displayTitle}<ArrowUpRight size={22} aria-hidden="true" /></h3>
                <p className="project-feature-description">{project.description}</p>
                <div className="project-feature-footer"><span>{project.tags.slice(0, 3).join(" · ")}</span><span className="project-read-link">Explore project <ArrowRight size={15} aria-hidden="true" /></span></div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="projects-more" aria-labelledby="more-projects-heading">
        <div className="projects-section-heading"><h2 id="more-projects-heading">More projects</h2><span>{projects.length} projects, and counting</span></div>
        <div className="project-index-list">
          {more.map(project => (
            <Link className="project-index-row" key={project.slug} to={`/projects/${project.slug}`}>
              <time dateTime={project.isoDate}>{project.year}</time>
              <div><p className="project-category">{project.category}</p><h3>{project.displayTitle}</h3><p>{project.description}</p></div>
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
