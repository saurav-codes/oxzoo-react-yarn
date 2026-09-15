import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// envPrefix exposes GREETING_* vars to the SPA at build time (baked into dist/).
export default defineConfig({
  plugins: [react()],
  root: "client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  envPrefix: ["GREETING_", "VITE_"],
});
