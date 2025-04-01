
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface QuotaExceededAlertProps {
  show: boolean;
}

const QuotaExceededAlert = ({ show }: QuotaExceededAlertProps) => {
  if (!show) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>YouTube API Quota Exceeded</AlertTitle>
      <AlertDescription>
        The YouTube API quota has been exceeded. This limit resets daily. Please try again tomorrow or use a different API key.
      </AlertDescription>
    </Alert>
  );
};

export default QuotaExceededAlert;
