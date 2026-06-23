import Board from "../../features/profile/components/Board";
import { useParams, useNavigate } from "react-router-dom";
import fm from "front-matter";
import ReactMarkdown from "react-markdown";
import { Children, isValidElement, useState, useEffect } from "react";
import "./ProjectPage.css";

const parseChatTranscript = (transcript) => {
  const messages = [];
  let currentMessage = null;

  transcript
    .replace(/\r\n/g, "\n")
    .trim()
    .split("\n")
    .forEach((line) => {
      const speakerMatch = line.match(/^(Me|AI):\s*$/);

      if (speakerMatch) {
        if (currentMessage?.text.trim()) {
          messages.push({
            ...currentMessage,
            text: currentMessage.text.trim(),
          });
        }

        currentMessage = {
          speaker: speakerMatch[1] === "Me" ? "me" : "ai",
          text: "",
        };
        return;
      }

      if (currentMessage) {
        currentMessage.text += `${currentMessage.text ? "\n" : ""}${line}`;
      }
    });

  if (currentMessage?.text.trim()) {
    messages.push({
      ...currentMessage,
      text: currentMessage.text.trim(),
    });
  }

  return messages;
};

const ProjectChatBlock = ({ transcript }) => {
  const messages = parseChatTranscript(transcript);

  return (
    <div className="project-chat-snippet">
      <div className="project-chat-header">
        <span className="project-chat-dots" aria-hidden="true" />
        <span>Second brain dialogue</span>
      </div>
      <div className="project-chat-thread">
        {messages.map((message, index) => (
          <div
            key={`${message.speaker}-${index}`}
            className={`project-chat-message ${message.speaker}`}>
            <div className="project-chat-speaker">
              {message.speaker === "me" ? "Me" : "Second Brain AI"}
            </div>
            <div className="project-chat-bubble">{message.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectPre = ({ children, ...props }) => {
  const child = Children.toArray(children).find(isValidElement);
  const className = child?.props?.className || "";
  const codeChildren = child?.props?.children;
  const codeText = Array.isArray(codeChildren)
    ? codeChildren.join("")
    : String(codeChildren || "");

  if (className.includes("language-chat")) {
    return <ProjectChatBlock transcript={codeText} />;
  }

  return <pre {...props}>{children}</pre>;
};

const ProjectPage = ({}) => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [content, setContent] = useState(null);

  const modules = import.meta.glob("../../content/projects/*.md", {
    query: "?raw",
    import: "default",
  });

  useEffect(() => {
    const loader = modules[`../../content/projects/${slug}.md`];
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
      <div className="project-markdown">
        <ReactMarkdown
          components={{
            pre: ProjectPre,
            img: ({ node, ...props }) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "1.5rem 0",
                }}>
                <img
                  {...props}
                  style={{
                    maxWidth: "50%",
                    height: "auto",
                    borderRadius: "4px",
                  }}
                  loading="lazy"
                />
              </div>
            ),
            a: ({ node, ...props }) => {
              if (props.href?.startsWith("/demos/")) {
                return (
                  <a
                    {...props}
                    className="btn btn-info text-white fw-bold my-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                );
              }

              if (props.href?.startsWith("http")) {
                return (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                );
              }
              return <a {...props} />;
            },
          }}>
          {content.body}
        </ReactMarkdown>
      </div>
    </Board>
  );
};
export default ProjectPage;
