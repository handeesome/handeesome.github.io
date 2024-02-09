import { createContext, useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Test from "./Test";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // const toggleTheme = () => {
  //   setIsDarkMode(isDarkMode === "light" ? "dark" : "light");
  // };
  return (
    // <BrowserRouter>
    //   <Layout>
    //     <Routes>
    //       <Route exact path="/" component={Introduction} />
    //     </Routes>
    //   </Layout>
    // </BrowserRouter>
    <div style={{ background: isDarkMode ? "#181c27" : "#e7e7e7" }}>
      <Layout toggleMode={toggleMode} isDarkMode={isDarkMode}>
        <Home isDarkMode={isDarkMode} />
      </Layout>
    </div>

    // <Test />
  );
}

export default App;
