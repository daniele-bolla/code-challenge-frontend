import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'
import { fetchFleets, fetchSnapshotData, fetchVehicles } from './services/FleetService';
import { Fleet } from './types/fleet';
import { Vehicle } from './types/vehicle';


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    debugger
    if(vehicleData){
      setSelectedVehicleData(vehicleData)
      debugger
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
      <div id='map-container' ref={mapContainer}/>
    </>
  )
}

export default App
