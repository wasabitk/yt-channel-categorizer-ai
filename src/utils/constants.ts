
import { Brand, CategoryDescription, BrandName } from "@/types";

// Aura brand categories (original categories)
const AURA_CATEGORIES: CategoryDescription[] = [
  {
    name: "Scambaiter",
    description: "In this content category, YouTube creators entertain their audiences by calling professional scam call centers and waste their time or delete their files."
  },
  {
    name: "Internet Reacts / Internet Gossip",
    description: "In this content category, YouTube creators will watch the actions of celebrities, tv shows, movies, internet gossip, or other creators and then share their reaction."
  },
  {
    name: "Politics / News (Left Wing)",
    description: "In this content category, YouTube creators will create content about politics and the news. They will often be highly critical of conservative politics such as Donald Trump and Elon Musk."
  },
  {
    name: "Politics / News (Right Wing)",
    description: "In this content category, YouTube creators will create content about politics and the news. These creators love Donald Trump and Elon Musk and are highly critical of left wing politicians such as Bernie Sanders and Alexandria Ocasio-Cortez."
  },
  {
    name: "True Crime or Mystery",
    description: "In this content category, YouTube creators will tell stories about strange, dark, and mysterious topics such as murders and unsolved cases."
  },
  {
    name: "Guns / Military",
    description: "In this content category, YouTube creators will show themselves shooting guns or talking about their past experience in the military."
  },
  {
    name: "Cars",
    description: "In this content category, YouTube creators will document themselves working on cars or test driving and reviewing cars."
  },
  {
    name: "Police Cam Footage",
    description: "In this content category, YouTube creators watch police body cam footage and provide their commentary"
  },
  {
    name: "Other",
    description: "If a content creator does not fit any of the categories above, consider them 'Other'."
  }
];

// BetterHelp brand categories
const BETTERHELP_CATEGORIES: CategoryDescription[] = [
  {
    name: "Female Lifestyle",
    description: "Female Lifestyle is a content category where female creators share personal, day-to-day experiences centered around modern womanhood. Typical content includes fashion choices, daily routines, meal prep or what they eat in a day, makeup and skincare routines, apartment or home tours, and updates about their personal lives (e.g., moving, relationships, career changes). Videos often focus on themes of independence, self-care, personal growth, and navigating adult life as a woman. The tone is usually relatable, aspirational, or conversational, aiming to connect with viewers through authenticity and shared life stages. This category blends elements of vlog-style storytelling, beauty, wellness, and lifestyle advice."
  },
  {
    name: "Male Lifestyle",
    description: "Male Lifestyle is a content category where male creators share aspects of their personal lives, routines, and interests through vlog-style or commentary-driven videos centered on self-improvement, productivity, fitness, fashion, grooming, dating, or career growth. These creators often give advice, walk through their daily routines, show what they wear, how they train, how they structure their day, or speak about personal challenges and goals as men navigating adulthood. The focus is on sharing their perspective as modern men working to level up physically, mentally, and socially."
  },
  {
    name: "Tarot / Spiritual",
    description: "Tarot / Spiritual is a content category where creators guide viewers through topics like tarot readings, astrology, manifestation, energy healing, and other spiritual or metaphysical practices. These creators often use tools like tarot cards, crystals, or astrology charts to help viewers gain insight into their emotions, relationships, or future. The tone is introspective, supportive, and focused on personal growth, healing, or spiritual awakening. Content is typically centered on intuition and helping others navigate life through a spiritual lens."
  },
  {
    name: "Doctor / Healthcare Professional",
    description: "Doctor / Healthcare Professional is a content category where licensed medical experts or healthcare professionals create educational content around physical and mental health, wellness, disease prevention, and medical myths. These creators often explain symptoms, break down medical studies, react to health trends from a clinical perspective, or share tips for healthier living. The content is authoritative, informative, and focused on improving the viewer's well-being through verified medical knowledge."
  },
  {
    name: "Fitness",
    description: "Fitness is a content category where creators focus on physical health, sharing workouts, training routines, nutrition advice, fitness challenges, and personal transformation journeys. These creators often walk viewers through exercises, explain fitness techniques, discuss gym culture, or offer motivation for building discipline and achieving physical goals. The content is action-oriented and centered on improving the body and mindset through consistent effort."
  },
  {
    name: "True Crime / Mystery",
    description: "True Crime / Mystery is a content category where creators research and narrate real-life cases involving crime, disappearances, unsolved mysteries, and disturbing events. These videos are often scripted, heavily researched, and focus on storytelling—walking viewers through timelines, suspects, evidence, and theories with a serious or investigative tone. The goal is to inform, engage curiosity, and sometimes seek justice or awareness."
  },
  {
    name: "ASMR",
    description: "ASMR (Autonomous Sensory Meridian Response) is a content category where creators use soft auditory and visual triggers to elicit a calming, tingling sensation in viewers. Common triggers include whispering, tapping, brushing, crinkling, and gentle hand movements, often recorded with high-sensitivity microphones for immersive sound. Creators frequently produce roleplay-style videos (e.g., spa visits, medical exams, or personal attention scenarios) that combine soothing tones with detailed, slow-paced interaction. The primary goals of ASMR content are to help viewers relax, fall asleep, reduce anxiety, or feel comforted. The genre is characterized by quiet, intimate production, and often includes visual close-ups and slow, deliberate actions."
  },
  {
    name: "Internet Reacts / Internet Gossip",
    description: "Internet Reacts / Internet Gossip is a content category where creators give their opinions, reactions, or commentary on trending internet topics, viral videos, influencer drama, celebrity news, or cultural moments. These videos are usually unscripted, personality-driven, and centered around the creator's take on events happening outside of their own life. The content is fast-paced, conversational, and focused on engaging with what's currently buzzing online."
  },
  {
    name: "News/Politics",
    description: "News / Politics is a content category where creators share commentary, analysis, or reporting on current events, political figures, legislation, social issues, or cultural debates. These creators often present content through a specific ideological lens—either left-leaning or right-leaning—and aim to inform, persuade, or provoke thought on real-world issues that impact society. Videos are usually research-based or opinion-driven, but rooted in actual news or policy."
  },
  {
    name: "Movies / Film / Pop Culture",
    description: "Movies / Film / Pop Culture is a content category where creators analyze, critique, or discuss films, TV shows, celebrity culture, and entertainment industry trends. These videos often include reviews, breakdowns of scenes or themes, rankings, or commentary on storytelling and character development. The focus is on structured media, not spontaneous viral content."
  },
  {
    name: "Other",
    description: "If a content creator does not fit any of the categories above, consider them 'Other'."
  }
];

