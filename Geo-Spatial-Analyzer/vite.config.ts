import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 5173,        // default port
      strictPort: false, // automatically pick next free port if busy
      open: true,        // open browser automatically
      onListening: (server) => {
        const port = server.config.server.port;
        console.log(`Vite running on port ${port}`);
      }
    },
  };
});
