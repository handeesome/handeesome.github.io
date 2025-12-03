import { useEffect, useRef, useState } from "react";
import Square from "./Square.jsx";
import styles from "./Sudoku.module.css";

const shuffleRowsInBand = (board) => {
  const result = board.map((row) => [...row]);
  for (let band = 0; band < 3; band++) {
    const start = band * 3;
    const rows = [0, 1, 2].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3; i++) {
      result[start + i] = board[start + rows[i]];
    }
  }
  return result;
};
const transpose = (matrix) =>
  matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));

const shuffleColsInStack = (board) => shuffleRowsInBand(transpose(board));

const shuffleBands = (board) => {
  const result = board.map((row) => [...row]);
  const bands = [0, 1, 2].sort(() => Math.random() - 0.5);
  for (let band = 0; band < 3; band++) {
    for (let i = 0; i < 3; i++) {
      result[band * 3 + i] = board[bands[band] * 3 + i];
    }
  }
  return result;
};
const shuffleStack = (board) => shuffleBands(transpose(board));

const swapNumbers = (board, numA, numB) => {
  return board.map((row) =>
    row.map((cell) => {
      if (cell === numA) return numB;
      if (cell === numB) return numA;
      return cell;
    })
  );
};
const shuffleNumbers = (board) => {
  for (let i = 0; i < 10; i++) {
    const numA = Math.floor(Math.random() * 9) + 1;
    const numB = Math.floor(Math.random() * 9) + 1;
    swapNumbers(board, numA, numB);
  }
  return board;
};
const generateSudoku = (board) =>
  shuffleNumbers(
    shuffleStack(shuffleColsInStack(shuffleBands(shuffleRowsInBand(board))))
  );
const Sudoku = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const boardRef = useRef(null);

  const solvedBase = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 4, 5, 6, 7, 8, 9, 1],
    [5, 6, 7, 8, 9, 1, 2, 3, 4],
    [8, 9, 1, 2, 3, 4, 5, 6, 7],
    [3, 4, 5, 6, 7, 8, 9, 1, 2],
    [6, 7, 8, 9, 1, 2, 3, 4, 5],
    [9, 1, 2, 3, 4, 5, 6, 7, 8],
  ];
  const initialArray = generateSudoku(solvedBase);
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
      if (boardRef.current && !boardRef.current.contains(e.target)) {
        setSelectedIndex(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div ref={boardRef} className={styles["sudoku-board"]}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
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
        ))
      )}
    </div>
  );
};

export default Sudoku;
