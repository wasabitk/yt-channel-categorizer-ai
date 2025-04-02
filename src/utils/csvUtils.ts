
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

        // Map of possible column names for URL and Name
        const urlColumnOptions = ['Channel URL', 'ChannelURL', 'channel url', 'url', 'URL', 'Link', 'CHANNEL URL'];
        const nameColumnOptions = ['Channel Name', 'ChannelName', 'channel name', 'name', 'Name', 'Title', 'CHANNEL NAME'];

        // Find the actual column names in the CSV
        const urlColumn = headers.find(header => urlColumnOptions.includes(header));
        const nameColumn = headers.find(header => nameColumnOptions.includes(header));

        if (!urlColumn && !nameColumn) {
          reject(new Error(`Could not find required columns. Your CSV needs columns for channel URL and name. Found columns: ${headers.join(', ')}`));
          return;
        }

        const channels: YoutubeChannel[] = results.data.map((row: any, index: number) => {
          // Get URL and name using the detected column headers or try common alternatives
          let url = '';
          let name = '';

          // Try to find URL in different possible columns
          if (urlColumn) {
            url = row[urlColumn] || '';
          } else {
            // Try each possible column name
            for (const col of urlColumnOptions) {
              if (row[col]) {
                url = row[col];
                break;
              }
            }
          }

          // Try to find name in different possible columns
          if (nameColumn) {
            name = row[nameColumn] || '';
          } else {
            // Try each possible column name
            for (const col of nameColumnOptions) {
              if (row[col]) {
                name = row[col];
                break;
              }
            }
          }

          // Validate this row has minimal required data
          if (!url && index < 5) {
            console.warn(`Row ${index + 1} is missing a URL`);
          }

          return {
            url: url || '',
            name: name || `Channel ${index + 1}`,
            status: 'pending'
          };
        });

        // Filter out entries with empty URLs
        const validChannels = channels.filter(channel => !!channel.url.trim());
        
        if (validChannels.length === 0) {
          reject(new Error("No valid channel URLs found in the CSV. Please check the file format."));
          return;
        }

        if (validChannels.length < channels.length) {
          console.warn(`Found ${channels.length} rows but only ${validChannels.length} had valid URLs`);
          toast.warning(`${channels.length - validChannels.length} rows were skipped because they had no URL`);
        }

        resolve(validChannels);
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
