import Board from "../components/Board";
import TogglChart from "../components/TogglChart";

const Items = () => {
  const Item = ({ category, date, itemLink }) => (
    <a
      href={itemLink}
      className="row"
      style={{ backgroundColor: "transparent" }}>
      <div className="col-md-3">
        <div>{date}</div>
      </div>
      <div className="col-md-3 ">
        <div>{category}</div>
      </div>
    </a>
  );

  return (
    <div>
      <h1>My Time Tracking Dashboard</h1>
      <TogglChart />
    </div>
  );
};
const BookLists = () => {
  const title = "Book Lists";
  return (
    <Board title={title}>
      <Items />
    </Board>
  );
};
export default BookLists;
