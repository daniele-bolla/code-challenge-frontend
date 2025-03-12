import { readFile } from 'fs/promises';
import { Snapshot } from '../../src/types/data';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const getSnapshots = async (page: number = 1): Promise<Snapshot[]> => {
  try {
    const fileName = path.join(__dirname, `../data/snapshots/${page}.json`);
    const fileContent = await readFile(fileName, 'utf-8');
    const data: Snapshot[] = JSON.parse(fileContent);
    return data;
  } catch (error) {
    console.error(`Error reading file ${page}.json:`, error);
    throw error;
  }
};