
import { YoutubeChannel } from "@/types";
import { getYoutubeApiKey } from "../constants";
import { extractChannelId } from "./extractors";
import { getVideoDetails } from "./videoApi";

/**
 * Functions for interacting with YouTube's channel API endpoints
 */

/**
 * Fetches channel details based on the provided channel object
 */
export const getChannelDetails = async (channel: YoutubeChannel): Promise<YoutubeChannel> => {
  try {
    let channelId = null;
    let videoInfo = null;
    
    // Check if the URL is a video URL
    const videoIdMatch = channel.url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
    
    if (videoIdMatch && videoIdMatch[1]) {
      console.log(`Detected video URL, extracting channel from video ID: ${videoIdMatch[1]}`);
      videoInfo = await getVideoDetails(videoIdMatch[1]);
      
      if (videoInfo) {
        channelId = videoInfo.channelId;
        console.log(`Found channel ID from video: ${channelId}`);
      } else {
        throw new Error("Could not extract channel from video. The video might be private or removed.");
      }
    } else {
      // First get the channel ID or custom URL from the input
      channelId = extractChannelId(channel.url);
      console.log(`Extracted channel identifier: ${channelId}`);
    }
    
    // Check if we have a custom URL format (c/, user/, or @handle)
    const isCustomFormat = channelId && (
      !channelId.includes("UC") || 
      channelId.startsWith("@") || 
      channel.url.includes("/c/") || 
      channel.url.includes("/user/") ||
      channel.url.includes("@")
    );
    
    if (isCustomFormat) {
      try {
        // Get the search term - either the handle without @ or the channel name
        let searchTerm = channelId;
        
        // If it's a /c/ or /user/ format, use the part after the slash
        if (channel.url.includes("/c/") || channel.url.includes("/user/")) {
          const customUrlMatch = channel.url.match(/(?:\/c\/|\/user\/)([^\/\s?]+)/);
          if (customUrlMatch && customUrlMatch[1]) {
            searchTerm = customUrlMatch[1];
          }
        } else if (channelId?.startsWith("@")) {
          searchTerm = channelId.substring(1);
        }
          
        console.log(`Searching for channel with term: ${searchTerm}`);
        
        const apiKey = getYoutubeApiKey();
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchTerm as string)}&type=channel&key=${apiKey}`
        );
        const searchData = await searchResponse.json();
        
        if (searchData.error) {
          // Handle API errors specifically
          if (searchData.error.errors && searchData.error.errors.some(e => e.reason === 'quotaExceeded')) {
            throw new Error("YouTube API quota exceeded. Please try again tomorrow or use a different API key.");
          }
          throw new Error(searchData.error.message || "YouTube API error");
        }
        
        if (searchData.items && searchData.items.length > 0) {
          channelId = searchData.items[0].id.channelId;
          console.log(`Found channel ID from search: ${channelId}`);
        } else {
          throw new Error("Channel not found through search. Please try a different URL or channel name.");
        }
      } catch (error) {
        // Rethrow the error to be handled in the outer catch
        throw error;
      }
    }
    
    if (!channelId) {
      throw new Error("Could not determine channel ID from the provided URL. Please check the URL format.");
    }
    
    // Get channel details
    console.log(`Fetching details for channel ID: ${channelId}`);
    const apiKey = getYoutubeApiKey();
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    // Check for API errors
    if (data.error) {
      if (data.error.errors && data.error.errors.some(e => e.reason === 'quotaExceeded')) {
        throw new Error("YouTube API quota exceeded. Please try again tomorrow or use a different API key.");
      }
      throw new Error(data.error.message || "YouTube API error");
    }
    
    if (!data.items || data.items.length === 0) {
      throw new Error("Channel not found. The channel ID might be invalid or the channel might be private.");
    }
    
    const channelData = data.items[0];
    const channelUrl = `https://www.youtube.com/channel/${channelId}`;
    
    return {
      ...channel,
      // If this came from a video URL, update the URL to the channel URL
      url: videoIdMatch ? channelUrl : channel.url,
      originalUrl: videoIdMatch ? channel.url : undefined, // Store the original video URL
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
