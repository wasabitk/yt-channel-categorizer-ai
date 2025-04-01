
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { YoutubeChannel } from "@/types";
import { toast } from "sonner";

interface UrlInputProps {
  isProcessing: boolean;
  onUrlSubmit: (channel: YoutubeChannel) => Promise<void>;
}

const UrlInput = ({ isProcessing, onUrlSubmit }: UrlInputProps) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // Check if the URL is a video URL or a channel URL
  const isVideoUrl = (url: string): boolean => {
    return url.includes("youtube.com/watch") || url.includes("youtu.be/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!youtubeUrl) {
      toast.error("Please enter a YouTube URL");
      return;
    }
    
    // Create a channel object from the URL
    const newChannel: YoutubeChannel = {
      url: youtubeUrl,
      name: "Retrieving...",
      status: 'pending'
    };
    
    // Show a toast if this is a video URL
    if (isVideoUrl(youtubeUrl)) {
      toast.info("Detected a video URL. Extracting channel information...");
    }
    
    // Process the channel
    await onUrlSubmit(newChannel);
    
    // Clear the input
    setYoutubeUrl("");
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
            placeholder="https://www.youtube.com/@channelname or https://youtu.be/videoId"
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
      <p className="text-xs text-muted-foreground">
        Enter a YouTube channel URL or video URL to analyze and categorize the channel
      </p>
    </div>
  );
};

export default UrlInput;
