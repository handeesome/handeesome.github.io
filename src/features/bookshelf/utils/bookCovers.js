const COVER_EXTENSIONS = ["jpg", "png", "webp"];

export const getBookCoverSrc = (bookOrId) => {
  const coverBase64 = typeof bookOrId === "object" ? bookOrId.coverBase64 : "";
  const id = typeof bookOrId === "object" ? bookOrId.id : bookOrId;

  return coverBase64 || `/images/bookCovers/${id}.jpg`;
};

const getCoverFallbacks = (id) =>
  COVER_EXTENSIONS.map((extension) => `/images/bookCovers/${id}.${extension}`);

export const handleBookCoverError = (event, bookOrId) => {
  const img = event.currentTarget;
  const id = typeof bookOrId === "object" ? bookOrId.id : bookOrId;
  const coverBase64 = typeof bookOrId === "object" ? bookOrId.coverBase64 : "";

  if (img.dataset.coverFallbackDone === "true") {
    return;
  }

  if (!id || coverBase64) {
    img.dataset.coverFallbackDone = "true";
    img.src = "/default-cover.jpg";
    return;
  }

  const tried = img.dataset.coverTried
    ? img.dataset.coverTried.split("|")
    : [];
  const currentPath = new URL(img.src, window.location.origin).pathname;
  const updatedTried = [...tried, currentPath];
  const nextCover = getCoverFallbacks(id).find(
    (coverPath) => !updatedTried.includes(coverPath),
  );

  img.dataset.coverTried = updatedTried.join("|");
  if (nextCover) {
    img.src = nextCover;
    return;
  }

  img.dataset.coverFallbackDone = "true";
  img.src = "/default-cover.jpg";
};
