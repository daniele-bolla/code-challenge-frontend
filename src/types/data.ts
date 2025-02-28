export interface The1 {
  snapshots:  Snapshot[];
  pagination: Pagination;
}

export interface Pagination {
  totalItems:   number;
  itemsPerPage: number;
  currentPage:  number;
  totalPages:   number;
}

export interface Snapshot {
  id:                number;
  clientId:          number;
  depotId:           number;
  vehicleId:         number;
  startsAt:          Date;
  endsAt:            Date;
  duration:          Duration;
  minTemp:           string;
  maxTemp:           string;
  avgTemp:           string;
  minHumidity:       string;
  maxHumidity:       string;
  avgHumidity:       string;
  minPressure:       string;
  maxPressure:       string;
  avgPressure:       string;
  minRainfall:       string;
  maxRainfall:       string;
  avgRainfall:       string;
  weatherSource:     WeatherSource;
  minCpuTemp:        null | string;
  maxCpuTemp:        null | string;
  avgCpuTemp:        null | string;
  minPsu1Current:    null | string;
  maxPsu1Current:    null | string;
  avgPsu1Current:    null | string;
  minPsu2Current:    null | string;
  maxPsu2Current:    null | string;
  avgPsu2Current:    null | string;
  minPsu1Voltage:    null | string;
  maxPsu1Voltage:    null | string;
  avgPsu1Voltage:    null | string;
  minPsu2Voltage:    null | string;
  maxPsu2Voltage:    null | string;
  avgPsu2Voltage:    null | string;
  minSpeed:          null;
  maxSpeed:          null;
  avgSpeed:          null | string;
  startLocation:     Location | null;
  endLocation:       Location | null;
  kmTravelled:       string;
  routedKmTravelled: null | string;
  locationSource:    LocationSource | null;
  locationCount:     number;
  locations:         null | string;
  createdAt:         Date;
  updatedAt:         Date | null;
  regenerateAt:      null;
  notes:             null | string;
}

export enum Duration {
  The1H = "1h",
}

export interface Location {
  lat: number;
  lng: number;
}

export enum LocationSource {
  Balena = "balena",
  CSV = "csv",
}

export enum WeatherSource {
  Depot = "depot",
  Vehicle = "vehicle",
}
