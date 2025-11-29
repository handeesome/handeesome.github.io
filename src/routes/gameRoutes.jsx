import { lazy } from "react";
import { Route } from "react-router-dom";

const Sudoku = lazy(() => import("../pages/Games/Sudoku/Sudoku.jsx"));

export const gamesRoutes = (
  <Route path="/games">
    <Route path="sudoku" element={<Sudoku />} />
  </Route>
);
