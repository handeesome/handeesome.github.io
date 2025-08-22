import Board from "../../components/Board";
import { useParams, useNavigate } from "react-router-dom";
import fm from "front-matter";
import ReactMarkdown from "react-markdown";

const ProjectPage = ({}) => {
  const navigate = useNavigate();
  const modules = import.meta.glob("../../data/projects/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const { slug } = useParams();
  const raw = modules[`../../data/projects/${slug}.md`];
  if (!raw) return <div>Project not found</div>;

  const { attributes, body } = fm(raw);
  return (
    <Board
      title={attributes.title}
      titleRight={
        <button
          className="btn btn-outline-info"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/projects");
            }
          }}>
          ← Go Back
        </button>
      }>
      <ReactMarkdown>{body}</ReactMarkdown>
    </Board>
  );
};
export default ProjectPage;
