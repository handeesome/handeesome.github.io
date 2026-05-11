import { Link } from "react-router-dom";
import {
  BookOpen,
  Code2,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import Board from "../features/profile/components/Board";
import books from "../static/books/books.json";
import { getTagColor } from "../utils/tagColors";
import "./Introduction.css";

const profileLinks = [
  {
    label: "GitHub",
    href: "https://github.com/handeesome",
    icon: <Github size={19} aria-hidden="true" />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/cenhan-du-5251111ba/",
    icon: <Linkedin size={19} aria-hidden="true" />,
  },
  {
    label: "Email",
    href: "mailto:ducenhandee@gmail.com",
    icon: <Mail size={19} aria-hidden="true" />,
  },
];

const highlights = [
  {
    icon: <GraduationCap size={20} aria-hidden="true" />,
    title: "Computer Science",
    text: "B.Sc. graduate from Constructor University in Bremen, formerly Jacobs University.",
  },
  {
    icon: <Code2 size={20} aria-hidden="true" />,
    title: "Builder",
    text: "I enjoy React, JavaScript, Python, and small tools that make everyday workflows easier.",
  },
  {
    icon: <MapPin size={20} aria-hidden="true" />,
    title: "Personal site",
    text: "I use this space to collect projects, notes, reading records, and whatever else feels worth building over time.",
  },
];

const skills = [
  "React",
  "JavaScript",
  "Python",
  "Node.js",
  "Flask",
  "Bootstrap",
  "Firebase",
  "Data analysis",
];

const formatTagLabel = (tag) =>
  tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatBookTitle = (book) =>
  book.title2 ? `${book.title} / ${book.title2}` : book.title;

const tagSummaries = Object.values(
  books
    .filter((book) => book.shelves?.includes("read"))
    .reduce((acc, book) => {
      book.tags?.forEach((tag) => {
        if (!acc[tag]) {
          acc[tag] = {
            label: formatTagLabel(tag),
            tag,
            count: 0,
            candidates: [],
          };
        }

        acc[tag].count += 1;

        if (!acc[tag].candidates.some(({ id }) => id === book.id)) {
          acc[tag].candidates.push({
            id: book.id,
            title: formatBookTitle(book),
          });
        }
      });

      return acc;
    }, {}),
)
  .sort((a, b) => b.count - a.count)
  .slice(0, 4);

const usedReadingBookIds = new Set();

const readingTags = tagSummaries.map(({ candidates, ...summary }) => {
  const examples = candidates
    .filter(({ id }) => !usedReadingBookIds.has(id))
    .slice(0, 3);

  examples.forEach(({ id }) => usedReadingBookIds.add(id));

  return {
    ...summary,
    books: examples.map(({ title }) => title),
  };
});

const Introduction = () => {
  return (
    <Board title="About Me">
      <section className="about-page" aria-label="About Cenhan Du">
        <div className="about-hero">
          <div className="about-photo-wrap">
            <img
              className="about-photo"
              src="/profile-photo.jpg"
              alt="Cenhan Du standing in the snow"
            />
          </div>

          <div className="about-intro">
            <p className="about-kicker">
              <MapPin size={16} aria-hidden="true" />
              Ningbo, China / Bremen, Germany
            </p>
            <h1>Hi, I&apos;m Cenhan Du.</h1>
            <p className="about-lead">
              I&apos;m a computer science graduate who likes turning small
              everyday needs into web tools, notes, dashboards, and experiments
              that help me learn more clearly.
            </p>
            <p>
              This website is part portfolio, part playground, and part digital
              shelf. You will find projects from my CV here, but also more
              casual things like games, reading notes, and experiments I keep
              improving over time.
            </p>

            <div className="about-actions" aria-label="Profile links">
              {profileLinks.map(({ label, href, icon }) => (
                <a
                  className="about-icon-link"
                  href={href}
                  key={label}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto:")
                      ? undefined
                      : "noreferrer noopener"
                  }
                  aria-label={label}
                  title={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <section className="about-site-section" aria-label="About this site">
          <div>
            <h2>What This Site Is</h2>
            <p>
              This is my personal static website: a place for projects, notes,
              reading records, small experiments, and things I want to keep
              organized outside of social media.
            </p>
          </div>

          <div>
            <h2>Currently</h2>
            <ul>
              <li>Expanding this site into a more complete personal archive.</li>
              <li>Refining React interfaces and small workflow tools.</li>
              <li>Adding more small games to the Games page.</li>
              <li>Keeping track of books, ideas, and what I am learning.</li>
            </ul>
          </div>
        </section>

        <section className="about-reading-section" aria-label="Reading hobby">
          <div>
            <h2>What I Like Reading</h2>
            <p>
              Reading is one of the habits I keep coming back to. I like
              bouncing between different shelves, especially:
            </p>
            <div className="about-reading-tags" aria-label="Reading interests">
              {readingTags.map(({ label, tag, count, books }) => (
                <span
                  className="about-reading-tag"
                  key={tag}
                  style={{ "--tag-color": getTagColor(tag) }}
                  tabIndex="0"
                >
                  {label}
                  <span className="about-reading-count">{count}</span>
                  <span className="about-reading-tooltip" role="tooltip">
                    <strong>Already read</strong>
                    <ul>
                      {books.map((title) => (
                        <li key={title}>{title}</li>
                      ))}
                    </ul>
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="about-reading-cta">
            <p>
              I keep a timeline of that reading journey too, if you want a
              quick look at what I have been reading so far.
            </p>
            <Link
              className="about-primary-btn"
              to="/book-shelf/cenhan/reading-timeline"
            >
              <BookOpen size={18} aria-hidden="true" />
              My reading journey
            </Link>
          </div>
        </section>

        <div className="about-highlights">
          {highlights.map(({ icon, title, text }) => (
            <article className="about-highlight" key={title}>
              <span className="about-highlight-icon">{icon}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="about-details">
          <div>
            <h2>Experience</h2>
            <div className="about-experience-list">
              <article>
                <div>
                  <h3>Student Assistant</h3>
                  <span>Jacobs University Bremen · Oct 2021 - Dec 2021</span>
                </div>
                <p>
                  Supported a Data Acquisition course by helping students work
                  with Arduino circuits, sensors, programming tasks, and
                  real-time data processing during lab sessions.
                </p>
              </article>

              <article>
                <div>
                  <h3>Research Assistant</h3>
                  <span>Institute of AI, University of Bremen · Jun 2021 - Sep 2021</span>
                </div>
                <p>
                  Contributed to research work migrating a project from Unreal
                  Engine 4 into NVIDIA Omniverse, handling cross-platform setup,
                  troubleshooting, and prototype integration.
                </p>
              </article>

              <article>
                <div>
                  <h3>Software Engineer Intern</h3>
                  <span>PRYZL · Jun 2020 - Aug 2020</span>
                </div>
                <p>
                  Developed Flutter UI components and a mobile sign-up flow with
                  phone number and password authentication for a smoother
                  onboarding experience.
                </p>
              </article>
            </div>
          </div>

          <div>
            <h2>Tools I Reach For</h2>
            <div className="about-skill-list" aria-label="Skills">
              {skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Board>
  );
};

export default Introduction;
