import './styles.css';
import { createMap } from './map/createMap.js';
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

function markMapReady() {
  status.set('MapLibre-Terrain bereit', 'ready');
}

if (map?.isStyleLoaded()) {
  markMapReady();
} else {
  map?.once('style.load', markMapReady);
}

map?.on('error', (event) => {
  console.error(event.error ?? event);
  status.set(`MapLibre-Fehler: ${errorMessage(event.error ?? event)}`, 'error');
});
