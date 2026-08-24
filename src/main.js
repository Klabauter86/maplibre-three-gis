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
  status.set('Prüfe WebGL 2 …');
  const testCanvas = document.createElement('canvas');
  const testContext = testCanvas.getContext('webgl2');
  if (!testContext) {
    throw new Error('WebGL 2 ist in diesem Browser nicht verfügbar');
  }
  testContext.getExtension('WEBGL_lose_context')?.loseContext();

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

map?.on('load', async () => {
  status.set('Terrain geladen · erzeuge Vegetation …');
  await new Promise((resolve) => map.once('idle', resolve));
  const data = await getNatureData();
  map.addLayer(createNatureLayer({ data, status }));
});

map?.on('error', (event) => {
  console.error(event.error ?? event);
  status.set(`MapLibre-Fehler: ${errorMessage(event.error ?? event)}`, 'error');
});
