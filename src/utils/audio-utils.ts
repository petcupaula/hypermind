
export const transformImageUrl = (url: string) => {
  if (!url) return url;
  return `${url}?width=300&height=300&resize=contain`;
};

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
