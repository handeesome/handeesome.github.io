import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import { useTheme } from "../../../contexts/ThemeContext";
import backgroundLight from "/src/assets/images/background_light.webp";
import backgroundDark from "/src/assets/images/background_dark.webp";
import bookQuotes from "../../../static/books/book-quotes.json";
import { Textfit } from "react-textfit";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState({ text: "", book: "" });
  const location = useLocation();

  // Select random quote on component mount or when URL changes
  useEffect(() => {
    const selectRandomQuote = () => {
      const bookIds = Object.keys(bookQuotes);
      if (bookIds.length === 0) return;

      // Randomly select a book
      const randomBookId = bookIds[Math.floor(Math.random() * bookIds.length)];
      const [bookName, bookQuotesArray] = bookQuotes[randomBookId];

      // Randomly select a quote from that book
      if (bookQuotesArray && bookQuotesArray.length > 0) {
        const randomQuote =
          bookQuotesArray[Math.floor(Math.random() * bookQuotesArray.length)];
        setSelectedQuote({ text: randomQuote, book: bookName });
      }
    };

    selectRandomQuote();
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.src = theme === "light" ? backgroundLight : backgroundDark;
    img.onload = () => setImageLoaded(true);
  }, [theme]);

  return (
    <div className="header-container">
      <div
        className="header-background"
        style={{
          backgroundImage: imageLoaded
            ? theme === "light"
              ? `url("${backgroundLight}")`
              : `url("${backgroundDark}")`
            : "none",
          backgroundColor: theme === "light" ? "#f0f0f0" : "#1a1a1a",
          transition: "opacity 0.3s ease",
          opacity: imageLoaded ? 1 : 0.5,
          position: "relative",
        }}
      >
        <NavBar isScrolled={isScrolled} />
        <div className="container h-100 d-flex align-items-start justify-content-center position-relative">
          <div
            className="position-absolute"
            style={{
              top: "15vh",
              width: "80%",
              height: "35vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Textfit
              key={selectedQuote.text}
              mode="multi"
              max={40}
              style={{
                height: "100%",
                fontStyle: "italic",
                textAlign: "center",
                lineHeight: "1.2",
                margin: "0",
                overflow: "hidden",
              }}
            >
              "{selectedQuote.text}"
            </Textfit>
            <p
              style={{
                textAlign: "right",
                marginTop: "20px",
                fontSize: "1.125rem",
                fontWeight: "500",
                margin: "20px 0 0 0",
              }}
            >
              — {selectedQuote.book}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
