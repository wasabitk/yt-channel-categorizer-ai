
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { YoutubeChannel } from "@/types";
import { parseCSV } from "@/utils/csvUtils";
import { getChannelDetails } from "@/utils/youtubeApi";
import { categorizeChannel } from "@/utils/openaiApi";
import FileUpload from "@/components/FileUpload";
import ResultsTable from "@/components/ResultsTable";
import Header from "@/components/Header";
import CategoriesInfo from "@/components/CategoriesInfo";
import ProcessInfo from "@/components/ProcessInfo";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [channels, setChannels] = useState<YoutubeChannel[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const handleFileUpload = async (file: File) => {
    try {
      const parsedChannels = await parseCSV(file);
      setChannels(parsedChannels);
      setQuotaExceeded(false); // Reset quota status on new upload
    } catch (error) {
      console.error("Error parsing CSV:", error);
      toast.error("Error parsing CSV file. Please check the format.");
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
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
    
    // Add the new channel to the list
    setChannels([newChannel]);
    
    // Process the channel
    await processChannels([newChannel]);
    
    // Clear the input
    setYoutubeUrl("");
  };

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
        // Update status to processing
        updatedChannels[i] = { ...updatedChannels[i], status: 'processing' };
        setChannels(updatedChannels.slice());
        
        // Fetch channel details from YouTube API
        const channelWithDetails = await getChannelDetails(updatedChannels[i]);
        
        if (channelWithDetails.status === 'error') {
          // Check if the error is due to quota exceeded
          if (channelWithDetails.error && channelWithDetails.error.includes("quota exceeded")) {
            setQuotaExceeded(true);
          }
          
          updatedChannels[i] = channelWithDetails;
          setChannels(updatedChannels.slice());
          continue;
        }
        
        // Categorize the channel using OpenAI
        const category = await categorizeChannel(channelWithDetails);
        
        // Update the channel with the category and status
        updatedChannels[i] = { ...channelWithDetails, category, status: 'completed' };
        setChannels(updatedChannels.slice());
      } catch (error) {
        console.error(`Error processing channel ${updatedChannels[i].name}:`, error);
        
        // Check if the error is due to quota exceeded
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isQuotaError = errorMessage.includes("quota exceeded");
        
        if (isQuotaError) {
          setQuotaExceeded(true);
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
    toast.success("Processing complete!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container flex-1 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {quotaExceeded && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>YouTube API Quota Exceeded</AlertTitle>
                <AlertDescription>
                  The YouTube API quota has been exceeded. This limit resets daily. Please try again tomorrow or use a different API key.
                </AlertDescription>
              </Alert>
            )}
            
            <section>
              <h2 className="text-xl font-semibold mb-4">Categorize YouTube Channels</h2>
              
              <Tabs defaultValue="url" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="url" className="flex-1">Single URL</TabsTrigger>
                  <TabsTrigger value="csv" className="flex-1">Bulk Upload (CSV)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="url">
                  <div className="space-y-4">
                    <form onSubmit={handleUrlSubmit} className="flex gap-2 items-end">
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
                </TabsContent>
                
                <TabsContent value="csv">
                  <FileUpload onFileUploaded={handleFileUpload} />
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={() => processChannels()} 
                      disabled={channels.length === 0 || isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Categorize All Channels"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              <ResultsTable channels={channels} />
            </section>
          </div>
          
          <div className="space-y-8">
            <ProcessInfo channels={channels} isProcessing={isProcessing} />
            <CategoriesInfo />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
