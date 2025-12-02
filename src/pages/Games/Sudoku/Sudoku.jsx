import { useEffect, useRef, useState } from "react";
import Square from "./Square.jsx";
// import styles from "Sudoku.module.css";

const Sudoku = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const boardRef = useRef(null);

  const initialArray = [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      console.log(boardRef.current);
      if (!boardRef.current.contains(e.target)) {
        setSelectedIndex(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div ref={boardRef}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              selected={selectedIndex === `${rowIndex}-${colIndex}`}
              value={cell.value}
              row={rowIndex}
              col={colIndex}
              editable={cell.editable}
              onSelect={() => {
                setSelectedIndex(`${rowIndex}-${colIndex}`);
              }}
              onChange={(newValue) =>
                handleCellChange(rowIndex, colIndex, newValue)
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sudoku;
