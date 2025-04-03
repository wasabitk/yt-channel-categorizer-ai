
/**
 * Functions for extracting IDs and information from YouTube URLs
 */

/**
 * Extracts a channel ID or video ID from a YouTube URL
 */
export const extractChannelId = (url: string): string | null => {
  let id = null;
  
  // Check if this is a video URL (including Shorts)
  const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&\s?]+)/);
  
  if (videoIdMatch && videoIdMatch[1]) {
    // This is a video URL, we'll need to fetch the video details to get the channel ID
    console.log(`Detected video/short ID: ${videoIdMatch[1]}`);
    return videoIdMatch[1];
  }
  
  // Try to extract channel ID from channel URL
  const urlPatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([^\/\s?]+)/, // Standard channel ID format
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/([^\/\s?]+)/,       // Custom URL format
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/user\/([^\/\s?]+)/,    // Legacy username format
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([^\/\s?]+)/          // Handle format
  ];
  
  for (const pattern of urlPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      console.log(`Matched URL pattern: ${pattern}, extracted: ${match[1]}`);
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
        console.log(`Extracted handle: @${id}`);
      }
    } catch (error) {
      console.error("Error extracting handle:", error);
    }
  }
  
  // For /c/ or /user/ URLs, return the custom URL part directly
  if (!id && (url.includes('/c/') || url.includes('/user/'))) {
    const customUrlMatch = url.match(/(?:\/c\/|\/user\/)([^\/\s?]+)/);
    if (customUrlMatch && customUrlMatch[1]) {
      id = customUrlMatch[1];
      console.log(`Extracted custom URL part: ${id}`);
    }
  }
  
  return id;
};

