import { YoutubeChannel } from "@/types";
import Papa from 'papaparse';
import { toast } from "sonner";

/**
 * Parse a CSV file containing YouTube channel data
 * Handles different possible column header formats
 */
export const parseCSV = (file: File): Promise<YoutubeChannel[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Check if we have any data
        if (results.data.length === 0) {
          reject(new Error("The CSV file appears to be empty. Please check the file and try again."));
          return;
        }

        // Log the first row to help with debugging
        console.log("CSV first row sample:", results.data[0]);
        
        // Get the actual column headers from the file to help identify mapping issues
        const headers = Object.keys(results.data[0]);
        console.log("CSV headers detected:", headers);

        // Expanded map of possible column names for URL
        const urlColumnOptions = [
          'Channel URL', 'ChannelURL', 'channel url', 'url', 'URL', 'Link', 'CHANNEL URL',
          'YouTube Channel URL', 'YouTubeChannelURL', 'Youtube Channel URL', 'YOUTUBE CHANNEL URL',
          'YouTube URL', 'YoutubeURL', 'youtube url', 'video url', 'Video URL', 'YouTubeURL'
        ];
        
        // Expanded map of possible column names for Name
        const nameColumnOptions = [
          'Channel Name', 'ChannelName', 'channel name', 'name', 'Name', 'Title', 'CHANNEL NAME',
          'YouTube Channel Name', 'YouTubeChannelName', 'Youtube Channel Name'
        ];

        // Find the actual column names in the CSV
        let urlColumn = headers.find(header => urlColumnOptions.includes(header));
        let nameColumn = headers.find(header => nameColumnOptions.includes(header));

        // If no exact match found, try partial matching (for columns like "Channel URL (required)")
        if (!urlColumn) {
          urlColumn = headers.find(header => 
            urlColumnOptions.some(option => header.includes(option))
          );
        }
        
        if (!nameColumn) {
          nameColumn = headers.find(header => 
            nameColumnOptions.some(option => header.includes(option))
          );
        }

        if (!urlColumn) {
          reject(new Error(`Could not find a column for channel URLs. Your CSV needs a column with a name like "Channel URL", "YouTube Channel URL", etc. Found columns: ${headers.join(', ')}`));
          return;
        }

        const channels: YoutubeChannel[] = [];
        let rowsWithoutUrls = 0;

        results.data.forEach((row: any, index: number) => {
          // Get URL from the detected URL column
          let url = row[urlColumn!] || '';
          
          // Clean up the URL (remove quotes, extra spaces)
          url = url.trim().replace(/^["'](.*)["']$/, '$1');
          
          // Get name from the detected name column or try other columns
          let name = '';
          if (nameColumn) {
            name = row[nameColumn] || '';
          } else {
            // Try each possible column name for the channel name
            for (const col of nameColumnOptions) {
              if (row[col]) {
                name = row[col];
                break;
              }
            }
          }

          // Skip empty URLs without logging to avoid console spam
          if (!url.trim()) {
            rowsWithoutUrls++;
            return; // Skip this row
          }

          channels.push({
            url,
            name: name.trim() || `Channel ${index + 1}`,
            status: 'pending'
          });
        });
        
        if (channels.length === 0) {
          if (rowsWithoutUrls > 0) {
            reject(new Error(`No valid channel URLs found in the CSV. Found ${rowsWithoutUrls} rows without URLs. Please make sure your URLs are in a column named similar to "Channel URL" or "YouTube Channel URL".`));
          } else {
            reject(new Error("No valid channel URLs found in the CSV. Please check the file format."));
          }
          return;
        }

        if (rowsWithoutUrls > 0) {
          console.warn(`Found ${results.data.length} rows but only ${channels.length} had valid URLs`);
          toast.warning(`${rowsWithoutUrls} rows were skipped because they had no URL`);
        }

        resolve(channels);
      },
      error: (error) => {
        console.error("CSV parsing error:", error);
        reject(new Error(`Error parsing CSV: ${error.message}`));
      }
    });
  });
};

export const generateCSV = (channels: YoutubeChannel[]): string => {
  const csvData = channels.map(channel => ({
    'CHANNEL URL': channel.url,
    'CHANNEL NAME': channel.name,
    'CATEGORY': channel.category || ''
  }));
  
  return Papa.unparse(csvData);
};

export const downloadCSV = (data: string, filename: string = 'categorized_channels.csv'): void => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
