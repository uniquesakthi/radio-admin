import { defineConfig } from 'vite';

export default defineConfig({
    // Vite automatically serves index.html from root
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false
    },
    server: {
        port: 5173,
        open: true
    }
});
