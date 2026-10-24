import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import tailwindcss from '@tailwindcss/vite';

const fullReload = () => {
  return {
    name: 'full-reload',
    handleHotUpdate({ file, server }) {
      return [];
    },
    configureServer(server) {
      server.watcher.on('all', (event, file) => {
        if (event === 'change' || event === 'add' || event === 'unlink') {
          const symbol = { add: '[+]', unlink: '[-]', change: '[*]' }[event];
          const colors = { yellow: '\x1b[38;5;226m\x1b[1m', gray: '\x1b[38;5;248m', reset: '\x1b[0m' };
          const timestamp = new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });
          console.log(`${colors.gray}${timestamp}${colors.reset} ${colors.yellow}${symbol} ${file.split('/').pop()}${colors.reset}`);
          setTimeout(() => {
            server.openBrowser();
            console.log(`${colors.gray}${timestamp}${colors.reset} ${colors.yellow}✓ browser reloaded${colors.reset}`);
          }, 250);
        }
      });
    }
  };
};

export default defineConfig({
  server: {
    port: 2468,
    reload: true,
    proxy: {
      '/': {
        target: 'http://127.0.0.1:2368',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    origin: 'http://127.0.0.1:2368',
    open: '/',
  },
  build: {
    minify: 'esbuild',
    manifest: true,
    outDir: 'assets/built',
    assetsDir: 'assets/src',
    rollupOptions: {
      input: {
        app: 'assets/src/js/index.js',
        swiper: 'assets/src/js/swiper.js'
      },
      output: {
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].[ext]',
        entryFileNames: '[name].js'
      },
    },
  },
  esbuild: {
    minifyIdentifiers: false,
    keepNames: true,
  },
  plugins: [
    tailwindcss(),
    legacy({
      targets: ['defaults', 'not IE 11'],
      renderLegacyChunks: false
    }),
    fullReload()
  ]
})