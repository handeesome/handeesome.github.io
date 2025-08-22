import Board from "../../components/Board";
import fm from "front-matter";
import { useNavigate } from "react-router-dom";
const Items = () => {
  const navigate = useNavigate();
  const modules = import.meta.glob("../../data/projects/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const projects = Object.entries(modules).map(([path, raw]) => {
    const { attributes, body } = fm(raw);
    const slug = path.replace("../../data/projects/", "").replace(".md", "");
    return {
      title: attributes.title || slug,
      date: attributes.date
        ? new Date(attributes.date).toLocaleDateString()
        : "",
      slug,
    };
  });

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
    <div className="col-md-10 list-group">
      <div className="row">
        <div className="col-md-3 text-center">Last Updated</div>
        <div className="col-md-3 text-center">Title</div>
      </div>
      {projects.map(({ title, date, slug }) => {
        return (
          // Added missing return
          <a
            key={slug} // Better to use slug than index
            onClick={() => handleClick(slug)}
            className="pt-2 pb-2 list-group-item list-group-item-action">
            <Item title={title} date={date} />
          </a>
        );
      })}
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
