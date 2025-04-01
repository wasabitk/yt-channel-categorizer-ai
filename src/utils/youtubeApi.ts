import { YoutubeChannel } from "@/types";
import { getYoutubeApiKey } from "./constants";

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
        throw new Error("Could not extract channel from video");
      }
    } else {
      // First get the channel ID if the input is a custom URL
      channelId = extractChannelId(channel.url);
    }
    
    // If we have a handle (starting with @), we need to use search to find the actual channelId
    const isHandle = channelId && !channelId.includes("UC") && (channelId.startsWith("@") || channel.url.includes("@"));
    
    if (isHandle || (!channelId && channel.name)) {
      try {
        // Get the search term - either the handle without @ or the channel name
        const searchTerm = isHandle ? 
          (channelId?.startsWith("@") ? channelId.substring(1) : channelId) : 
          channel.name;
          
        console.log(`Searching for channel with term: ${searchTerm}`);
        
        const apiKey = getYoutubeApiKey();
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchTerm as string)}&type=channel&key=${apiKey}`
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
          console.log(`Found channel ID from search: ${channelId}`);
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
    console.log(`Fetching details for channel ID: ${channelId}`);
    const apiKey = getYoutubeApiKey();
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
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
