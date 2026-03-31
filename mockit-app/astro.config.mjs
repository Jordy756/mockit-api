// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "JetBrains Mono",
      provider: fontProviders.google(),
      cssVariable: "--font-jetbrains-mono",
      weights: [300, 400, 500, 700],
      subsets: ["latin"],
      styles: ["normal"],
      display: "swap",
      formats: ["woff2"],
      fallbacks: ["sans-serif"],
    },
  ],
});
