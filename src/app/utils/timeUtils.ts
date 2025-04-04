export const timeToString = (ms: number) => {
  const minutes = Math.floor(ms / 1000 / 60);
  const seconds = Math.floor(ms / 1000 - minutes * 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};
