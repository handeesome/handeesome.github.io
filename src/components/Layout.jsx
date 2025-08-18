import Header from "./Header";
import Footer from "./Footer";
import GoToTopButton from "./GoToTopButton";

const Layout = ({ toggleMode, isDarkMode, children }) => {
  return (
    <div>
      <Header toggleMode={toggleMode} isDarkMode={isDarkMode} />
      {children}
      <Footer isDarkMode={isDarkMode} />
      <GoToTopButton />
    </div>
  );
};

export default Layout;
