import ApiService from '@/services/ApiService'
import { Fleet } from '@/types/fleet';
import { Vehicle } from '@/types/vehicle';
import {Snapshot} from '@/types/data';

export async function fetchFleets():Promise<Fleet[]> {
  const { data }= await ApiService.get (`https://ttc-fleets.deno.dev`);
  return data
}

export async function fetchFleetImage(logo: string): Promise<Vehicle[]> {
  const { data }= await ApiService.get (`https://ttc-images.deno.dev/?imageId=${logo}`);
  return data
};

export async function fetchVehicles(fleetId: string): Promise<Vehicle[]> {
  const { data }= await ApiService.get (`https://ttc-vehicles.deno.dev?fleetId=${fleetId}`);
  return data
};

type SnapshotsResponse = {
  pagination: {
    totalItems: 300, 
    itemsPerPage: 100, 
    currentPage: 1, 
    totalPages: 1
  },
  snapshots:Snapshot[]

}

export async function fetchSnapshotData(page?: number): Promise<SnapshotsResponse> {
  const url = page? `https://ttc-data.deno.dev?page=${page}&itemsPerPage=300`: `https://ttc-data.deno.dev?itemsPerPage=300`
  const { data }= await ApiService.get (url);
  return data
};


