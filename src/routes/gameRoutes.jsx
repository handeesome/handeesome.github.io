import { lazy } from "react";
import { Route } from "react-router-dom";
import Board from "../features/profile/components/Board.jsx";

const Sudoku = lazy(() => import("../features/games/sudoku/Sudoku.jsx"));
const Games = lazy(() => import("../pages/Games/Games.jsx"));

const withBoard = (Component, title) => (
  <Board title={title}>
    <Component />
  </Board>
);

export const gamesRoutes = (
  <Route path="/games">
    <Route index element={withBoard(Games, "Games")} />
    <Route path="sudoku" element={withBoard(Sudoku, "Sudoku")} />
  </Route>
);
