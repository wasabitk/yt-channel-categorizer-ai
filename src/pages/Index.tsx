
import { useState } from "react";
import { Button } from "@/components/ui/button";
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

const Index = () => {
  const [channels, setChannels] = useState<YoutubeChannel[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

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

  const processChannels = async () => {
    if (channels.length === 0) {
      toast.error("Please upload a CSV file first");
      return;
    }

    if (isProcessing) {
      toast.error("Already processing channels");
      return;
    }

    setIsProcessing(true);
    setQuotaExceeded(false);

    // Process each channel sequentially to avoid rate limiting
    for (let i = 0; i < channels.length; i++) {
      try {
        // Update status to processing
        setChannels(prev => 
          prev.map((ch, idx) => 
            idx === i ? { ...ch, status: 'processing' } : ch
          )
        );
        
        // Fetch channel details from YouTube API
        const channelWithDetails = await getChannelDetails(channels[i]);
        
        if (channelWithDetails.status === 'error') {
          // Check if the error is due to quota exceeded
          if (channelWithDetails.error && channelWithDetails.error.includes("quota exceeded")) {
            setQuotaExceeded(true);
          }
          
          setChannels(prev => 
            prev.map((ch, idx) => 
              idx === i ? channelWithDetails : ch
            )
          );
          continue;
        }
        
        // Categorize the channel using OpenAI
        const category = await categorizeChannel(channelWithDetails);
        
        // Update the channel with the category and status
        setChannels(prev => 
          prev.map((ch, idx) => 
            idx === i ? { ...channelWithDetails, category, status: 'completed' } : ch
          )
        );
      } catch (error) {
        console.error(`Error processing channel ${channels[i].name}:`, error);
        
        // Check if the error is due to quota exceeded
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isQuotaError = errorMessage.includes("quota exceeded");
        
        if (isQuotaError) {
          setQuotaExceeded(true);
        }
        
        // Update the channel with error status
        setChannels(prev => 
          prev.map((ch, idx) => 
            idx === i ? { 
              ...ch, 
              status: 'error', 
              error: errorMessage
            } : ch
          )
        );
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
              <h2 className="text-xl font-semibold mb-4">Upload Channels</h2>
              <FileUpload onFileUploaded={handleFileUpload} />
            </section>
            
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Channel Categorization</h2>
                <Button 
                  onClick={processChannels} 
                  disabled={channels.length === 0 || isProcessing}
                >
                  {isProcessing ? "Processing..." : "Categorize Channels"}
                </Button>
              </div>
              
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
