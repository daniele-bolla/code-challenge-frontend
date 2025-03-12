import { Fleet } from './types/fleet';
import { Vehicle } from './types/vehicle';
import { Snapshot } from './types/data';
import './App.css'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';

import { useRef, useEffect, useState } from 'react'

import { fetchFleets, fetchSnapshotData, fetchVehicles, fleetImageUrl } from './services/FleetService';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const locationsData = "0.028,51.501827;0.027552,51.50272;0.027367,51.502541;0.027302,51.502636;0.027242,51.502457;0.027187,51.502228;0.027225,51.502197;0.027318,51.502121;0.027428,51.502022;0.027485,51.502022;0.027422,51.502052;0.027317,51.502041;0.027297,51.502037;0.02729,51.502037;0.02729,51.502037;0.027292,51.502041;0.027292,51.502045;0.027293,51.502041;0.027292,51.502037;0.027292,51.502033;0.027287,51.502033;0.027282,51.502029;0.027282,51.502026;0.027282,51.502022;0.027282,51.502022;0.027283,51.502022;0.027285,51.502018;0.027287,51.502018;0.027288,51.502018;0.02729,51.502022;0.027292,51.502026;0.027287,51.502022;0.027277,51.502014;0.027265,51.50201;0.027258,51.502007;0.027245,51.501995;0.027243,51.501987;0.027252,51.50198;0.027258,51.501972;0.027238,51.501953;0.02722,51.501938;0.027237,51.50193;0.027242,51.501915;0.02724,51.501915;0.027242,51.501915;0.027232,51.501896;0.027242,51.501915;0.027243,51.501892;0.027257,51.501881;0.027258,51.501873;0.02726,51.501873;0.027262,51.501873";

/**Utils */
function parseLocations(locations: string): number[][]{
  const parsedLocations = locations.split(';').map(loc => {
    const [lng, lat] = loc.split(',');
    return [parseFloat(lng), parseFloat(lat)];
  });
  return parsedLocations
}
const parsedLocations = parseLocations(locationsData)
/**Map utils */

function mapFitBounds(map:mapboxgl.Map, coordinates:number[][]){
  map.fitBounds([
    [Math.min(...coordinates.map(loc => loc[0])), Math.min(...coordinates.map(loc => loc[1]))],
    [Math.max(...coordinates.map(loc => loc[0])), Math.max(...coordinates.map(loc => loc[1]))]
  ], {
    padding: 40,
    maxZoom: 14,
  });
}

function mapDrawRoute(map:mapboxgl.Map, coordinates:number[][]){
  map.addSource('route', {
    'type': 'geojson',
    'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
            'type': 'LineString',
            'coordinates':coordinates
        }
    }
  });
  map.addLayer({
    'id': 'route',
    'type': 'line',
    'source': 'route',
    'layout': {
        'line-join': 'round',
        'line-cap': 'round'
    },
    'paint': {
        'line-color': '#888',
        'line-width': 8
    }
  });
}


const formatValue = (value: string | null) => {
  return value === null ? <span className="text-red-500">Not available</span> : value;
};

