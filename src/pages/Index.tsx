
import { parseCSV } from "@/utils/csvUtils";
import Header from "@/components/Header";
import InputSection from "@/components/InputSection";
import ResultsSection from "@/components/ResultsSection";
import ProcessInfo from "@/components/ProcessInfo";
import CategoriesInfo from "@/components/CategoriesInfo";
import QuotaExceededAlert from "@/components/QuotaExceededAlert";
import { useYoutubeProcessing } from "@/hooks/useYoutubeProcessing";
import { toast } from "sonner";

const Index = () => {
  const {
    channels,
    setChannels,
    isProcessing,
    quotaExceeded,
    processChannels,
    processSingleChannel
  } = useYoutubeProcessing();

  const handleFileUpload = async (file: File) => {
    try {
      const parsedChannels = await parseCSV(file);
      setChannels(parsedChannels);
      toast.success('CSV file uploaded successfully');
    } catch (error) {
      console.error("Error parsing CSV:", error);
      toast.error("Error parsing CSV file. Please check the format.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container flex-1 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <QuotaExceededAlert show={quotaExceeded} />
            
            <InputSection 
              channels={channels}
              isProcessing={isProcessing}
              onUrlSubmit={processSingleChannel}
              onFileUploaded={handleFileUpload}
              onProcessAll={() => processChannels()}
            />
            
            <ResultsSection channels={channels} />
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
