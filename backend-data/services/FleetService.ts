// src/services/fleetService.ts
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { Fleet } from '../../src/types/fleet';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getFleets = async (): Promise<Fleet[]> => {
  return new Promise((resolve, reject) => {
    const fleets: Fleet[] = [];
    const filePath = path.join(__dirname, '../data/fleets.csv');

    createReadStream(filePath)
      .pipe(parse({ columns:true }))
      .on('data', (row: Fleet) => {
        console.log(row)
        fleets.push(row);
      })
      .on('end', () => {
        resolve(fleets);
      })
      .on('error', (error) => {
        console.log(error)
        reject(error);
      });
  });
};