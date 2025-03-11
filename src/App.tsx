import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'
import { fetchFleets } from './services/FleetService';
import { Fleet } from './types/fleet';
import { Vehicle } from './types/vehicle';

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
  // const [selectedFleet, setSelectedFleet] = useState<string | null>(null);
  // const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const getFleets = async () => {
    const fleets = await fetchFleets();
    setFleets(fleets);
  };
  useEffect(() => {
    getFleets();
  }, []);

  // useEffect(() => {
  //   if (selectedFleet) {
  //     fetchVehicles(selectedFleet);
  //   }
  // }, [selectedFleet]);

  // useEffect(() => {
  //   if (selectedVehicle) {
  //     fetchSnapshotData(selectedVehicle);
  //   }
  // }, [selectedVehicle]);
  
  return (
    <>
      <h1>Worn Tyres Platform</h1>
      <div id='map-container' ref={mapContainer}/>
    </>
  )
}

export default App
