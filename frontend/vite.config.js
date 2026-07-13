import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const buildVersion = Date.now().toString(36);

function versionManifest() {
  return {
    name: 'bugboard-version-manifest',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version: buildVersion })
      });
    }
  };
}

export default defineConfig({
  define: {
    __BUGBOARD_BUILD_VERSION__: JSON.stringify(buildVersion)
  },
  plugins: [react(), versionManifest()],
  server: { port: 5173 },
  preview: { port: 4173 }
});
