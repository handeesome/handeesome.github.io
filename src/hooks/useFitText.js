import { useState, useLayoutEffect, useRef } from "react";

export function useFitText({ maxRem = 2.5, minRem = 0.8, step = 0.05 } = {}) {
  const ref = useRef(null);
  const [fontRem, setFontRem] = useState(maxRem);
  const prevContent = useRef("");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const currentContent = el.textContent || "";
    if (currentContent === prevContent.current) return;
    prevContent.current = currentContent;

    let size = maxRem;

    // Temporarily apply via inline style ONLY for measurement
    el.style.fontSize = `${size}rem`;

    while (
      (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) &&
      size > minRem
    ) {
      size -= step;
      el.style.fontSize = `${size}rem`;
    }

    setFontRem(size);
  }, [maxRem, minRem, step]);

  return { ref, fontRem };
}
