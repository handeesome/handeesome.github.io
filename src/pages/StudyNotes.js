import React from "react";
import Board from "../components/Board";
import "../styles/StudyNotes.css";

const Items = () => {
  const Item = ({ category, date }) => (
    <div className="row" style={{ backgroundColor: "transparent" }}>
      <div className="col-md-3 text-center">{date}</div>
      <div className="col-md-3 list-group-item-title">{category}</div>
    </div>
  );
  const items = [
    { category: "Programming Languages", date: "2024-2-11", itemLink: "/one" },
    { category: "Machine Learning", date: "2024-2-11", itemLink: "/one" },
    { category: "Web Development", date: "2024-2-11", itemLink: "/one" },
    { category: "Others", date: "2024-2-11", itemLink: "/one" },
  ];
  return (
    <div className="col-md-10 list-group">
      <p className="h4 mt-5">Study Notes</p>
      <hr />
      <div className="row">
        <div className="col-md-3 text-center">Last Updated</div>
        <div className="col-md-3 text-center">Categories</div>
      </div>
      {items.map((item, index) => (
        <a
          href={item.itemLink}
          key={index}
          className="pt-2 pb-2 list-group-item list-group-item-action">
          <Item category={item.category} date={item.date} />
        </a>
      ))}
    </div>
  );
};
const StudyNotes = ({ isDarkMode }) => {
  return (
    <Board isDarkMode={isDarkMode}>
      <Items />
    </Board>
  );
};
export default StudyNotes;
