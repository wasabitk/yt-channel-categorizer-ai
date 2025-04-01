
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { 
  DEFAULT_YOUTUBE_API_KEY, 
  getYoutubeApiKey, 
  saveCustomYoutubeApiKey, 
  clearCustomYoutubeApiKey 
} from "@/utils/constants";

const ApiKeySettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isUsingCustomKey, setIsUsingCustomKey] = useState(false);

  useEffect(() => {
    const storedKey = getYoutubeApiKey();
    setIsUsingCustomKey(storedKey !== DEFAULT_YOUTUBE_API_KEY);
    
    // Only set the apiKey if it's a custom key
    if (storedKey !== DEFAULT_YOUTUBE_API_KEY) {
      setApiKey(storedKey);
    } else {
      setApiKey("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey && apiKey.trim() !== "") {
      saveCustomYoutubeApiKey(apiKey);
      toast.success("Custom YouTube API key saved");
    } else {
      clearCustomYoutubeApiKey();
      toast.success("Reverted to default YouTube API key");
    }
    setIsOpen(false);
  };

  const handleUseDefault = () => {
    setApiKey("");
    clearCustomYoutubeApiKey();
    toast.success("Reverted to default YouTube API key");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          <span>{isUsingCustomKey ? "Custom API Key" : "API Settings"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>YouTube API Settings</DialogTitle>
          <DialogDescription>
            Enter your YouTube API key to use your own quota instead of the shared one.
            If left blank, the system will use the default API key.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right col-span-1">
              API Key
            </Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your YouTube API key"
              className="col-span-3"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>You can get a YouTube API key from the <a href="https://console.cloud.google.com/apis/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a>.</p>
            <p className="mt-2">Current status: {isUsingCustomKey ? "Using custom API key" : "Using default API key"}</p>
          </div>
        </div>
        <DialogFooter>
          {isUsingCustomKey && (
            <Button variant="outline" onClick={handleUseDefault}>
              Use Default Key
            </Button>
          )}
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySettings;
