import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const maplibreDist = resolve(projectRoot, 'node_modules/maplibre-gl/dist');
const publicDir = resolve(projectRoot, 'public');

await mkdir(publicDir, { recursive: true });

await Promise.all([
  copyFile(
    resolve(maplibreDist, 'maplibre-gl-worker.mjs'),
    resolve(publicDir, 'maplibre-gl-worker.mjs'),
  ),
  copyFile(
    resolve(maplibreDist, 'maplibre-gl-shared.mjs'),
    resolve(publicDir, 'maplibre-gl-shared.mjs'),
  ),
]);

console.log('Copied MapLibre module worker files to public/.');
