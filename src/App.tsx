import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'
import { fetchFleets, fetchSnapshotData, fetchVehicles } from './services/FleetService';
import { Fleet } from './types/fleet';
import { Vehicle } from './types/vehicle';


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Snapshot } from './types/data';


function App() {
  /**Map */
  const mapContainer = useRef<HTMLDivElement>(null);
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

      // Add zoom controls
      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      // Add your custom markers and lines here

      // Clean up on unmount
      return () => map.remove();
    }
  }, []);


  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedFleet, setSelectedFleet] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedVehicleData, setSelectedVehicleData] = useState<Snapshot | null>(null);
  const [locations, setLocations] = useState<Snapshot | null>(null);

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
    if(value){
      setSelectedFleet(value);
      getVehicles(value);
    }
  };

  const handleVehicleChange = (value: string) => {
    setSelectedVehicle(value);
    console.log(snapshots)

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

    const vehicleData = searchVehichle();
    if(vehicleData){
      setSelectedVehicleData(vehicleData)
      if ( vehicleData.locations) {
        setLocations(JSON.parse(vehicleData.locations));
        console.log(locations)
      }

    }
 
  };
  
  return (
    <>
      <div className="flex mb-4 space-x-4">
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


      <h1>Worn Tyres Platform</h1>
      {selectedVehicleData && (
        <Card>
          <CardHeader>
            <CardTitle>Snapshot Data</CardTitle>
            <CardDescription>Data for the selected vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>Min PSU1 Voltage: {selectedVehicleData.minPsu1Voltage}</div>
              <div>Max PSU1 Voltage: {selectedVehicleData.maxPsu1Voltage}</div>
              <div>Avg PSU1 Voltage: {selectedVehicleData.avgPsu1Voltage}</div>
              <div>Min PSU2 Voltage: {selectedVehicleData.minPsu2Voltage}</div>
              <div>Max PSU2 Voltage: {selectedVehicleData.maxPsu2Voltage}</div>
              <div>Avg PSU2 Voltage: {selectedVehicleData.avgPsu2Voltage}</div>
              <div>Min Humidity: {selectedVehicleData.minHumidity}</div>
              <div>Max Humidity: {selectedVehicleData.maxHumidity}</div>
              <div>Avg Humidity: {selectedVehicleData.avgHumidity}</div>
              <div>Min Pressure: {selectedVehicleData.minPressure}</div>
              <div>Max Pressure: {selectedVehicleData.maxPressure}</div>
              <div>Avg Pressure: {selectedVehicleData.avgPressure}</div>
              <div>Routed KM Travelled: {selectedVehicleData.routedKmTravelled}</div>
              <div>KM Travelled: {selectedVehicleData.kmTravelled}</div>
            </div>
          </CardContent>
        </Card>
      )}
        <div id='map-container' ref={mapContainer}/>
    </>
  )
}

export default App
