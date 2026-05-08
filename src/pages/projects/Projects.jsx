import Board from "../../features/profile/components/Board";
import "./Projects.css";
import fm from "front-matter";
import { useNavigate } from "react-router-dom";
import ArticleCard from "../../components/ArticleCard";
const Items = () => {
  const navigate = useNavigate();
  const modules = import.meta.glob("../../content/projects/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const projects = Object.entries(modules)
    .map(([path, raw]) => {
      const { attributes } = fm(raw);
      const slug = path.replace("../../content/projects/", "").replace(".md", "");
      const dateValue = attributes.date ? new Date(attributes.date) : null;

      return {
        title: attributes.title || slug,
        description: attributes.description || "",
        date: dateValue ? dateValue.toLocaleDateString() : "",
        dateTime: dateValue?.getTime() || 0,
        tags: attributes.tags || [],
        slug,
      };
    })
    .sort((a, b) => b.dateTime - a.dateTime);

  const Item = ({ title, date }) => (
    <div className="row">
      <div className="col-md-3 text-center">{date}</div>
      <div className="col-md-auto list-group-item-title">{title}</div>
    </div>
  );

  const handleClick = (slug) => {
    navigate(`./${slug}`);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-10 list-group">
        {projects.map(({ title, description, date, tags, slug }) => {
          return (
            <div key={slug}>
              <ArticleCard
                title={title}
                description={description}
                date={date}
                tags={tags}
                onClick={() => handleClick(slug)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Projects = () => {
  return (
    <Board title="Projects">
      <Items />
    </Board>
  );
};
export default Projects;
