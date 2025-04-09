
import { Category, YoutubeChannel, BrandName } from "@/types";
import { getCategoriesForBrand, getSelectedBrand } from "../constants";
import { getRecentVideos } from "../youtube";
import { knownChannels, knownChannelIds, knownVideoIds } from "./knownChannels";
import { detectPoliceCamFootage } from "./keywordDetection";
import { extractVideoId } from "./videoIdExtractor";
import { generateCategorizationPrompt } from "./openaiPrompt";
import { sendToOpenAI } from "./openaiApiClient";

/**
 * Main function to categorize a YouTube channel
 */
export const categorizeChannel = async (channel: YoutubeChannel): Promise<Category> => {
  try {
    // If we don't have enough channel information due to API errors, 
    // we can't properly categorize it
    if (channel.status === 'error' || !channel.name) {
      console.warn("Cannot categorize channel due to insufficient data", channel);
      return "Other";
    }
    
    // Get the brand for this channel (use the channel's brand or the currently selected brand)
    const brandName = channel.brandName || getSelectedBrand();
    
    console.log(`Categorizing channel: ${channel.name || 'Unknown'}, URL: ${channel.url}`);
    console.log(`Using brand: ${brandName}`);
    
    // FIRST STEP: Check if this is a video URL and extract the video ID
    const videoId = extractVideoId(channel.url);
    console.log(`Extracted video ID: ${videoId || 'None'}`);
    
    // Log the known video IDs for debugging
    console.log("Known video IDs:", JSON.stringify(knownVideoIds));
    
    // If we have a video ID and it's in our known video IDs, use that category
    if (videoId && knownVideoIds[videoId]) {
      const category = knownVideoIds[videoId];
      console.log(`Matched known video ID ${videoId} to category ${category}`);
      channel.brandName = brandName;
      return category;
    }
    
    // Check if the URL directly contains any of our known video IDs (backup method)
    if (channel.url) {
      for (const [knownId, category] of Object.entries(knownVideoIds)) {
        if (channel.url.includes(knownId)) {
          console.log(`URL contains known video ID ${knownId}, using category ${category}`);
          channel.brandName = brandName;
          return category;
        }
      }
    }
    
    // Check if this is a known channel that should have a specific category
    if (channel.name && knownChannels[channel.name]) {
      // Only use the override if that category exists for the current brand
      const categories = getCategoriesForBrand(brandName);
      const override = knownChannels[channel.name];
      if (categories.some(cat => cat.name === override)) {
        console.log(`Using known category override for ${channel.name}: ${knownChannels[channel.name]}`);
        channel.brandName = brandName;
        return knownChannels[channel.name];
      }
    }
    
    // Check if the URL contains any of our known channel IDs
    for (const [channelId, category] of Object.entries(knownChannelIds)) {
      if (channel.url && channel.url.includes(channelId)) {
        console.log(`Detected known channel by ID (${channelId}), overriding category to ${category}`);
        channel.brandName = brandName;
        return category;
      }
    }
    
    // Also check for handle matches
    if (channel.url) {
      const handleMatch = channel.url.match(/@([^\/\s?]+)/);
      if (handleMatch && handleMatch[1]) {
        const handle = `@${handleMatch[1]}`;
        if (knownChannels[handle]) {
          // Only use the override if that category exists for the current brand
          const categories = getCategoriesForBrand(brandName);
          const override = knownChannels[handle];
          if (categories.some(cat => cat.name === override)) {
            console.log(`Using known category override for handle ${handle}: ${knownChannels[handle]}`);
            channel.brandName = brandName;
            return knownChannels[handle];
          }
        }
      }
    }
    
    // Fetch recent video titles to include in the analysis
    let recentVideoTitles: string[] = [];
    
    try {
      if (channel.url) {
        // Extract channel ID from the URL
        const channelId = channel.url.includes("UC") ? 
          channel.url.match(/UC[a-zA-Z0-9_-]{22}/)?.at(0) : null;
        
        if (channelId) {
          console.log(`Fetching video titles for channel ID: ${channelId}`);
          const videos = await getRecentVideos(channelId, 10);
          recentVideoTitles = videos.map(video => video.snippet.title);
          console.log(`Found ${recentVideoTitles.length} video titles for analysis`);
        }
      }
    } catch (error) {
      console.warn("Failed to fetch recent videos, proceeding with basic info", error);
    }
    
    // Check if the video titles strongly indicate Police Cam Footage content
    if (detectPoliceCamFootage(recentVideoTitles)) {
      console.log("Detected Police Cam Footage content based on video titles");
      channel.brandName = brandName;
      return "Police Cam Footage";
    }
    
    // Generate and send prompt to OpenAI
    const prompt = generateCategorizationPrompt(channel, brandName, recentVideoTitles);
    const categoryText = await sendToOpenAI(prompt);
    console.log(`AI suggested category: ${categoryText}`);
    
    // Find the closest matching category from our defined list for this brand
    const brandCategories = getCategoriesForBrand(brandName);
    const validCategory = brandCategories.find(cat => cat.name === categoryText) 
      || brandCategories.find(cat => categoryText.includes(cat.name));
      
    // Tag the channel with the brand name for reference
    channel.brandName = brandName;
      
    return validCategory?.name || "Other";
  } catch (error) {
    console.error('Error categorizing channel:', error);
    return "Other";
  }
};
