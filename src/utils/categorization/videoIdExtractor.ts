
/**
 * Extracts a YouTube video ID from a URL
 */
export const extractVideoId = (url?: string): string | null => {
  if (!url) {
    return null;
  }
  
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
  if (videoIdMatch && videoIdMatch[1]) {
    return videoIdMatch[1];
  }
  
  return null;
};
