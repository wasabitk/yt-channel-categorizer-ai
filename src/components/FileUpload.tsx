
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Upload, FileType } from "lucide-react";
import { toast } from "sonner";

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
          <p>CSV must contain columns for channel URL and name</p>
          <p>Accepted column names: "Channel URL", "URL", "Channel Name", "Name", etc.</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