function App() {
  /**Map */
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoidHRjLWhheWVza2ciLCJhIjoiY203dWNoZG94MDIyYzJxcjZ6Y2EwY3BybyJ9.Jn4YpF1DPcTaVmqN-uyJxg";

    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-74.0060152, 40.7127281],
        zoom: 5,
        maxZoom: 15,
      });
      mapRef.current = map;
      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      return () => map.remove();
    }
  }, []);
	
  /**Fleets logic */
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [fleetLogo, setFleetLogo] = useState("");
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedFleet, setSelectedFleet] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedVehicleData, setSelectedVehicleData] = useState<Snapshot | null>(null);

  const getFleets = async () => {
    const data = await fetchFleets();
    setFleets(data);
  };
  const getVehicles = async (selectedFleet:string) => {
    const data = await fetchVehicles(selectedFleet);
    setVehicles(data);
  };
  const getSnapshotData = async (page?:number) => {
      const { snapshots} = await fetchSnapshotData(page)
      setSnapshots(snapshots)
  };

  useEffect(() => {
    getFleets();
    getSnapshotData();
  }, []);

  const handleFleetChange = (value: string) => {
    if(value && fleets){
      const currentFLeet= fleets.find(({id})=> id == value);
      if(currentFLeet){
        setFleetLogo(currentFLeet.logo)
      }
      setSelectedFleet(value);
      getVehicles(value);
    }
  };

  const handleVehicleChange = (value: string) => {
    setSelectedVehicle(value);

    function searchVehichle(page = 0){
      if(page) getSnapshotData(page)
      const vehicleData = snapshots.find((item: Snapshot) => item.vehicleId === Number(value));
      if(vehicleData) {
        return vehicleData
      } else if(page == 3) {
        return false
      } else {
        searchVehichle(page++)
      }
    }

    if(mapRef.current){
      const coordinates = parsedLocations
      mapFitBounds(mapRef.current, coordinates)
      mapDrawRoute(mapRef.current, coordinates)
    }
    const vehicleData = searchVehichle()
    if(vehicleData){
      setSelectedVehicleData(vehicleData)
    }
 
  };
  
  return (
    <>
    <main className='container mx-auto px-4'>
    <h1 className='text-4xl text-center mt-4 mb-8'>Worn Tyres Platform</h1>

    <div className="mt-4 h-[500px] rounded-4xl">
      <div id='map-container' className="w-full h-full" ref={mapContainer}/>
    </div>
    <div className="flex mb-8 mt-6 space-x-4 items-center">
      <label>Select a fleet adn a vehicle</label>
      <Select onValueChange={handleFleetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fleet" />
        </SelectTrigger>
        <SelectContent>
          {fleets.map((fleet: Fleet) => (
            <SelectItem key={fleet.id} value={fleet.id}>
              {fleet.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={handleVehicleChange} disabled={!selectedFleet}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a vehicle" />
        </SelectTrigger>
        <SelectContent>
          {vehicles.map((vehicle: Vehicle) => (
            <SelectItem key={vehicle.id} value={vehicle.id}>
              {vehicle.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className='flex justify-between items-start'>
      {fleetLogo && <img className='h-36 rounded-lg shadow-lg' src={`${fleetImageUrl}${fleetLogo}`}></img>}
      {selectedVehicleData && (
      <Card>
        <CardHeader>
          <CardTitle>Snapshot Data</CardTitle>
          <CardDescription>Data for the selected vehicle {selectedVehicle}</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="space-y-2">
              <div><strong>PSU1 Voltage:</strong> Min: {formatValue(selectedVehicleData.minPsu1Voltage)}, Max: {formatValue(selectedVehicleData.maxPsu1Voltage)}, Avg: {formatValue(selectedVehicleData.avgPsu1Voltage)}</div>
              <div><strong>PSU2 Voltage:</strong> Min: {formatValue(selectedVehicleData.minPsu2Voltage)}, Max: {formatValue(selectedVehicleData.maxPsu2Voltage)}, Avg: {formatValue(selectedVehicleData.avgPsu2Voltage)}</div>
              <div><strong>Humidity:</strong> Min: {formatValue(selectedVehicleData.minHumidity)}, Max: {formatValue(selectedVehicleData.maxHumidity)}, Avg: {formatValue(selectedVehicleData.avgHumidity)}</div>
              <div><strong>Pressure:</strong> Min: {formatValue(selectedVehicleData.minPressure)}, Max: {formatValue(selectedVehicleData.maxPressure)}, Avg: {formatValue(selectedVehicleData.avgPressure)}</div>
              <div><strong>Distance Travelled:</strong> Routed: {formatValue(selectedVehicleData.routedKmTravelled)}, Total: {formatValue(selectedVehicleData.kmTravelled)}</div>
            </div>
        </CardContent>
      </Card>
    )}
    </div>

    </main>

    </>
  )
}

export default App
