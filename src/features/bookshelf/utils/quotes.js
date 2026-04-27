export const countQuotes = (quotes) => {
  if (Array.isArray(quotes)) {
    return quotes.filter(Boolean).length;
  }

  if (typeof quotes === "string") {
    return quotes
      .split("\n")
      .map((quote) => quote.trim())
      .filter(Boolean).length;
  }

  return 0;
};
