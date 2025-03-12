import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { Vehicle } from '../../src/types/vehicle';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getVehicles = async (fleetId): Promise<Vehicle[]> => {
  return new Promise((resolve, reject) => {
    const vehicles: Vehicle[] = [];
    const filePath = path.join(__dirname, '../data/vehicles.csv');

    createReadStream(filePath)
      .pipe(parse({ columns:true }))
      .on('data', (row: Vehicle) => {
        if (row.fleetId === fleetId) {
          vehicles.push(row);
        }
      })
      .on('end', () => {
        resolve(vehicles);
      })
      .on('error', (error) => {
        console.log(error)
        reject(error);
      });
  });
};