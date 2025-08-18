import { Blocks } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToRef = ({ scrollRef }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [pathname, scrollRef]);

  return null;
};

export default ScrollToRef;
