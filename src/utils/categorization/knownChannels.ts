
import { Category } from "@/types";

/**
 * Map of known channel names to their respective categories
 * Used to override AI categorization for channels we know are often miscategorized
 */
export const knownChannels: Record<string, Category> = {
  // Aura categorizations
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
  "@yeptheboys": "True Crime or Mystery",
  
  // BetterHelp categorizations
  "WhispersRed ASMR": "ASMR",
  "@WhispersRedASMR": "ASMR",
  "ASMR Darling": "ASMR",
  "@ASMRDarling": "ASMR",
  "Gentle Whispering ASMR": "ASMR",
  "@GentleWhisperingASMR": "ASMR",
  "ATHLEAN-X": "Fitness",
  "@ATHLEANX": "Fitness",
  "Jeremy Ethier": "Fitness",
  "@JeremyEthier": "Fitness",
  "Doctor Mike": "Doctor / Healthcare Professional",
  "@DoctorMike": "Doctor / Healthcare Professional",
  "Mama Doctor Jones": "Doctor / Healthcare Professional",
  "@MamaDoctorJones": "Doctor / Healthcare Professional",
  "Alexandra Gater": "Female Lifestyle",
  "@AlexandraGater": "Female Lifestyle",
  "Modern Therapy": "Male Lifestyle",
  "@ModernTherapy": "Male Lifestyle",
  
  // Zocdoc categorizations
  "Doctor Mike": "Doctor / Healthcare Professional",
  "@DoctorMike": "Doctor / Healthcare Professional",
  "Mama Doctor Jones": "Doctor / Healthcare Professional",
  "@MamaDoctorJones": "Doctor / Healthcare Professional",
  "MedLife Crisis": "Doctor / Healthcare Professional",
  "@MedLifeCrisis": "Doctor / Healthcare Professional",
  "The Doctors": "Doctor / Healthcare Professional",
  "@TheDoctors": "Doctor / Healthcare Professional",
  "Dr. Sandra Lee (Dr. Pimple Popper)": "Doctor / Healthcare Professional",
  "@DrSandraLee": "Doctor / Healthcare Professional"
};

/**
 * Map of known channel IDs to their respective categories
 */
export const knownChannelIds: Record<string, Category> = {
  "UCazRf1jcMNZEL1MS5i_rWQQ": "Police Cam Footage", // Real World Police
  "UCJWKjrrUh2KL1d3zXQW79cQ": "Police Cam Footage", // New Police Cam Footage channel
  "UCTuDW_RrS0Di2L7CsJfFOnA": "True Crime or Mystery", // Yep The Boys channel ID
  "UCsvqVGtbbyHaMoevxPAq9Fg": "Internet Reacts / Internet Gossip", // Internet Reacts example
  "UCzx9GfbcHseFYYc0jcEqImA": "ASMR", // ASMR Darling channel ID
  "UC2eddeJoyTIzdlHdDhRvmRw": "Doctor / Healthcare Professional" // Doctor Mike channel ID
};

/**
 * Map of known video IDs to their respective categories
 * Important: These are the exact video IDs that appear in YouTube URLs
 */
export const knownVideoIds: Record<string, Category> = {
  "z1sKwev21gE": "Internet Reacts / Internet Gossip", // Specific Internet Reacts video
  "v32NRpqRFoU": "Internet Reacts / Internet Gossip",  // Another Internet Reacts video example
  "kcda94R0Pcw": "Internet Reacts / Internet Gossip",  // J Aubrey video about Internet drama
  "9j53D4o0CfQ": "ASMR", // Popular ASMR video
  "4Jt9_adxzdA": "Male Lifestyle", // Male lifestyle video
  "7jYYHawqy4Y": "Fitness" // Fitness video
};
