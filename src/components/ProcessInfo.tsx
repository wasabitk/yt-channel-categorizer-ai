
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { YoutubeChannel } from "@/types";

interface ProcessInfoProps {
  channels: YoutubeChannel[];
  isProcessing: boolean;
}

const ProcessInfo = ({ channels, isProcessing }: ProcessInfoProps) => {
  // Calculate counts
  const totalChannels = channels.length;
  const completedChannels = channels.filter(c => c.status === 'completed').length;
  const errorChannels = channels.filter(c => c.status === 'error').length;
  const pendingChannels = totalChannels - completedChannels - errorChannels;
  
  // Calculate progress percentage
  const progressPercentage = totalChannels === 0 
    ? 0 
    : Math.round((completedChannels / totalChannels) * 100);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Processing Status</CardTitle>
        <CardDescription>
          {isProcessing 
            ? "Analyzing and categorizing channels..." 
            : totalChannels === 0 
              ? "Upload a CSV to start processing" 
              : completedChannels === totalChannels 
                ? "All channels processed!" 
                : "Ready to process"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingChannels}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedChannels}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Errors</p>
              <p className="text-2xl font-bold text-red-600">{errorChannels}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessInfo;
