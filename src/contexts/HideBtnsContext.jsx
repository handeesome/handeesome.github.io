// src/components/bookShelf/hideBtnsContext.jsx
import { createContext, useContext } from "react";

const HideBtnsContext = createContext({
  hideEditDelete: false,
  hideSessions: false,
  hideQuotes: false,
  hideActions: false,
  hideTimeTracker: false,
});

export const useHideBtns = () => useContext(HideBtnsContext);

export default HideBtnsContext;
