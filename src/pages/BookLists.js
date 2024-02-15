import React, { Children, useState } from "react";
import Board from "../components/Board";

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
  const items = [
    { category: "Programming Languages", date: "2-11", itemLink: "/one" },
    { category: "Machine Learning", date: "2-11", itemLink: "/one" },
    { category: "Web Development", date: "2-11", itemLink: "/one" },
    { category: "Others", date: "2-11", itemLink: "/one" },
  ];
  return (
    <div className="col-md-10">
      <p className="h4 mt-5">Study Notes</p>
      <hr />

      <table
        class="table table-hover table-dark"
        style={{ backgroundColor: "black" }}>
        <thead>
          <tr>
            <th scope="col">Last Updated</th>
            <th scope="col">Categories</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1-11</th>
            <td>Programming Languages</td>
          </tr>
          <tr>
            <th scope="row">2-11</th>
            <td>Machine Learning</td>
          </tr>
          <tr>
            <th scope="row">4-11</th>
            <td>Web Development</td>
          </tr>
          <tr>
            <th scope="row">3-11</th>
            <td>Others</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
const BookLists = ({ isDarkMode }) => {
  return (
    <Board isDarkMode={isDarkMode}>
      <Items />
    </Board>
  );
};
export default BookLists;
