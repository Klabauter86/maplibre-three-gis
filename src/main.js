import './styles.css';
import { createMap } from './map/createMap.js';
import { createDemoNatureData, loadGeoJSON } from './geodata/demoData.js';
import { createNatureLayer } from './three/createNatureLayer.js';
import { createStatus } from './ui/status.js';

const status = createStatus();

function errorMessage(error) {
  return error?.message ?? String(error ?? 'Unbekannter Fehler');
}

window.addEventListener('error', (event) => {
  console.error(event.error ?? event);
  status.set(`Startfehler: ${errorMessage(event.error ?? event.message)}`, 'error');
});

window.addEventListener('unhandledrejection', (event) => {
  console.error(event.reason);
  status.set(`Startfehler: ${errorMessage(event.reason)}`, 'error');
});

let map;
try {
  status.set('Lade Karte und Terrain …');
  map = createMap();
} catch (error) {
  console.error(error);
  status.set(`Startfehler: ${errorMessage(error)}`, 'error');
}

async function getNatureData() {
  try {
    const dataUrl = `${import.meta.env.BASE_URL}data/example.geojson`;
    const external = await loadGeoJSON(dataUrl);
    if (external?.features?.length) return external;
  } catch (error) {
    console.warn(error);
  }
  return createDemoNatureData();
}

async function initialize3D() {
  try {
    status.set('Kartenstil geladen · erzeuge Vegetation …');
    const data = await getNatureData();
    map.addLayer(createNatureLayer({ data, status }));
  } catch (error) {
    console.error(error);
    status.set(`3D-Fehler: ${errorMessage(error)}`, 'error');
  }
}

if (map?.isStyleLoaded()) {
  initialize3D();
} else {
  map?.once('style.load', initialize3D);
}

map?.on('error', (event) => {
  console.error(event.error ?? event);
  status.set(`MapLibre-Fehler: ${errorMessage(event.error ?? event)}`, 'error');
});
