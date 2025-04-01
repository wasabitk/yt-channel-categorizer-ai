
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onFileUploaded: (file: File) => void;
}

const FileUpload = ({ onFileUploaded }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
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
    if (file.type !== 'text/csv') {
      toast.error('Please upload a CSV file');
      return;
    }

    onFileUploaded(file);
    toast.success('CSV file uploaded successfully');
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      } transition-colors`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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
          <Upload className="h-8 w-8 text-primary" />
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
        <p className="text-xs text-muted-foreground">
          CSV must contain "Channel URL" and "Channel Name" columns
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
