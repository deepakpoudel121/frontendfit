import { defineConfig } from "@tanstack/start/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    preset: "vercel",
  },
  vite: {
    plugins: [tsconfigPaths()],
  },
});