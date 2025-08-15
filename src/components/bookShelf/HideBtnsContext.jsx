// src/components/bookShelf/hideBtnsContext.jsx
import { createContext, useContext } from "react";

const HideBtnsContext = createContext({
  hideEditDelete: false,
  hideSessions: false,
});

export const useHideBtns = () => useContext(HideBtnsContext);

export default HideBtnsContext;
