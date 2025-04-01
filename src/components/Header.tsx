
import { Badge } from "@/components/ui/badge";
import { YoutubeIcon } from "lucide-react";

const Header = () => {
  return (
    <header className="py-6 border-b mb-8">
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-youtube p-2 rounded">
              <YoutubeIcon className="h-6 w-6 text-youtube-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">YT Channel Tagger</h1>
              <p className="text-muted-foreground text-sm">Categorize YouTube channels using AI</p>
            </div>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <span className="text-xs">AI-Powered</span>
          </Badge>
        </div>
      </div>
    </header>
  );
};

export default Header;
