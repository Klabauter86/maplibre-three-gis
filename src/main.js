import './styles.css';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createStatus } from './ui/status.js';

const status = createStatus();

const map = new maplibregl.Map({
  container: 'map',
  zoom: 12,
  center: [11.39085, 47.27574],
  pitch: 70,
  hash: true,
  style: {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap Contributors',
        maxzoom: 19,
      },
      terrainSource: {
        type: 'raster-dem',
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        tileSize: 256,
        encoding: 'terrarium',
        maxzoom: 15,
        attribution: 'Terrain: AWS Open Data',
      },
      hillshadeSource: {
        type: 'raster-dem',
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        tileSize: 256,
        encoding: 'terrarium',
        maxzoom: 15,
        attribution: 'Terrain: AWS Open Data',
      },
    },
    layers: [
      {
        id: 'osm',
        type: 'raster',
        source: 'osm',
      },
      {
        id: 'hills',
        type: 'hillshade',
        source: 'hillshadeSource',
        layout: { visibility: 'visible' },
        paint: { 'hillshade-shadow-color': '#473B24' },
      },
    ],
    sky: {},
  },
  maxZoom: 18,
  maxPitch: 85,
});

map.addControl(
  new maplibregl.NavigationControl({
    visualizePitch: true,
    showZoom: true,
    showCompass: true,
  }),
);

map.addControl(
  new maplibregl.TerrainControl({
    source: 'terrainSource',
    exaggeration: 1.5,
  }),
);

map.on('load', () => {
  map.setTerrain({ source: 'terrainSource', exaggeration: 1.5 });
  status.set('MapLibre 3D-Terrain bereit', 'ready');
});

map.on('error', (event) => {
  const error = event.error ?? event;
  console.error(error);
  status.set(`MapLibre-Fehler: ${error?.message ?? error}`, 'error');
});
