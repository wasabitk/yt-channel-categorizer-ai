
import { Category, YoutubeChannel } from "@/types";
import { CATEGORIES, OPENAI_API_KEY } from "./constants";

export const categorizeChannel = async (channel: YoutubeChannel): Promise<Category> => {
  try {
    // If we don't have enough channel information due to API errors, 
    // we can't properly categorize it
    if (channel.status === 'error' || !channel.name) {
      console.warn("Cannot categorize channel due to insufficient data", channel);
      return "Other";
    }
    
    const categoryDescriptions = CATEGORIES.map(cat => 
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

Based only on these predefined categories, which ONE category best describes this channel? 
Respond with just the category name, exactly as written above.
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
    
    // Find the closest matching category from our defined list
    const validCategory = CATEGORIES.find(cat => cat.name === categoryText) 
      || CATEGORIES.find(cat => categoryText.includes(cat.name));
      
    return validCategory?.name || "Other";
  } catch (error) {
    console.error('Error categorizing channel:', error);
    return "Other";
  }
};
