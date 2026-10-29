import { ArrowLeft, ArrowUpRight, Maximize2, X } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { projects, getProjectHeadings } from "./projectData";
import ReactMarkdown from "react-markdown";
import { Children, isValidElement, useState, useEffect, useRef } from "react";
import { ScoreIllustration } from "./ProjectPreview";
import "./Projects.css";
import "./ProjectArticle.css";

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

function ProjectImage({ src, alt, onOpen }) {
  return (
    <span className="project-figure">
      <button className="project-image-button" type="button" onClick={() => onOpen({ src, alt })} aria-label={`Enlarge image: ${alt || "Project screenshot"}`}>
        <img src={src} alt={alt || "Project screenshot"} loading="lazy" />
        <span className="project-image-hint"><Maximize2 size={13} aria-hidden="true" /> View full image</span>
      </button>
      {alt && <span className="project-image-caption">{alt}</span>}
    </span>
  );
}

function ProjectImageViewer({ image, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  return (
    <dialog ref={dialogRef} className="project-image-dialog" aria-label={image.alt || "Project screenshot"} onCancel={onClose} onClick={event => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) onClose();
    }}>
      <div className="project-image-dialog-toolbar"><span>{image.alt || "Project screenshot"}</span><button type="button" onClick={onClose}><X size={18} aria-hidden="true" /> Close</button></div>
      <img src={image.src} alt={image.alt || "Project screenshot"} />
    </dialog>
  );
}

function TableOfContents({ headings, onNavigate }) {
  return <nav aria-label="On this page"><ol>{headings.map(heading => <li key={heading.id}><a href={`#${heading.id}`} onClick={onNavigate}>{heading.text}</a></li>)}</ol></nav>;
}

function ProjectArticle({ project }) {
  const [image, setImage] = useState(null);
  const body = project.image ? project.body.replace(project.image.markdown, "") : project.body;
  const headings = getProjectHeadings(body);

  useEffect(() => {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [project.slug]);

  return (
    <main className="projects-shell project-detail">
      <Link className="project-back-link" to="/projects"><ArrowLeft size={16} aria-hidden="true" /> All projects</Link>
      <header className="project-detail-heading">
        <div className="project-detail-meta"><span className="project-category">{project.category}</span><span aria-hidden="true">/</span><time dateTime={project.isoDate}>{project.date}</time></div>
        <h1>{project.displayTitle}</h1>
        <p className="project-detail-description">{project.description}</p>
        {project.links.length > 0 && <div className="project-detail-actions">{project.links.map((link, index) => <a key={link.href} className={index === 0 ? "project-action-primary" : "project-action-secondary"} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</div>}
        <p className="project-detail-tags">{project.tags.join(" · ")}</p>
      </header>
      {project.illustration === "score" ? (
        <figure className="project-hero-illustration"><ScoreIllustration /><figcaption>Mark the score, sync phrases with the audio, and export a video. Workflow illustration.</figcaption></figure>
      ) : project.image && <figure className="project-hero-image"><ProjectImage {...project.image} onOpen={setImage} /></figure>}
      {headings.length > 0 && <details className="project-mobile-toc"><summary>On this page</summary><TableOfContents headings={headings} onNavigate={event => event.currentTarget.closest("details").removeAttribute("open")} /></details>}
      <div className={`project-article-layout${headings.length ? "" : " project-article-layout--no-toc"}`}>
        <article className="project-markdown">
          <ReactMarkdown components={{
            pre: ProjectPre,
            img: ({ src, alt }) => <ProjectImage src={src} alt={alt} onOpen={setImage} />,
            h2: ({ node, children }) => <h2 id={`section-${node.position.start.line}`}>{children}</h2>,
            a: ({ href, children }) => <a href={href} {...(href?.startsWith("http") || href?.startsWith("/demos/") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>,
          }}>{body}</ReactMarkdown>
        </article>
        {headings.length > 0 && <aside className="project-toc"><p>On this page</p><TableOfContents headings={headings} /></aside>}
      </div>
      <footer className="project-detail-footer"><span>There’s more where this came from.</span><Link to="/projects">Explore all projects <ArrowUpRight size={16} aria-hidden="true" /></Link></footer>
      {image && <ProjectImageViewer image={image} onClose={() => setImage(null)} />}
    </main>
  );
}

export default function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find(item => item.slug === slug);
  if (!project) return <main className="projects-shell project-detail"><h1>Project not found</h1><p>This project may have moved.</p><Link to="/projects">Browse all projects</Link></main>;
  return <ProjectArticle key={slug} project={project} />;
}
