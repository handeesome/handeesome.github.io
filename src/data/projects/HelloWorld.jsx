import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import content from "./hello-world.md";

const HelloWorld = () => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    setMarkdown(content);
  }, []); // empty dependency array: run once on mount

  return <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>;
};

export default HelloWorld;
