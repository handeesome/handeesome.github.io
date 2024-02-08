import React, { useState, createContext, useContext } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

// Create a context to manage theme
const ThemeContext = createContext();

// Create light theme
const lightTheme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

// Create dark theme
const darkTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
});

const Test = () => {
  const [themeMode, setThemeMode] = useState("light");

  const toggleTheme = () => {
    setThemeMode(themeMode === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={themeMode}>
      <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
        <div>
          <Button onClick={toggleTheme}>
            {themeMode === "light"
              ? "Switch to Dark Theme"
              : "Switch to Light Theme"}
          </Button>
          <Content />
        </div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

const Content = () => {
  const themeMode = useContext(ThemeContext);

  return (
    <div>
      <h1 style={{ color: themeMode === "light" ? "#333" : "#f0f0f0" }}>
        Welcome to My Test
      </h1>
      {/* Other content */}
    </div>
  );
};

export default Test;
