import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    port: 5173,
    // Everything under /api is proxied to FastAPI, so the browser sees one
    // origin in dev and the frontend never hardcodes a backend URL.
    proxy: {
      "/api": { target: "http://127.0.0.1:8000", changeOrigin: true },
    },
  },
});
