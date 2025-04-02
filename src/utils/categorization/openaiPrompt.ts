
import { YoutubeChannel, BrandName } from "@/types";
import { getCategoriesForBrand } from "../constants";

/**
 * Generates the prompt to be sent to OpenAI for categorizing a YouTube channel
 */
export const generateCategorizationPrompt = (
  channel: YoutubeChannel, 
  brandName: BrandName, 
  recentVideoTitles: string[]
): string => {
  // Get categories for the selected brand
  const brandCategories = getCategoriesForBrand(brandName);
  const categoryDescriptions = brandCategories.map(cat => 
    `${cat.name}: ${cat.description}`
  ).join('\n\n');
  
  return `
You are an expert at categorizing YouTube channels based on their content.

I will provide you with information about a YouTube channel, and you need to categorize it into one of the following categories:

${categoryDescriptions}

Here is the channel information:
Channel Name: ${channel.name}
Channel Description: ${channel.description || "Not available"}
Subscriber Count: ${channel.subscriberCount || "Unknown"}
Video Count: ${channel.videoCount || "Unknown"}
View Count: ${channel.viewCount || "Unknown"}
${recentVideoTitles.length > 0 ? `
Recent Video Titles:
${recentVideoTitles.map((title, index) => `${index + 1}. ${title}`).join('\n')}
` : ''}

Based only on these predefined categories, which ONE category best describes this channel? 
Respond with just the category name, exactly as written above.

Note that political commentary channels should be categorized as either "Politics / News (Left Wing)" or "Politics / News (Right Wing)" even if their description is short. Pay special attention to the video titles as they often reveal the true nature of the channel's content and political leaning better than the description.

If the channel discusses strange, dark, or mysterious topics, unsolved mysteries, true crime, conspiracy theories, or horror stories, it should be categorized as "True Crime or Mystery".

If the channel is focused on military topics, weapons, firearms, aviation history, combat footage, defense systems, armed forces, military history, military technology, or similar content, it should be categorized as "Guns / Military". This includes channels about aircraft, tanks, naval vessels, and other military equipment, even if they don't directly show people firing guns.

If the channel features police body camera footage, dash cam videos, police chase videos, arrest videos, or commentaries on police incidents captured on camera, it should be categorized as "Police Cam Footage".
`;
};
