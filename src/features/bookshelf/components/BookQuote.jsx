import { Quote } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

const BookQuote = ({ children }) => {
  const variants = {
    light: {
      container:
        "p-4 my-4 rounded shadow bg-warning bg-opacity-25 border-start border-3 border-warning",
      quote: "text-dark fs-5 fst-italic mb-3",
      attribution: "text-warning fw-semibold small",
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

  return (
    <blockquote className={`${styles.container} `}>
      <Quote className={styles.icon} />
      <p className={styles.quote}>"{children}"</p>
    </blockquote>
  );
};

export default BookQuote;
