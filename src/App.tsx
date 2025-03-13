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


/**Map utils */
const locationsData ="0.027475,51.502243;0.027753,51.502224;0.02779,51.502235;0.027765,51.502258;0.027748,51.502285;0.027738,51.502312;0.027725,51.502327;0.02774,51.502312;0.027627,51.502335;0.027558,51.502338;0.027505,51.502342;0.027482,51.502346;0.027438,51.502296;0.027412,51.502266;0.02732,51.502228;0.027182,51.502209;0.027155,51.502209;0.027152,51.502209;0.027155,51.502209;0.02711,51.502247;0.027522,51.502346;0.028513,51.502476;0.029905,51.502628;0.031273,51.502853;0.033115,51.502934;0.034663,51.503036;0.036127,51.503117;0.03748,51.503067;0.038533,51.502968;0.039197,51.503109;0.039453,51.503468;0.03951,51.503956;0.03948,51.504307;0.039387,51.504532;0.039423,51.504799;0.039537,51.505108;0.039605,51.505573;0.039657,51.506058;0.039745,51.506569;0.039855,51.507126;0.039938,51.50774;0.040023,51.50832;0.040143,51.508789;0.039895,51.509144;0.039797,51.509518;0.039118,51.509518;0.038013,51.509338;0.036687,51.509331;0.035577,51.509544;0.034852,51.509636;0.034283,51.509666;0.033822,51.509872;0.03354,51.510429;0.03316,51.511063;0.032583,51.511669;0.03217,51.51226;0.031965,51.512653;0.031815,51.512863;0.031693,51.513142;0.03158,51.513496;0.031487,51.513962;0.031552,51.514488;0.031608,51.514961;0.031698,51.515453;0.031857,51.515999;0.031973,51.516491;0.03206,51.516918;0.032128,51.517235;0.032547,51.517395;0.033523,51.517506;0.03463,51.5177;0.0357,51.517986;0.036838,51.518307;0.038063,51.518768;0.039255,51.51923;0.040685,51.51965;0.042843,51.520061;0.044733,51.520233;0.04656,51.52021;0.04841,51.520031;0.050105,51.51989;0.051945,51.519703;0.053695,51.519585;0.055455,51.519665;0.057077,51.519863;0.058677,51.520168;0.060312,51.520641;0.061677,51.521236;0.062917,51.521786;0.064365,51.522346;0.06619,51.522995;0.067935,51.523579;0.069447,51.52412;0.0706,51.524578;0.071712,51.525135;0.072262,51.525913;0.072345,51.526962;0.07223,51.528065;0.072263,51.529285;0.072247,51.530193;0.0721,51.531132;0.07179,51.532085;0.071362,51.533001;0.070853,51.533863;0.070383,51.534458;0.070003,51.534939;0.069458,51.535637;0.068928,51.536156;0.068715,51.536316;0.068368,51.536709;0.069082,51.537144;0.069888,51.536922;0.070863,51.537128;0.071728,51.537445;0.072142,51.537891;0.071907,51.538593;0.07203,51.539375;0.072885,51.539944;0.074055,51.540257;0.075232,51.540516;0.07634,51.540756;0.07735,51.541039;0.078378,51.541176;0.079605,51.54121;0.080903,51.541195;0.081863,51.540955;0.082507,51.541008;0.082668,51.541424;0.081787,51.54187;0.080283,51.542618;0.078938,51.543373;0.078105,51.543812;0.077735,51.544262;0.077585,51.544594;0.077998,51.544636;0.078118,51.544598";

function parseLocations(locations: string): number[][]{
  const parsedLocations = locations.split(';').map(loc => {
    const [lng, lat] = loc.split(',');
    return [parseFloat(lng), parseFloat(lat)];
  });
  return parsedLocations
}
const parsedLocations = parseLocations(locationsData)

function mapFitBounds(map:mapboxgl.Map, coordinates:number[][]){
  map.fitBounds([
    [Math.min(...coordinates.map(loc => loc[0])), Math.min(...coordinates.map(loc => loc[1]))],
    [Math.max(...coordinates.map(loc => loc[0])), Math.max(...coordinates.map(loc => loc[1]))]
  ], {
    padding: 30,
  });
}

