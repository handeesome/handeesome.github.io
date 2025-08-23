import Board from "../../components/Board";
import { useParams, useNavigate } from "react-router-dom";
import fm from "front-matter";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

const ProjectPage = ({}) => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [content, setContent] = useState(null);

  const modules = import.meta.glob("../../data/projects/*.md", {
    query: "?raw",
    import: "default",
  });

  useEffect(() => {
    const loader = modules[`../../data/projects/${slug}.md`];
    if (!loader) {
      setContent(null);
      return;
    }

    // Dynamically import the requested MD file
    loader().then((raw) => {
      const { attributes, body } = fm(raw);
      setContent({ attributes, body });
    });
  }, [slug]);

  if (!content) return <div>Loading or project not found...</div>;

  return (
    <Board
      title={content.attributes.title}
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
      <ReactMarkdown>{content.body}</ReactMarkdown>
    </Board>
  );
};
export default ProjectPage;
