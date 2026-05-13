import { Quote } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import parse from "html-react-parser";
import {
  getQuoteContentHtml,
  getQuoteSourceLabel,
} from "../utils/quotes";

const BookQuote = ({ children, quote }) => {
  const variants = {
    light: {
      container:
        "p-3 my-3 rounded shadow bg-warning bg-opacity-25 border-start border-3 border-warning",
      quote: "text-dark fs-6 fst-italic mb-2",
      attribution: "text-primary fw-semibold small",
      icon: "text-warning me-2",
    },
    dark: {
      container:
        "p-3 my-3 rounded shadow bg-dark border-start border-3 border-purple text-light",
      quote: "text-light fs-6 fst-italic mb-2",
      attribution: "text-purple fw-medium small",
      icon: "text-purple me-2",
    },
  };
  const { theme } = useTheme();

  const styles = variants[theme] || variants.light;
  const quoteHtml = quote ? getQuoteContentHtml(quote) : "";
  const sourceLabel = getQuoteSourceLabel(quote);

  return (
    <blockquote className={`${styles.container} `}>
      <Quote className={styles.icon} />
      <p className={styles.quote}>
        "{quoteHtml ? parse(quoteHtml) : children}"
      </p>
      {sourceLabel && <footer className={styles.attribution}>{sourceLabel}</footer>}
    </blockquote>
  );
};

export default BookQuote;
