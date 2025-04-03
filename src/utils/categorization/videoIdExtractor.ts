
/**
 * Extracts a YouTube video ID from a URL
 */
export const extractVideoId = (url?: string): string | null => {
  if (!url) {
    console.log("Cannot extract video ID: URL is undefined");
    return null;
  }
  
  console.log(`Attempting to extract video ID from URL: ${url}`);
  
  // Enhanced regex to extract video ID from different YouTube URL formats including Shorts
  const videoIdRegexes = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/,
    /(?:youtube\.com\/embed\/)([^&\s?]+)/,
    /(?:youtube\.com\/v\/)([^&\s?]+)/,
    /(?:youtube\.com\/shorts\/)([^&\s?]+)/  // Added support for Shorts URLs
  ];
  
  for (const regex of videoIdRegexes) {
    const match = url.match(regex);
    if (match && match[1]) {
      console.log(`Successfully extracted video ID: ${match[1]} from URL: ${url}`);
      return match[1];
    }
  }
  
  console.log(`Failed to extract video ID from URL: ${url}`);
  return null;
};

