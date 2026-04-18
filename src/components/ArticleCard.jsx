import { useTheme } from "../contexts/ThemeContext";
const Card = ({ title, description, date, tags, onClick }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`card mb-3 article-card ${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
      }`}>
      <a onClick={onClick} className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
      </a>
      <div className="card-footer">
        <time>{date} </time>
        {tags.map((tag, index) => {
          return (
            <a className="tag" key={index}>
              #{tag}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Card;
