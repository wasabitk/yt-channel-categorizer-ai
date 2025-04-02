
import { Category } from "@/types";

/**
 * Detects if content likely belongs to the Police Cam Footage category
 * based on video titles matching relevant keywords
 */
export const detectPoliceCamFootage = (videoTitles: string[]): boolean => {
  if (videoTitles.length === 0) {
    return false;
  }
  
  const policeCamKeywords = [
    "bodycam", "body cam", "police cam", "officer", "arrest", "dashcam", 
    "dash cam", "police footage", "body camera", "police shooting", 
    "police video", "officer involved", "use of force"
  ];
  
  const matchingPoliceCamKeywords = videoTitles.filter(title => 
    policeCamKeywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))
  );
  
  // If a significant portion of videos match police cam keywords, identify as Police Cam Footage
  return matchingPoliceCamKeywords.length >= 3 || 
    (matchingPoliceCamKeywords.length / videoTitles.length >= 0.4);
};
