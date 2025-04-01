
import { useState } from "react";
import { YoutubeChannel } from "@/types";
import ResultsTable from "@/components/ResultsTable";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getRecentVideos, extractChannelId } from "@/utils/youtubeApi";

interface ResultsSectionProps {
  channels: YoutubeChannel[];
}

const ResultsSection = ({ channels }: ResultsSectionProps) => {
  const [selectedVideos, setSelectedVideos] = useState<any[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedChannelName, setSelectedChannelName] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleViewVideos = async (channel: YoutubeChannel) => {
    if (!channel.url) return;
    
    setIsLoadingVideos(true);
    setSelectedChannelName(channel.name);
    setVideoDialogOpen(true);
    setFetchError(null);
    setSelectedVideos([]);
    
    try {
      // Use the existing extractChannelId utility from youtubeApi.ts
      const channelId = extractChannelId(channel.url);
      
      if (channelId) {
        console.log(`Fetching videos for channel ID: ${channelId}`);
        const videos = await getRecentVideos(channelId, 5);
        setSelectedVideos(videos);
        
        if (videos.length === 0) {
          setFetchError("No videos found for this channel. The channel might not have public videos or there could be an issue with the YouTube API.");
        }
      } else {
        setFetchError("Could not determine channel ID from the provided URL.");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setFetchError(error instanceof Error ? error.message : "Failed to fetch videos");
    } finally {
      setIsLoadingVideos(false);
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Results</h2>
      <ResultsTable 
        channels={channels} 
        onViewVideos={handleViewVideos}
      />
      
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Recent Videos from {selectedChannelName}</DialogTitle>
            <DialogDescription>
              Showing up to 5 most recent videos from this channel
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingVideos ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : selectedVideos.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
              {selectedVideos.map((video, index) => (
                <div key={index} className="border rounded-md p-3 hover:bg-muted/50">
                  <h3 className="font-medium">{video.snippet.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(video.snippet.publishedAt).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    <a 
                      href={`https://www.youtube.com/watch?v=${video.id.videoId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary text-sm hover:underline"
                    >
                      Watch Video
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-muted-foreground">
              {fetchError ? (
                <div className="space-y-2">
                  <p>{fetchError}</p>
                  <p className="text-sm">Try again later or check if the channel URL is correct.</p>
                </div>
              ) : (
                "No videos found for this channel."
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ResultsSection;
