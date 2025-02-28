export interface Vehicle {
  id:                    string;
  registration:          string;
  vehicleMake:           string;
  vehicleModel:          string;
  color:                 string;
  description:           string;
  lastLocation__lat:     string;
  lastLocation__lng:     string;
  lastLocation:          string;
  lastLocationUpdatedAt: Date;
  totalDistance:         string;
  distanceInLast24Hours: string;
  lastCleanedAt:         string;
  createdAt:             Date;
  updatedAt:             Date;
  depotId:               string;
  fleetId:               string;
}
