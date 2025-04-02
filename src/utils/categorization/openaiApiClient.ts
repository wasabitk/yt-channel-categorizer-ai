
import { OPENAI_API_KEY } from "../constants";

/**
 * Sends a prompt to the OpenAI API and returns the response
 */
export const sendToOpenAI = async (prompt: string): Promise<string> => {
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
  
  return data.choices[0]?.message?.content?.trim() || "";
};
