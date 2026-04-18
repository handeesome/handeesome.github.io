import { useEffect, useRef, useState } from "react";
import Square from "./Square.jsx";
import styles from "./Sudoku.module.css";

const hasEmptyCells = (board) => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === null) return true;
    }
  }
  return false;
};

const getCandidates = (board, row, col) => {
  const used = new Set();

  // Check row
  for (let j = 0; j < 9; j++) {
    if (board[row][j] !== null) used.add(board[row][j]);
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] !== null) used.add(board[i][col]);
  }

  // Check 3x3 block
  const blockRow = Math.floor(row / 3) * 3;
  const blockCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[blockRow + i][blockCol + j] !== null) {
        used.add(board[blockRow + i][blockCol + j]);
      }
    }
  }

  const candidates = [];
  for (let num = 1; num <= 9; num++) {
    if (!used.has(num)) candidates.push(num);
  }
  return candidates;
};

const isSolvableLogically = (puzzle) => {
  const testBoard = puzzle.map((row) => [...row]);
  while (hasEmptyCells(testBoard)) {
    let madeProgress = false;
    // Check for cells with only one candidate
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (testBoard[i][j] === null) {
          const candidates = getCandidates(testBoard, i, j);
          if (candidates.length === 1) {
            testBoard[i][j] = candidates[0];
            madeProgress = true;
          }
        }
      }
    }
    if (!madeProgress) return false; // Stuck - requires guessing
  }
  return true;
};

const isValidPlacement = (board, row, col, value) => {
  for (let j = 0; j < 9; j++) if (board[row][j] === value) return false;
  for (let i = 0; i < 9; i++) if (board[i][col] === value) return false;

  const blockRow = Math.floor(row / 3) * 3;
  const blockCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[blockRow + i][blockCol + j] === value) return false;

  return true;
};

const countSolutions = (board, limit = 2) => {
  const findBestEmpty = (b) => {
    let best = null;
    let bestCount = 10;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (b[i][j] === null) {
          let count = 0;
          for (let v = 1; v <= 9; v++)
            if (isValidPlacement(b, i, j, v)) count++;
          if (count === 0) return { i, j, count: 0 };
          if (count < bestCount) {
            bestCount = count;
            best = { i, j, count };
            if (bestCount === 1) return best;
          }
        }
      }
    }
    return best;
  };

  let solution = 0;
  const backtrack = (b) => {
    if (solution >= limit) return;
    const empty = findBestEmpty(b);
    if (!empty) {
      solution++;
      return;
    }
    const { i, j } = empty;

    const candidates = [];
    for (let v = 1; v <= 9; v++)
      if (isValidPlacement(b, i, j, v)) candidates.push(v);
    for (let k = 0; k < candidates.length; k++) {
      b[i][j] = candidates[k];
      backtrack(b);
      if (solution >= limit) {
        b[i][j] = null;
        return;
      }
    }
    b[i][j] = null;
  };

  const boardCopy = board.map((row) => [...row]);
  backtrack(boardCopy);
  return solution;
};

const shuffleArray = (arr) => {
  // Fisher-Yates
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

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
    newBoard = swapNumbers(newBoard, numA, numB);
  }
  return newBoard;
};
const generateFullSudoku = (board) =>
  shuffleNumbers(
    shuffleStack(shuffleColsInStack(shuffleBands(shuffleRowsInBand(board))))
  );

const removeNumbers = (solvedBoard, removeCount) => {
  const puzzle = solvedBoard.map((row) => [...row]);

  const allCoords = [];
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++) allCoords.push([i, j]);
  const order = shuffleArray(allCoords);

  let removed = 0;
  let idx = 0;

  while (removed < removeCount && idx < order.length) {
    const [row, col] = order[idx++];

    if (puzzle[row][col] === null) continue;

    const backup = puzzle[row][col];
    puzzle[row][col] = null;

    const solutions = countSolutions(puzzle, 2);
    if (solutions === 1 && isSolvableLogically(puzzle)) {
      removed++;
    } else {
      puzzle[row][col] = backup;
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

  const [puzzleData] = useState(() => {
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

    return { solution: initialArray, initialBoard };
  });
  const [board, setBoard] = useState(puzzleData.initialBoard);

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
  const availableNumbers = (row, col) => {
    let used = new Set();
    for (let r = 0; r < 9; r++) {
      if (r == row) continue;
      if (board[r][col].value !== null) {
        used.add(board[r][col].value);
      }
    }
    for (let c = 0; c < 9; c++) {
      if (c == col) continue;
      if (board[row][c].value !== null) {
        used.add(board[row][c].value);
      }
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (r == row && c == col) continue;
        if (board[r][c].value !== null) {
          used.add(board[r][c].value);
        }
      }
    }
    let allNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    return [...allNumbers].filter((n) => !used.has(n));
  };
  const bruteForce = () => {
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (newBoard[r][c].value === null) {
          newBoard[r][c].tempValues = availableNumbers(r, c);
        }
      }
    }
    setBoard(newBoard);
    console.log("Board with temp values:", newBoard);
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (
          newBoard[r][c].tempValues &&
          newBoard[r][c].tempValues.length === 1
        ) {
          console.log("Filling ", r, c, " with ", newBoard[r][c].tempValues[0]);
        }
      }
    }
  };
  return (
    <div
      ref={boardRef}
      className="d-flex flex-column align-items-center justify-content-center ">
      <button className="btn btn-info mb-3" onClick={() => bruteForce()}>
        Auto Complete Algorithm 1
      </button>
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
              answer={puzzleData.solution[rowIndex][colIndex]}
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
              if (cell.editable) handleCellChange(selRow, selCol, n);
            }}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sudoku;
