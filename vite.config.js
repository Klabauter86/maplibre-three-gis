import { defineConfig } from 'vite';

export default defineConfig({
  base: '/maplibre-three-gis/',
  input: {
    app: 'index.html',
    threeTest: 'three-test.html',
  },
});
