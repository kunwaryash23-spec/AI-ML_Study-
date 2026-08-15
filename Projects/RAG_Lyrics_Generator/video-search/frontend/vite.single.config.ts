// Produces ONE self-contained index.html you can double-click — no server, no
// npm, no backend. It runs against the offline transcript sample, which is what
// the "Offline sample" badge in the header is telling you.
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    outDir: "dist-single",
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
