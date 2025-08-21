import Board from "../components/Board";
import { useTheme } from "../ThemeContext";

const Item = ({ title, description }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`card mb-3 custom-card ${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
      }`}>
      <a href="/projects/HelloWorld" className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
      </a>
      <div className="card-footer">
        <time>2024-2-15 </time>
        <a className="tag">hello world</a>
      </div>
    </div>
  );
};
const Introduction = () => {
  const items = [
    {
      title: "Hello World",
      description: "First item that will always be displayed to the viewers.",
    },
  ];
  return (
    <Board title="Introduction">
      <div className="row justify-content-center" id="introduction">
        <div className="col-md-10 mt-5">
          {/* Map over the array of items and render individual Item introComponents */}
          {items.map((item, index) => (
            <div key={index}>
              <Item title={item.title} description={item.description} />
            </div>
          ))}
        </div>
      </div>
    </Board>
  );
};

export default Introduction;
