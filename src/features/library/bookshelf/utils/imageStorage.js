export const FIRESTORE_FIELD_VALUE_LIMIT_BYTES = 1048487;
export const COVER_IMAGE_TARGET_BYTES = 900000;

export const isFirestoreCoverTooLarge = (coverBase64) =>
  Boolean(coverBase64) &&
  String(coverBase64).length > FIRESTORE_FIELD_VALUE_LIMIT_BYTES;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const getResizedDimensions = (width, height, maxSide) => {
  const largestSide = Math.max(width, height);
  if (largestSide <= maxSide) {
    return { width, height };
  }

  const scale = maxSide / largestSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
};

const drawImageToCanvas = (image, width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return canvas;
};

export const compressCoverImageFile = async (
  file,
  {
    targetBytes = COVER_IMAGE_TARGET_BYTES,
    maxSide = 1200,
    minSide = 360,
  } = {}
) => {
  const originalDataUrl = await readFileAsDataUrl(file);

  if (originalDataUrl.length <= targetBytes) {
    return originalDataUrl;
  }

  const image = await loadImage(originalDataUrl);
  let { width, height } = getResizedDimensions(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    maxSide
  );

  let canvas = drawImageToCanvas(image, width, height);
  const qualities = [0.86, 0.78, 0.7, 0.62, 0.54, 0.46, 0.38, 0.3];

  for (const quality of qualities) {
    const compressed = canvas.toDataURL("image/jpeg", quality);
    if (compressed.length <= targetBytes) {
      return compressed;
    }
  }

  while (Math.max(width, height) > minSide) {
    const nextMaxSide = Math.max(
      minSide,
      Math.round(Math.max(width, height) * 0.82)
    );
    const nextSize = getResizedDimensions(width, height, nextMaxSide);
    width = nextSize.width;
    height = nextSize.height;
    canvas = drawImageToCanvas(image, width, height);

    for (const quality of [0.52, 0.42, 0.34, 0.28]) {
      const compressed = canvas.toDataURL("image/jpeg", quality);
      if (compressed.length <= targetBytes) {
        return compressed;
      }
    }
  }

  return canvas.toDataURL("image/jpeg", 0.24);
};
