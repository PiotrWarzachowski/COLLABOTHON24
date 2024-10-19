import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from "path";

export default defineConfig({
  plugins: [react({
    include: "**/*.tsx"
  })],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
  },
  server: {
    port: 8000, 
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:8080",
    watch: {
      usePolling: true
    }
    // Thanks @sergiomoura for the window fix
    // add the next lines if you're using windows and hot reload doesn't work
    //  watch: {
    //    usePolling: true
    //  }
  }
});
