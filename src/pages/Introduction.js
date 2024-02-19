import React, { useRef, useEffect, useState } from "react";
import Board from "../components/Board";
import "../styles/Introduction.css";

const Item = ({ title, description }) => (
  <div className="card mb-3 custom-card">
    <a href="/projects/hello" className="card-body">
      <h5 className="card-title">{title}</h5>
      <p className="card-text">{description}</p>
    </a>
    <div className="card-footer bg-transparent">
      <time>2024-2-15</time>
      <a className="tag">hello world</a>
    </div>
  </div>
);
const Introduction = ({ isDarkMode }) => {
  const items = [
    {
      title: "Hello World",
      description: "First item that will always be displayed to the viewers.",
    },
  ];
  return (
    <Board isDarkMode={isDarkMode}>
      <div className="row justify-content-center" id="introduction">
        <div className="col-md-10 mt-5">
          {/* Map over the array of items and render individual Item introComponents */}
          {items.map((item, index) => (
            <div key={index}>
              <Item
                title={item.title}
                description={item.description}
                isDarkMode={isDarkMode}
              />
            </div>
          ))}
        </div>
      </div>
    </Board>
  );
};

export default Introduction;
