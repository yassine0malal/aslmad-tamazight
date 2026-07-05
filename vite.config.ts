import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import path from "path"

// Use env var for GitHub Pages, fallback to "/" for local dev
const base = process.env.VITE_BASE_URL || "/"

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});