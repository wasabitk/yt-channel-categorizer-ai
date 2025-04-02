export type BrandName = "Aura";

export interface Brand {
  name: BrandName;
  categories: CategoryDescription[];
}

export type Category = 
  | "Scambaiter"
  | "Internet Reacts / Internet Gossip"
  | "Politics / News (Left Wing)"
  | "Politics / News (Right Wing)"
  | "True Crime or Mystery"
  | "Guns / Military"
  | "Cars"
  | "Gaming"
  | "Fashion & Beauty"
  | "Tech Reviews"
  | "Travel"
  | "Other";

export interface CategoryDescription {
  name: Category;
  description: string;
}

export interface YoutubeChannel {
  url: string;
  originalUrl?: string; // To store the original video URL if applicable
  name: string;
  category?: Category;
  thumbnailUrl?: string;
  description?: string;
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
  status?: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  brandName?: BrandName; // Added to track which brand's categories were used
}

export interface AnalysisResult {
  channels: YoutubeChannel[];
}
