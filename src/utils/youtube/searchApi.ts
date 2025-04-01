
import { getYoutubeApiKey } from "../constants";

/**
 * Functions for interacting with YouTube's search API endpoints
 */

/**
 * Fetches recent videos for a specific channel
 */
export const getRecentVideos = async (channelId: string, maxResults: number = 5): Promise<any[]> => {
  try {
    console.log(`Getting recent videos for channel: ${channelId}`);
    
    // First check if the channelId is a handle or username
    // If so, we need to get the actual channel ID first
    let actualChannelId = channelId;
    
    if (!channelId.startsWith("UC")) {
      // This may be a handle, username, or custom URL - search for the channel
      const apiKey = getYoutubeApiKey();
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelId}&type=channel&key=${apiKey}`
      );
      
      const searchData = await searchResponse.json();
      
      if (searchData.error) {
        console.error("YouTube search API error:", searchData.error);
        throw new Error(searchData.error.message || "YouTube API error");
      }
      
      if (searchData.items && searchData.items.length > 0) {
        actualChannelId = searchData.items[0].id.channelId;
        console.log(`Converted ${channelId} to actual channel ID: ${actualChannelId}`);
      } else {
        throw new Error("Could not find channel ID");
      }
    }
    
    // Now get the videos using the actual channel ID
    const apiKey = getYoutubeApiKey();
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${actualChannelId}&maxResults=${maxResults}&order=date&type=video&key=${apiKey}`
    );
    
    const data = await response.json();
    
    // Check for API errors
    if (data.error) {
      console.error("YouTube API error:", data.error);
      throw new Error(data.error.message || "YouTube API error");
    }
    
    if (!data.items) {
      return [];
    }
    
    return data.items;
  } catch (error) {
    console.error("Error fetching recent videos:", error);
    throw error; // Re-throw to allow the calling component to handle it
  }
};
