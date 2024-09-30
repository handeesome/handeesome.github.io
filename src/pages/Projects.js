import React from "react";
import Board from "../components/Board";
import { Routes, Route } from "react-router-dom";
import HelloWorld from "./projects/HelloWorld";
import "../styles/Projects.css";

const Items = () => {
  const Item = ({ title, date }) => (
    <div className="row" style={{ backgroundColor: "transparent" }}>
      <div className="col-md-3 text-center">{date}</div>
      <div className="col-md-auto list-group-item-title">{title}</div>
    </div>
  );
  const items = [
    {
      title: "Auto Generate PPTX in Python using python-pptx",
      date: "2024-2-11",
      itemLink: "/projects/hello",
    },
  ];
  return (
    <div className="col-md-10 list-group">
      <p className="h4 mt-5">Projects</p>
      <hr />
      <div className="row">
        <div className="col-md-3 text-center">Last Updated</div>
        <div className="col-md-3 text-center">Title</div>
      </div>
      {items.map((item, index) => (
        <a
          href={item.itemLink}
          key={index}
          className="pt-2 pb-2 list-group-item list-group-item-action">
          <Item title={item.title} date={item.date} />
        </a>
      ))}
    </div>
  );
};
const Projects = ({ isDarkMode }) => {
  return (
    <Board isDarkMode={isDarkMode}>
      <Items />
    </Board>
  );
};
export default Projects;
