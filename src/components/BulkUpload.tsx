
import { Button } from "@/components/ui/button";
import { YoutubeChannel } from "@/types";
import FileUpload from "@/components/FileUpload";

interface BulkUploadProps {
  channels: YoutubeChannel[];
  isProcessing: boolean;
  onFileUploaded: (file: File) => Promise<void>;
  onProcessAll: () => Promise<void>;
}

const BulkUpload = ({ 
  channels, 
  isProcessing, 
  onFileUploaded, 
  onProcessAll 
}: BulkUploadProps) => {
  return (
    <>
      <FileUpload onFileUploaded={onFileUploaded} />
      <div className="mt-4 flex justify-end">
        <Button 
          onClick={onProcessAll} 
          disabled={channels.length === 0 || isProcessing}
        >
          {isProcessing ? "Processing..." : "Categorize All Channels"}
        </Button>
      </div>
    </>
  );
};

export default BulkUpload;
