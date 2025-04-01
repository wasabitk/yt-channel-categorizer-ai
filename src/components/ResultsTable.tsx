
import { YoutubeChannel } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { downloadCSV, generateCSV } from "@/utils/csvUtils";
import { FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ResultsTableProps {
  channels: YoutubeChannel[];
}

const ResultsTable = ({ channels }: ResultsTableProps) => {
  const handleDownload = () => {
    const csvData = generateCSV(channels);
    downloadCSV(csvData);
  };

  const getStatusBadge = (status?: string, errorMessage?: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-muted">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
      case 'error':
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 cursor-help">
                Error
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{errorMessage || "An unknown error occurred"}</p>
            </TooltipContent>
          </Tooltip>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatSubscriberCount = (count?: string) => {
    if (!count) return "Unknown";
    const num = parseInt(count);
    if (isNaN(num)) return count;
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Results</h3>
        <Button 
          onClick={handleDownload} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          disabled={channels.length === 0}
        >
          <FileText className="h-4 w-4" />
          <span>Download CSV</span>
        </Button>
      </div>
      
      {channels.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Subscribers</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {channel.thumbnailUrl && (
                      <img 
                        src={channel.thumbnailUrl} 
                        alt={channel.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{channel.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs">
                        {channel.url}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatSubscriberCount(channel.subscriberCount)}</TableCell>
                  <TableCell>
                    {channel.category ? (
                      <Badge className="bg-tag">{channel.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not categorized</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(channel.status, channel.error)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No results to display</p>
          <p className="text-sm text-muted-foreground">Upload a CSV file to start categorizing channels</p>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
