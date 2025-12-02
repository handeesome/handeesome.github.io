import * as gameThumbs from "../../assets/images/games";
import styles from "./Games.module.css";
import { useNavigate } from "react-router-dom";
const Games = () => {
  const navigate = useNavigate();
  const games = [
    {
      name: "Sudoku",
      thumbnail: gameThumbs.sudoku,
      path: "/games/sudoku",
    },
  ];

  const handleClick = (path) => {
    navigate(path);
  };
  return (
    <div className="row">
      {games.map((game) => (
        <div key={game.id} className="col-4 col-md-3 mb-4">
          <div
            className={`card ${styles["game-card"]}`}
            onClick={() => handleClick(game.path)}>
            <img
              src={game.thumbnail}
              alt={game.name}
              className="card-img-top"
            />
            <div className="card-body">
              <h5 className="card-title">{game.name}</h5>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Games;
