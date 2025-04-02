
import { Category } from "@/types";

/**
 * Map of known channel names to their respective categories
 * Used to override AI categorization for channels we know are often miscategorized
 */
export const knownChannels: Record<string, Category> = {
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
  "@realworldpolice": "Police Cam Footage",
  "Yep The Boys": "True Crime or Mystery",
  "@yeptheboys": "True Crime or Mystery"
};

/**
 * Map of known channel IDs to their respective categories
 */
export const knownChannelIds: Record<string, Category> = {
  "UCazRf1jcMNZEL1MS5i_rWQQ": "Police Cam Footage", // Real World Police
  "UCJWKjrrUh2KL1d3zXQW79cQ": "Police Cam Footage", // New Police Cam Footage channel
  "UCTuDW_RrS0Di2L7CsJfFOnA": "True Crime or Mystery", // Yep The Boys channel ID
  "UCsvqVGtbbyHaMoevxPAq9Fg": "Internet Reacts / Internet Gossip" // Internet Reacts example
};

/**
 * Map of known video IDs to their respective categories
 */
export const knownVideoIds: Record<string, Category> = {
  "z1sKwev21gE": "Internet Reacts / Internet Gossip" // Specific Internet Reacts video
};
