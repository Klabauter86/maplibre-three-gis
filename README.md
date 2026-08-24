# MapLibre Terrain GIS

Browserbasierte Terrain-Karte mit MapLibre GL JS und Vite.

## Current baseline

- OpenStreetMap raster basemap
- Mapterhorn terrain tiles (`raster-dem`)
- MapLibre `raster-dem` terrain + hillshade
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
├── map/
│   ├── config.js
│   └── createMap.js
├── ui/
│   └── status.js
├── main.js
└── styles.css
```

## Notes

OpenStreetMap's public tile server is suitable for light development/demo usage but not as a production tile backend for heavy traffic. Replace it with an appropriate production tile provider or self-hosted tiles before scaling up.

## Entwicklung nur mit dem iPhone

Siehe [IPHONE_SETUP.md](./IPHONE_SETUP.md) für den empfohlenen Workflow mit GitHub Codespaces und Safari.
