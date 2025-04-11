
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { YoutubeChannel } from "@/types";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface UrlInputProps {
  isProcessing: boolean;
  onUrlSubmit: (channel: YoutubeChannel) => Promise<void>;
}

const UrlInput = ({ isProcessing, onUrlSubmit }: UrlInputProps) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [lastError, setLastError] = useState<string | null>(null);

  // Check if the URL is a video URL or a channel URL
  const isVideoUrl = (url: string): boolean => {
    return url.includes("youtube.com/watch") || 
           url.includes("youtu.be/") || 
           url.includes("youtube.com/shorts/");
  };

  // Validate a YouTube URL for basic format
  const isValidYouTubeUrl = (url: string): boolean => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!youtubeUrl) {
      toast.error("Please enter a YouTube URL");
      return;
    }
    
    if (!isValidYouTubeUrl(youtubeUrl)) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }
    
    // Reset any previous errors
    setLastError(null);
    
    // Create a channel object from the URL
    const newChannel: YoutubeChannel = {
      url: youtubeUrl,
      name: "Retrieving...",
      status: 'pending'
    };
    
    // Show a toast based on URL type
    if (isVideoUrl(youtubeUrl)) {
      if (youtubeUrl.includes("shorts")) {
        toast.info("Detected a YouTube Short. Extracting channel information...");
      } else {
        toast.info("Detected a video URL. Extracting channel information...");
      }
    } else if (youtubeUrl.includes('/c/') || youtubeUrl.includes('/user/')) {
      if (youtubeUrl.includes('/videos') || youtubeUrl.includes('/featured') || youtubeUrl.includes('/community')) {
        toast.info("Processing custom channel URL with page suffix. This may require additional processing...");
      } else {
        toast.info("Processing custom channel URL...");
      }
    } else if (youtubeUrl.includes('@')) {
      toast.info("Processing channel handle...");
    }
    
    try {
      // Process the channel
      await onUrlSubmit(newChannel);
      
      // Clear the input
      setYoutubeUrl("");
    } catch (error) {
      // Capture the error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLastError(errorMessage);
      console.error("Error processing URL:", error);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex-1">
          <label htmlFor="youtube-url" className="block text-sm font-medium mb-1">
            YouTube Channel or Video URL
          </label>
          <Input
            id="youtube-url"
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/@channelname or https://youtu.be/videoId or https://youtube.com/shorts/..."
            className="w-full"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isProcessing || !youtubeUrl}
        >
          {isProcessing ? "Processing..." : "Categorize"}
        </Button>
      </form>
      
      {lastError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Processing URL</AlertTitle>
          <AlertDescription>
            {lastError.includes("Channel not found") 
              ? "The channel could not be found. Please check the URL and try again. For custom URLs (like /c/ or /user/), try removing any page suffixes (like /videos, /community) or use the @handle format if available."
              : lastError}
          </AlertDescription>
        </Alert>
      )}
      
      <p className="text-xs text-muted-foreground">
        Enter a YouTube channel URL (youtube.com/channel/ID, youtube.com/c/name, youtube.com/@handle), video URL, or Shorts URL to analyze and categorize the channel. For best results with custom URLs (/c/name), try removing page suffixes (/videos, /featured, etc).
      </p>
    </div>
  );
};

export default UrlInput;
