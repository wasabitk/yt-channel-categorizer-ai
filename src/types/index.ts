
export type BrandName = "Aura" | "BetterHelp" | "Zocdoc";

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
  | "Police Cam Footage"
  | "Other"
  // BetterHelp categories
  | "Female Lifestyle"
  | "Male Lifestyle"
  | "Tarot / Spiritual"
  | "Doctor / Healthcare Professional"
  | "Fitness"
  | "ASMR"
  | "News/Politics"
  | "Movies / Film / Pop Culture"
  // We don't need to add new categories for Zocdoc as they're using existing ones
  ;

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
