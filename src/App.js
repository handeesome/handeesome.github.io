import { createContext, useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Test from "./Test";

function App() {
  const [themeMode, setThemeMode] = useState("light");
  const toggleMode = () => {
    if (themeMode === "light") {
      setThemeMode("dark");
      document.body.style.backgroundColor = "#050122"; //'#042743'
    } else {
      setThemeMode("light");
      document.body.style.backgroundColor = "#e7e7e7";
    }
  };

  // const toggleTheme = () => {
  //   setThemeMode(themeMode === "light" ? "dark" : "light");
  // };
  return (
    // <BrowserRouter>
    //   <Layout>
    //     <Routes>
    //       <Route exact path="/" component={Introduction} />
    //     </Routes>
    //   </Layout>
    // </BrowserRouter>
    <div>
      <Layout toggleMode={toggleMode}>
        <Home />
      </Layout>
    </div>

    // <Test />
  );
}

export default App;
