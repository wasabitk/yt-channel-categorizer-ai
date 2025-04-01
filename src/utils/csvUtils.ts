
import { YoutubeChannel } from "@/types";
import Papa from 'papaparse';

export const parseCSV = (file: File): Promise<YoutubeChannel[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const channels: YoutubeChannel[] = results.data.map((row: any) => ({
          url: row['Channel URL'] || '',
          name: row['Channel Name'] || '',
          status: 'pending'
        }));
        resolve(channels);
      },
      error: (error) => {
        reject(error);
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
