
export type Category = 
  | "Scambaiter"
  | "Internet Reacts / Internet Gossip"
  | "Politics / News (Left Wing)"
  | "Politics / News (Right Wing)"
  | "True Crime or Mystery"
  | "Guns / Military"
  | "Cars"
  | "Other";

export interface CategoryDescription {
  name: Category;
  description: string;
}

export interface YoutubeChannel {
  url: string;
  name: string;
  category?: Category;
  thumbnailUrl?: string;
  description?: string;
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
  status?: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface AnalysisResult {
  channels: YoutubeChannel[];
}
