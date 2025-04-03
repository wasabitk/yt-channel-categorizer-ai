
import { useState } from "react";
import { YoutubeChannel } from "@/types";
import { getChannelDetails } from "@/utils/youtube";
import { categorizeChannel } from "@/utils/openaiApi";
import { toast } from "sonner";
import { extractVideoId } from "@/utils/categorization/videoIdExtractor";
import { getVideoDetails } from "@/utils/youtube/videoApi";

export const useYoutubeProcessing = () => {
  const [channels, setChannels] = useState<YoutubeChannel[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const processChannels = async (channelsToProcess = channels) => {
    if (channelsToProcess.length === 0) {
      toast.error("No channels to process");
      return;
    }

    if (isProcessing) {
      toast.error("Already processing channels");
      return;
    }

    setIsProcessing(true);
    setQuotaExceeded(false);

    // Create a new array for immutable updates
    const updatedChannels = [...channelsToProcess];

    // Process each channel sequentially to avoid rate limiting
    for (let i = 0; i < updatedChannels.length; i++) {
      try {
        // Store original URL for debugging and reference
        const originalUrl = updatedChannels[i].url;
        
        // Pre-process YouTube Shorts URLs to get video details first
        if (originalUrl.includes("youtube.com/shorts/")) {
          const videoId = extractVideoId(originalUrl);
          if (videoId) {
            toast.info("Processing YouTube Short. Getting video details...");
            console.log(`Processing Shorts URL with video ID: ${videoId}`);
            
            const videoDetails = await getVideoDetails(videoId);
            if (!videoDetails) {
              throw new Error("Could not extract channel details from this YouTube Short");
            }
            
            // Update the URL to the channel URL for processing
            console.log(`Found channel ID ${videoDetails.channelId} from Shorts video`);
            updatedChannels[i].url = `https://www.youtube.com/channel/${videoDetails.channelId}`;
            updatedChannels[i].name = videoDetails.channelTitle || "Retrieved from Shorts";
            updatedChannels[i].originalUrl = originalUrl; // Save original shorts URL
            
            toast.success(`Found channel: ${videoDetails.channelTitle}`);
          }
        }
        
        // Check if it's a standard video URL
        const isVideoUrl = originalUrl.includes("youtube.com/watch") || 
                         originalUrl.includes("youtu.be/");
        
        // Update status to processing
        updatedChannels[i] = { ...updatedChannels[i], status: 'processing', originalUrl };
        setChannels(updatedChannels.slice());
        
        // Fetch channel details from YouTube API
        const channelWithDetails = await getChannelDetails(updatedChannels[i]);
        
        // Preserve the original URL after getting channel details
        channelWithDetails.originalUrl = originalUrl;
        
        if (channelWithDetails.status === 'error') {
          // Check if the error is due to quota exceeded
          if (channelWithDetails.error && channelWithDetails.error.includes("quota exceeded")) {
            setQuotaExceeded(true);
            toast.error("YouTube API quota exceeded. Please try again tomorrow or use a different API key.");
          } else if (channelWithDetails.error && channelWithDetails.error.includes("Channel not found")) {
            toast.error("Channel not found. Please check the URL and try again.");
          } else {
            toast.error(channelWithDetails.error || "Failed to process channel");
          }
          
          updatedChannels[i] = channelWithDetails;
          setChannels(updatedChannels.slice());
          continue;
        }
        
        // If this was a video URL, show a message
        if ((isVideoUrl || originalUrl.includes("shorts")) && !channelWithDetails.error) {
          toast.success(`Successfully extracted channel from video: ${channelWithDetails.name}`);
        }
        
        // When categorizing, use the original URL for video ID extraction
        // This ensures video IDs are properly detected
        if (isVideoUrl || originalUrl.includes("shorts")) {
          channelWithDetails.url = originalUrl;
          console.log(`Using original video URL for categorization: ${originalUrl}`);
        }
        
        // Categorize the channel using OpenAI
        const category = await categorizeChannel(channelWithDetails);
        
        // Update the channel with the category and status
        updatedChannels[i] = { ...channelWithDetails, category, status: 'completed', originalUrl };
        setChannels(updatedChannels.slice());
      } catch (error) {
        console.error(`Error processing channel ${updatedChannels[i].name}:`, error);
        
        // Check if the error is due to quota exceeded
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isQuotaError = errorMessage.includes("quota exceeded");
        
        if (isQuotaError) {
          setQuotaExceeded(true);
          toast.error("YouTube API quota exceeded. Please try again tomorrow or use a different API key.");
        } else {
          toast.error(errorMessage);
        }
        
        // Update the channel with error status
        updatedChannels[i] = { 
          ...updatedChannels[i], 
          status: 'error', 
          error: errorMessage
        };
        setChannels(updatedChannels.slice());
      }
    }

    setIsProcessing(false);
    
    // Only show success toast if there were actually completed channels
    if (updatedChannels.some(channel => channel.status === 'completed')) {
      toast.success("Processing complete!");
    }
  };

  const processSingleChannel = async (channel: YoutubeChannel) => {
    setChannels([channel]);
    await processChannels([channel]);
  };

  return {
    channels,
    setChannels,
    isProcessing,
    quotaExceeded,
    processChannels,
    processSingleChannel
  };
};
