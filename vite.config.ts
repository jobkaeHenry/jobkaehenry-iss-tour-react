import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cesium from "vite-plugin-cesium";
import gltf from "vite-plugin-gltf";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cesium(), gltf()],
});
