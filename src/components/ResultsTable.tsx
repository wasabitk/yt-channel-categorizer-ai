
import React, { useState } from "react";
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
import { ChevronDown, ChevronRight, FileText, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ResultsTableProps {
  channels: YoutubeChannel[];
}

const ResultsTable = ({ channels }: ResultsTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRow = (index: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleDownload = () => {
    const csvData = generateCSV(channels);
    downloadCSV(csvData);
  };

  const getStatusBadge = (status?: string, errorMessage?: string, index?: number) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-muted">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
      case 'error':
        return (
          <div 
            onClick={(e) => { e.stopPropagation(); if (index !== undefined) toggleRow(index); }}
            className="cursor-pointer"
          >
            <Badge 
              variant="outline" 
              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 flex items-center gap-1"
            >
              Error {expandedRows[index as number] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Badge>
          </div>
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
                <React.Fragment key={index}>
                  <TableRow className={expandedRows[index] ? 'border-b-0' : ''}>
                    <TableCell>
                      <Avatar>
                        {channel.thumbnailUrl ? (
                          <AvatarImage 
                            src={channel.thumbnailUrl} 
                            alt={channel.name} 
                          />
                        ) : null}
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
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
                    <TableCell>{getStatusBadge(channel.status, channel.error, index)}</TableCell>
                  </TableRow>
                  
                  {channel.status === 'error' && expandedRows[index] && (
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={5} className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Error Details:</h4>
                          <div className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-950/30 rounded-md">
                            {channel.error || "An unknown error occurred while processing this channel."}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Try again later or check if the channel URL is correct and accessible.
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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