function mapDrawRouteAndPoint(map:mapboxgl.Map, coordinates:number[][]){
  map.addSource('route', {
    'type': 'geojson',
    'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
            'type': 'LineString',
            'coordinates': coordinates
        }
    }
  });
  map.addSource('vehicle', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': coordinates[0] 
      },
      'properties': {}
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

  map.addLayer({
    'id': 'vehicle',
    'type': 'circle',
    'source': 'vehicle',
    'paint': {
      'circle-radius': 8,
      'circle-color': '#FF0000' 
    }
  });
}

function mapRemoveObject(map:mapboxgl.Map, object:string){
   if (map.getSource(object)) {
    map.removeLayer(object);
    map.removeSource(object);
  }
}

function mapAnimatePoint(map:mapboxgl.Map, coordinates:number[][]){
  let currentIndex = 0;
  let animationFrameId:number | null = null;

  function animateVehicle() {
    const nextIndex = currentIndex + 1;
    const currentCoord: [number, number] = [coordinates[currentIndex][0], coordinates[currentIndex][1]];
    const vehiclePoint = map.getSource('vehicle') as mapboxgl.GeoJSONSource
    if(vehiclePoint){
      vehiclePoint.setData({
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': currentCoord
        },
        'properties': {}
      })
      map.easeTo({
        center: currentCoord,
        duration: 1000,
      });

    }

    currentIndex = nextIndex;

    if (currentIndex < coordinates.length) {
      animationFrameId = requestAnimationFrame(animateVehicle);
    } else {
      stopAnimation();
    }
  }
  map.once("moveend", () => {
    animateVehicle();
  });

  function stopAnimation() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }
}

/**Utils */
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
        center: [parsedLocations[0][0], parsedLocations[0][1]],
        zoom: 11,
        maxZoom: 24,
      });
      mapRef.current = map;
      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      return () => map.remove();
    }
  }, []);
	
  /**Fleets logic */
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [fleetLogo, setFleetLogo] = useState("");
  const [snaphotsMap, setSnaphotsMap] = useState<Map<string,Snapshot[]>>(new Map());


  const [selectedFleet, setSelectedFleet] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedVehicleData, setSelectedVehicleData] = useState<Snapshot | null | undefined >(null);

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
    return snapshots
  };

  const updateSnapshotsMap = async (page:number) => {
    const snapshots = await getSnapshotData()
    const key = `page-${page}`
    setSnaphotsMap(map => new Map(map.set(key, snapshots)));
  }

  const getSnapshotsPage =  (page:number)=>  {
    const key = `page-${page}`
    return snaphotsMap.get(key)
  }

  const getOrUpdateSnapshotsMap = async (page:number)=> {
    const current = getSnapshotsPage(page)
    if(!current){
      await updateSnapshotsMap(page)
      return getSnapshotsPage(page)
    } else {
      return current
    }
  };

  useEffect(() => {
    getFleets();
  }, []);

  const handleFleetChange = (value: string) => {
    if(value && fleets){
      const currentFLeet= fleets.find(({id})=> id == value);
      if(currentFLeet){
        setFleetLogo(currentFLeet.logo)
      }
      setSelectedFleet(value);
      setSelectedVehicleData(null)
      getVehicles(value);
    }
  };

  const handleVehicleChange = async (value: string) => {
    setSelectedVehicle(value);

    async function searchVehichle(page = 1){
      const currSnapshots = await getOrUpdateSnapshotsMap(page)
      const vehicleData = currSnapshots?.find((item: Snapshot) => item.vehicleId === Number(value));
      if(vehicleData) {
        return vehicleData
      } 
      else if(page == 3) {
        return undefined
      } else {
        searchVehichle(page++)
      }
    }
    const vehicleData = await searchVehichle();
    if(vehicleData){
      setSelectedVehicleData(vehicleData);
      if(mapRef.current){
        const coordinates = vehicleData.locations ? parseLocations(vehicleData.locations) : parsedLocations;
        mapRemoveObject(mapRef.current,"route");
        mapRemoveObject(mapRef.current,"vehicle");
        mapFitBounds(mapRef.current, coordinates);
        mapDrawRouteAndPoint(mapRef.current, coordinates);
        mapAnimatePoint(mapRef.current, coordinates);
      }
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
