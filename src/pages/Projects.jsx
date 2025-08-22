import Board from "../components/Board";

const Items = () => {
  const modules = import.meta.glob("../data/projects/*.md", { eager: true });
  const projects = Object.entries(modules).map(([path, module]) => {
    const slug = path.replace("../data/projects/", "").replace(".md", "");
    return {
      title: module.frontmatter?.title || slug,
      date: module.frontmatter?.date,
      link: `/projects/${slug}`,
      slug,
    };
  });

  const Item = ({ title, date }) => (
    <div className="row">
      <div className="col-md-3 text-center">{date}</div>
      <div className="col-md-auto list-group-item-title">{title}</div>
    </div>
  );

  return (
    <div className="col-md-10 list-group">
      <div className="row">
        <div className="col-md-3 text-center">Last Updated</div>
        <div className="col-md-3 text-center">Title</div>
      </div>
      {projects.map(({ title, date, link, slug }, index) => {
        return (
          // Added missing return
          <a
            key={slug} // Better to use slug than index
            href={link} // Added the link functionality
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
