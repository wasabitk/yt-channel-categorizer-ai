
import { YoutubeChannel } from "@/types";
import { YOUTUBE_API_KEY } from "./constants";

export const extractChannelId = (channelUrl: string): string | null => {
  let id = null;
  
  // Try to extract channel ID from URL
  const urlPatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([^\/\s?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/([^\/\s?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/user\/([^\/\s?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([^\/\s?]+)/
  ];
  
  for (const pattern of urlPatterns) {
    const match = channelUrl.match(pattern);
    if (match && match[1]) {
      id = match[1];
      break;
    }
  }
  
  return id;
};

export const getChannelDetails = async (channel: YoutubeChannel): Promise<YoutubeChannel> => {
  try {
    // First get the channel ID if the input is a custom URL
    let channelId = extractChannelId(channel.url);
    
    // If we couldn't extract an ID, try to search for the channel by name
    if (!channelId && channel.name) {
      try {
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(channel.name)}&type=channel&key=${YOUTUBE_API_KEY}`
        );
        const searchData = await searchResponse.json();
        
        if (searchData.error) {
          // Handle API errors specifically
          if (searchData.error.errors && searchData.error.errors.some(e => e.reason === 'quotaExceeded')) {
            throw new Error("YouTube API quota exceeded. Please try again tomorrow.");
          }
          throw new Error(searchData.error.message || "YouTube API error");
        }
        
        if (searchData.items && searchData.items.length > 0) {
          channelId = searchData.items[0].id.channelId;
        } else {
          throw new Error("Channel not found");
        }
      } catch (error) {
        // Rethrow the error to be handled in the outer catch
        throw error;
      }
    }
    
    if (!channelId) {
      throw new Error("Could not determine channel ID");
    }
    
    // Get channel details
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );
    
    const data = await response.json();
    
    // Check for API errors
    if (data.error) {
      if (data.error.errors && data.error.errors.some(e => e.reason === 'quotaExceeded')) {
        throw new Error("YouTube API quota exceeded. Please try again tomorrow.");
      }
      throw new Error(data.error.message || "YouTube API error");
    }
    
    if (!data.items || data.items.length === 0) {
      throw new Error("Channel not found");
    }
    
    const channelData = data.items[0];
    
    return {
      ...channel,
      name: channelData.snippet.title,
      description: channelData.snippet.description,
      thumbnailUrl: channelData.snippet.thumbnails.default.url,
      subscriberCount: channelData.statistics.subscriberCount || "0",
      videoCount: channelData.statistics.videoCount || "0",
      viewCount: channelData.statistics.viewCount || "0"
    };
  } catch (error) {
    console.error("Error fetching channel details:", error);
    return {
      ...channel,
      status: 'error',
      error: error instanceof Error ? error.message : 'Failed to fetch channel details'
    };
  }
};

export const getRecentVideos = async (channelId: string, maxResults: number = 5): Promise<any[]> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${YOUTUBE_API_KEY}`
    );
    
    const data = await response.json();
    
    // Check for API errors
    if (data.error) {
      console.error("YouTube API error:", data.error);
      return [];
    }
    
    if (!data.items) {
      return [];
    }
    
    return data.items;
  } catch (error) {
    console.error("Error fetching recent videos:", error);
    return [];
  }
};
