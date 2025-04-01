
import { useState } from "react";
import { YoutubeChannel } from "@/types";
import ResultsTable from "@/components/ResultsTable";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getRecentVideos } from "@/utils/youtubeApi";

interface ResultsSectionProps {
  channels: YoutubeChannel[];
}

const ResultsSection = ({ channels }: ResultsSectionProps) => {
  const [selectedVideos, setSelectedVideos] = useState<any[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedChannelName, setSelectedChannelName] = useState("");

  const handleViewVideos = async (channel: YoutubeChannel) => {
    if (!channel.url) return;
    
    setIsLoadingVideos(true);
    setSelectedChannelName(channel.name);
    setVideoDialogOpen(true);
    
    try {
      // Extract channel ID from the URL
      const channelIdMatch = channel.url.match(/(?:channel|c)\/([^\/\s?]+)/);
      const handleMatch = channel.url.match(/@([^\/\s?]+)/);
      
      let channelId = null;
      
      if (channelIdMatch && channelIdMatch[1]) {
        channelId = channelIdMatch[1];
      } else if (handleMatch && handleMatch[1]) {
        // For handles, we'd need to search first but that's already in the youtubeApi.ts
        // This is simplified for now
        channelId = handleMatch[1];
      }
      
      if (channelId) {
        const videos = await getRecentVideos(channelId, 5);
        setSelectedVideos(videos);
      } else {
        setSelectedVideos([]);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setSelectedVideos([]);
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
              No videos found for this channel.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ResultsSection;
