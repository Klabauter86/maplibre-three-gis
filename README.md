# MapLibre 3D Terrain

Neu aufgesetzte MapLibre-only-Terrainkarte auf Basis des offiziellen
[MapLibre-3D-Terrain-Beispiels](https://maplibre.org/maplibre-gl-js/docs/examples/3d-terrain/).

## Current baseline

- OpenStreetMap-Rasterkarte
- getrennte Mapterhorn-Quellen für Terrain und Hillshade
- MapLibre `terrain`, `hillshade`, Himmel und Terrain-Control
- URL-Hash für Position, Zoom, Neigung und Drehung
- Vite development/build setup
- GitHub Codespaces/devcontainer port forwarding for port 5173

## Start locally

```bash
npm install
npm run dev
```

Open the URL shown by Vite. The dev script binds to `0.0.0.0`, which also works well in Codespaces.

## Build

```bash
npm run build
npm run preview
```

## Roadmap

1. Validate terrain and geospatial alignment.
2. Load real GeoJSON datasets.
3. Integrate OSM paths/buildings, LiDAR, PMTiles/PostGIS.

## Architecture

```text
src/
├── ui/
│   └── status.js
├── main.js
└── styles.css
```

## Notes

OpenStreetMap's public tile server is suitable for light development/demo usage but not as a production tile backend for heavy traffic. Replace it with an appropriate production tile provider or self-hosted tiles before scaling up.

## Entwicklung nur mit dem iPhone

Siehe [IPHONE_SETUP.md](./IPHONE_SETUP.md) für den empfohlenen Workflow mit GitHub Codespaces und Safari.
