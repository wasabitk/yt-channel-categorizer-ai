
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Upload, FileType, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileUploadProps {
  onFileUploaded: (file: File) => void;
}

const FileUpload = ({ onFileUploaded }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Check file extension
    const fileName = file.name.toLowerCase();
    
    if (!fileName.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    // Additional validation for file size if needed
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File is too large. Please upload a file smaller than 10MB');
      return;
    }

    toast.info('Processing CSV file...');
    onFileUploaded(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const csvExample = `Channel Name,YouTube Channel URL
David Pakman Show,https://www.youtube.com/channel/UCvixJtaXuNdMPUGdOPcY8Ag
Philip DeFranco,https://www.youtube.com/c/PhilipDeFranco
MrBeast,https://www.youtube.com/@MrBeast`;

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging 
          ? 'border-primary bg-primary/5' 
          : isHovering 
            ? 'border-primary/50' 
            : 'border-muted-foreground/25'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <input
        type="file"
        accept=".csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileInput}
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <FileType className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Upload your CSV file</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop your file here, or click to browse
          </p>
        </div>
        <Button onClick={handleButtonClick} variant="outline">
          Browse Files
        </Button>
        <div className="text-xs text-muted-foreground space-y-2">
          <div className="flex items-center justify-center gap-1">
            <p>CSV must contain columns for channel URL and name</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                    <HelpCircle className="h-4 w-4" />
                    <span className="sr-only">CSV Format Help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-80 p-4">
                  <div className="space-y-2">
                    <p className="font-semibold">Example CSV Format:</p>
                    <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                      {csvExample}
                    </pre>
                    <p className="text-xs">Your CSV file should have headers and at least one column for YouTube channel URLs.</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p>Accepted column names: "Channel URL", "YouTube Channel URL", "URL", "Channel Name", "Name", etc.</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