// Add both brands to the BRANDS array
export const BRANDS: Brand[] = [
  {
    name: "Aura",
    categories: AURA_CATEGORIES
  },
  {
    name: "BetterHelp",
    categories: BETTERHELP_CATEGORIES
  }
];

// Default brand is Aura
export const DEFAULT_BRAND: BrandName = "Aura";

// Get categories for a specific brand
export const getCategoriesForBrand = (brandName: BrandName): CategoryDescription[] => {
  const brand = BRANDS.find(b => b.name === brandName);
  return brand ? brand.categories : AURA_CATEGORIES;
};

// Get the active categories (defaulting to Aura if no brand specified)
export const CATEGORIES = AURA_CATEGORIES;

// Default API keys
export const DEFAULT_YOUTUBE_API_KEY = "AIzaSyDOKv_bQ9FYE6SASykeC5lkosZP4EGESFU";
export const OPENAI_API_KEY = "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";

// LocalStorage keys
export const CUSTOM_YOUTUBE_API_KEY_STORAGE = "customYoutubeApiKey";
export const SELECTED_BRAND_STORAGE = "selectedBrand";

// Get the active YouTube API key (custom or default)
export const getYoutubeApiKey = (): string => {
  const customKey = localStorage.getItem(CUSTOM_YOUTUBE_API_KEY_STORAGE);
  return customKey || DEFAULT_YOUTUBE_API_KEY;
};

// Save a custom YouTube API key
export const saveCustomYoutubeApiKey = (key: string): void => {
  if (key && key.trim() !== "") {
    localStorage.setItem(CUSTOM_YOUTUBE_API_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(CUSTOM_YOUTUBE_API_KEY_STORAGE);
  }
};

// Clear the custom YouTube API key (revert to default)
export const clearCustomYoutubeApiKey = (): void => {
  localStorage.removeItem(CUSTOM_YOUTUBE_API_KEY_STORAGE);
};

// Get the selected brand (from localStorage or default)
export const getSelectedBrand = (): BrandName => {
  const savedBrand = localStorage.getItem(SELECTED_BRAND_STORAGE) as BrandName | null;
  return savedBrand || DEFAULT_BRAND;
};

// Save the selected brand
export const saveSelectedBrand = (brandName: BrandName): void => {
  localStorage.setItem(SELECTED_BRAND_STORAGE, brandName);
};
