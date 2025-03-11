import ApiService from '@/services/ApiService'
import { Fleet } from '@/types/fleet';
import { Vehicle } from '@/types/vehicle';
import {Snapshot} from '@/types/data';

export async function fetchFleets():Promise<Fleet[]> {
  const { data } = await ApiService.get("")
  const { results } = data
  return results
}

export async function fetchVehicles(fleetId: string): Promise<Vehicle[]> {
  const response = await fetch(`https://ttc-vehicles.deno.dev?fleetId=${fleetId}`);
  return await response.json();
};

export async function fetchSnapshotData(page: number): Promise<Snapshot[]> {
  const response = await fetch(`https://ttc-data.deno.dev?page=${page}`);
  return await response.json();
};


