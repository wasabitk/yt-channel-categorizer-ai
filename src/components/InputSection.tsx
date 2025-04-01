
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YoutubeChannel } from "@/types";
import UrlInput from "./UrlInput";
import BulkUpload from "./BulkUpload";

interface InputSectionProps {
  channels: YoutubeChannel[];
  isProcessing: boolean;
  onUrlSubmit: (channel: YoutubeChannel) => Promise<void>;
  onFileUploaded: (file: File) => Promise<void>;
  onProcessAll: () => Promise<void>;
}

const InputSection = ({ 
  channels, 
  isProcessing, 
  onUrlSubmit, 
  onFileUploaded, 
  onProcessAll 
}: InputSectionProps) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Categorize YouTube Channels</h2>
      
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="url" className="flex-1">Single URL</TabsTrigger>
          <TabsTrigger value="csv" className="flex-1">Bulk Upload (CSV)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="url">
          <UrlInput 
            isProcessing={isProcessing} 
            onUrlSubmit={onUrlSubmit} 
          />
        </TabsContent>
        
        <TabsContent value="csv">
          <BulkUpload 
            channels={channels}
            isProcessing={isProcessing}
            onFileUploaded={onFileUploaded}
            onProcessAll={onProcessAll}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default InputSection;
