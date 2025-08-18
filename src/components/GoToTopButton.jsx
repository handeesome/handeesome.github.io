import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const GoToTopButton = () => {
  const [visible, setVisible] = useState(false);

  // Show button when scrolled down 200px
  useEffect(() => {
    console.log(window.scrollY);
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className="btn btn-primary position-fixed"
      style={{
        bottom: "2rem",
        right: "2rem",
        borderRadius: "50%",
        width: "3rem",
        height: "3rem",
        display: visible ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={scrollToTop}
      aria-label="Go to top">
      <ChevronUp size={20} />
    </button>
  );
};

export default GoToTopButton;
