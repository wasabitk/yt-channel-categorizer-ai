
import { Category, YoutubeChannel, BrandName } from "@/types";
import { OPENAI_API_KEY, getCategoriesForBrand, getSelectedBrand } from "./constants";
import { getRecentVideos, extractChannelId } from "./youtube";

export const categorizeChannel = async (channel: YoutubeChannel): Promise<Category> => {
  try {
    // If we don't have enough channel information due to API errors, 
    // we can't properly categorize it
    if (channel.status === 'error' || !channel.name) {
      console.warn("Cannot categorize channel due to insufficient data", channel);
      return "Other";
    }
    
    // Get the brand for this channel (use the channel's brand or the currently selected brand)
    const brandName = channel.brandName || getSelectedBrand();
    
    // For specific channels we know are miscategorized, we can override the AI's decision
    const knownChannels: Record<string, Category> = {
      "Benaminute": "Politics / News (Left Wing)",
      "@itsbenaminute": "Politics / News (Left Wing)",
      "Wendigoon": "True Crime or Mystery",
      "@Wendigoon": "True Crime or Mystery",
      "Dark Skies": "Guns / Military",
      "@Dark_Skies": "Guns / Military",
      "@DarkSkiesChannel": "Guns / Military",
      "Military Aviation History": "Guns / Military",
      "@MilitaryAviationHistory": "Guns / Military",
      "Law By Mike": "Police Cam Footage",
      "@lawbymike": "Police Cam Footage",
      "Real World Police": "Police Cam Footage",
      "@realworldpolice": "Police Cam Footage"
      // Add more known channels here as needed
    };
    
    // Check if this is a known channel that should have a specific category
    if (channel.name && knownChannels[channel.name]) {
      // Only use the override if that category exists for the current brand
      const categories = getCategoriesForBrand(brandName);
      const override = knownChannels[channel.name];
      if (categories.some(cat => cat.name === override)) {
        console.log(`Using known category override for ${channel.name}: ${knownChannels[channel.name]}`);
        return knownChannels[channel.name];
      }
    }
    
    // Check for URL containing the specific Real World Police channel ID
    if (channel.url && channel.url.includes("UCazRf1jcMNZEL1MS5i_rWQQ")) {
      console.log("Detected Real World Police channel by ID, overriding category");
      return "Police Cam Footage";
    }
    
    // Also check for handle matches
    if (channel.url) {
      const handleMatch = channel.url.match(/@([^\/\s?]+)/);
      if (handleMatch && handleMatch[1]) {
        const handle = `@${handleMatch[1]}`;
        if (knownChannels[handle]) {
          // Only use the override if that category exists for the current brand
          const categories = getCategoriesForBrand(brandName);
          const override = knownChannels[handle];
          if (categories.some(cat => cat.name === override)) {
            console.log(`Using known category override for handle ${handle}: ${knownChannels[handle]}`);
            return knownChannels[handle];
          }
        }
      }
    }
    
    // Fetch recent video titles to include in the analysis
    let recentVideoTitles: string[] = [];
    
    try {
      if (channel.url) {
        // Extract channel ID from the URL
        const channelId = extractChannelId(channel.url);
        
        if (channelId) {
          console.log(`Fetching video titles for channel ID: ${channelId}`);
          const videos = await getRecentVideos(channelId, 10);
          recentVideoTitles = videos.map(video => video.snippet.title);
          console.log(`Found ${recentVideoTitles.length} video titles for analysis`);
        }
      }
    } catch (error) {
      console.warn("Failed to fetch recent videos, proceeding with basic info", error);
    }
    
    // Check if the video titles strongly indicate Police Cam Footage content
    const policeCamKeywords = [
      "bodycam", "body cam", "police cam", "officer", "arrest", "dashcam", 
      "dash cam", "police footage", "body camera", "police shooting", 
      "police video", "officer involved", "use of force"
    ];
    
    const matchingPoliceCamKeywords = recentVideoTitles.filter(title => 
      policeCamKeywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    // If a significant portion of videos match police cam keywords, override the category
    if (matchingPoliceCamKeywords.length >= 3 || 
        (recentVideoTitles.length > 0 && matchingPoliceCamKeywords.length / recentVideoTitles.length >= 0.4)) {
      console.log("Detected Police Cam Footage content based on video titles");
      return "Police Cam Footage";
    }
    
    // Get categories for the selected brand
    const brandCategories = getCategoriesForBrand(brandName);
    const categoryDescriptions = brandCategories.map(cat => 
      `${cat.name}: ${cat.description}`
    ).join('\n\n');
    
    const prompt = `
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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 50,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }
    
    const categoryText = data.choices[0]?.message?.content?.trim();
    console.log(`AI suggested category: ${categoryText}`);
    
    // Find the closest matching category from our defined list for this brand
    const validCategory = brandCategories.find(cat => cat.name === categoryText) 
      || brandCategories.find(cat => categoryText.includes(cat.name));
      
    // Tag the channel with the brand name for reference
    channel.brandName = brandName;
      
    return validCategory?.name || "Other";
  } catch (error) {
    console.error('Error categorizing channel:', error);
    return "Other";
  }
};
