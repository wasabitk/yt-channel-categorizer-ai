
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
            YouTube Channel URL
          </label>
          <Input
            id="youtube-url"
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/@channelname"
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
        Enter a YouTube channel URL to analyze and categorize it
      </p>
    </div>
  );
};

export default UrlInput;
