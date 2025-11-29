import { useState } from "react";
import Board from "../../../components/Board";
import Square from "./Square.jsx";
// import styles from "Sudoku.module.css";

export default function Sudoku() {
  const initialArray = [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
  ];
  const initialBoard = initialArray.map((row) =>
    row.map((value) => ({ value, editable: value === null }))
  );
  const [board, setBoard] = useState(initialBoard);

  const handleCellChange = (row, col, newValue) => {
    const newBoard = [...board];
    newBoard[row] = [...newBoard[row]];
    newBoard[row][col] = { ...newBoard[row][col], value: newValue };
    setBoard(newBoard);
  };
  return (
    <Board title="Sudoku Game">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              value={cell.value}
              row={rowIndex}
              col={colIndex}
              editable={cell.editable}
              onChange={(newValue) =>
                handleCellChange(rowIndex, colIndex, newValue)
              }
            />
          ))}
        </div>
      ))}
    </Board>
  );
}
