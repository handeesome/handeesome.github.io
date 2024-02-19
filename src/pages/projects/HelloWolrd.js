import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import content from "./hello-world.md";

const HelloWorld = () => {
  const [markdown, setMarkdown] = useState("");
  fetch(content)
    .then((response) => response.text())
    .then((text) => {
      setMarkdown(text);
    });

  return <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>;
};

export default HelloWorld;
