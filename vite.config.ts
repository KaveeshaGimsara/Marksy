import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
// Plugin to stamp current build time into og:updated_time placeholder
function ogTimestampPlugin(): Plugin {
  return {
    name: 'html-og-updated-time',
    transformIndexHtml(html) {
      const iso = new Date().toISOString();
      return html.replace(/__OG_UPDATED_TIME__/g, iso);
    }
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), ogTimestampPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
