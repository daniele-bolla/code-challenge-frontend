import ApiService, { baseURL } from '@/services/ApiService'
import { Fleet } from '@/types/fleet';
import { Vehicle } from '@/types/vehicle';
import {Snapshot} from '@/types/data';

export async function fetchFleets():Promise<Fleet[]> {
  const { data }= await ApiService.get (`/fleets`);
  return data
}

export const fleetImageUrl = baseURL + "/images/fleets/"

export async function fetchVehicles(fleetId: string): Promise<Vehicle[]> {
  const { data }= await ApiService.get (`/vehicles?fleetId=${fleetId}`);
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

export async function fetchSnapshotData(page: number = 1): Promise<SnapshotsResponse> {
  const url = `/snapshots?page=${page}`;
  const { data }= await ApiService.get (url);
  return data
};


