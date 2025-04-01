
import { getYoutubeApiKey } from "../constants";

/**
 * Functions for interacting with YouTube's video API endpoints
 */

/**
 * Fetches details for a specific video ID
 */
export const getVideoDetails = async (videoId: string): Promise<{channelId: string, channelTitle: string} | null> => {
  try {
    console.log(`Fetching details for video ID: ${videoId}`);
    const apiKey = getYoutubeApiKey();
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || "YouTube API error");
    }
    
    if (!data.items || data.items.length === 0) {
      throw new Error("Video not found");
    }
    
    const videoData = data.items[0].snippet;
    return {
      channelId: videoData.channelId,
      channelTitle: videoData.channelTitle
    };
  } catch (error) {
    console.error("Error fetching video details:", error);
    return null;
  }
};
