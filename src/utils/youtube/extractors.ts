
/**
 * Functions for extracting IDs and information from YouTube URLs
 */

/**
 * Extracts a channel ID or video ID from a YouTube URL
 */
export const extractChannelId = (url: string): string | null => {
  let id = null;
  
  // Check if this is a video URL
  const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
  
  if (videoIdMatch && videoIdMatch[1]) {
    // This is a video URL, we'll need to fetch the video details to get the channel ID
    return videoIdMatch[1];
  }
  
  // Try to extract channel ID from channel URL
  const urlPatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([^\/\s?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/([^\/\s?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/user\/([^\/\s?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([^\/\s?]+)/
  ];
  
  for (const pattern of urlPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      id = match[1];
      break;
    }
  }
  
  // If we couldn't extract using patterns, check if the URL contains a handle
  if (!id && url.includes('@')) {
    try {
      // Extract the handle part (like @channelname)
      const handleMatch = url.match(/@([^\/\s?]+)/);
      if (handleMatch && handleMatch[1]) {
        id = handleMatch[1];
      }
    } catch (error) {
      console.error("Error extracting handle:", error);
    }
  }
  
  return id;
};
