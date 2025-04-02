
import { useState } from "react";
import { parseCSV } from "@/utils/csvUtils";
import Header from "@/components/Header";
import InputSection from "@/components/InputSection";
import ResultsSection from "@/components/ResultsSection";
import ProcessInfo from "@/components/ProcessInfo";
import CategoriesInfo from "@/components/CategoriesInfo";
import QuotaExceededAlert from "@/components/QuotaExceededAlert";
import ApiKeySettings from "@/components/ApiKeySettings";
import BrandSelector from "@/components/BrandSelector";
import { useYoutubeProcessing } from "@/hooks/useYoutubeProcessing";
import { toast } from "sonner";
import { BrandName } from "@/types";
import { getSelectedBrand } from "@/utils/constants";

const Index = () => {
  const {
    channels,
    setChannels,
    isProcessing,
    quotaExceeded,
    processChannels,
    processSingleChannel
  } = useYoutubeProcessing();
  
  const [currentBrand, setCurrentBrand] = useState<BrandName>(getSelectedBrand());

  const handleFileUpload = async (file: File) => {
    try {
      const parsedChannels = await parseCSV(file);
      // Set the brand for all uploaded channels
      const channelsWithBrand = parsedChannels.map(channel => ({
        ...channel,
        brandName: currentBrand
      }));
      setChannels(channelsWithBrand);
      toast.success('CSV file uploaded successfully');
    } catch (error) {
      console.error("Error parsing CSV:", error);
      toast.error("Error parsing CSV file. Please check the format.");
    }
  };
  
  const handleBrandChange = (brandName: BrandName) => {
    setCurrentBrand(brandName);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container flex-1 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-center">
              <QuotaExceededAlert show={quotaExceeded} />
              <ApiKeySettings />
            </div>
            
            <InputSection 
              channels={channels}
              isProcessing={isProcessing}
              onUrlSubmit={(channel) => processSingleChannel({...channel, brandName: currentBrand})}
              onFileUploaded={handleFileUpload}
              onProcessAll={() => processChannels()}
            />
            
            <ResultsSection channels={channels} />
          </div>
          
          <div className="space-y-8">
            <BrandSelector onBrandChange={handleBrandChange} />
            <ProcessInfo channels={channels} isProcessing={isProcessing} />
            <CategoriesInfo brandName={currentBrand} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
