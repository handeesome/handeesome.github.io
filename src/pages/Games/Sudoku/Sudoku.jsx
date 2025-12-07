import { useEffect, useRef, useState } from "react";
import Square from "./Square.jsx";
import styles from "./Sudoku.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";

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
  let newBoard = board;
  for (let i = 0; i < 10; i++) {
    const numA = Math.floor(Math.random() * 9) + 1;
    const numB = Math.floor(Math.random() * 9) + 1;
    newBoard = swapNumbers(board, numA, numB);
  }
  return newBoard;
};
const generateFullSudoku = (board) =>
  shuffleNumbers(
    shuffleStack(shuffleColsInStack(shuffleBands(shuffleRowsInBand(board))))
  );

const removeNumbers = (board, removeCount) => {
  const puzzle = board.map((row) => [...row]);
  let removed = 0;

  while (removed < removeCount) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== null) {
      puzzle[row][col] = null;
      removed++;
    }
  }
  return puzzle;
};

const Sudoku = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selRow, selCol] = selectedIndex
    ? selectedIndex.split("-").map(Number)
    : [null, null];

  const selBlockRow = selRow !== null ? Math.floor(selRow / 3) : null;
  const selBlockCol = selCol !== null ? Math.floor(selCol / 3) : null;

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

  const initialArray = generateFullSudoku(solvedBase);
  const puzzle = removeNumbers(initialArray, 55);
  const initialBoard = puzzle.map((row) =>
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
    <div
      ref={boardRef}
      className="d-flex flex-column align-items-center justify-content-center ">
      <div className={styles["sudoku-board"]}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              selected={selectedIndex === `${rowIndex}-${colIndex}`}
              highlightBlock={
                (selRow !== null &&
                  Math.floor(rowIndex / 3) === selBlockRow &&
                  Math.floor(colIndex / 3) === selBlockCol) ||
                selRow === rowIndex ||
                selCol === colIndex
              }
              value={cell.value}
              row={rowIndex}
              col={colIndex}
              answer={solvedBase[rowIndex][colIndex]}
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

      <div className="mt-4 d-flex justify-content-center gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            className={`btn btn-outline-primary ${styles["number-btn"]}`}
            onClick={() => {
              if (!selectedIndex) return;
              const cell = board[selRow][selCol];
              if (cell.editable) handleCellChange(selRow, selCol, String(n));
            }}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sudoku;
