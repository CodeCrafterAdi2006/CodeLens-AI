// build-server.mjs
// This script replaces the raw esbuild CLI command in package.json.
// We use a JS config file here because esbuild alias mappings
// cannot be passed as CLI arguments — they must be wired programmatically.

import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve the project root directory (needed for absolute alias paths)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

await esbuild.build({
  // Entry point: the main server file
  entryPoints: ['server/server.ts'],

  // Bundle all imports into a single output file
  bundle: true,

  // Target Node.js environment (not a browser)
  platform: 'node',

  // Output the bundled file as a CommonJS module (.cjs)
  outfile: 'server.cjs',

  // Packages that should NOT be bundled (they'll be loaded at runtime from node_modules)
  // We exclude these because bundling native/compiled packages causes issues
  external: ['express', 'cors', 'jsonwebtoken', 'bcryptjs', 'dotenv'],

  // Native esbuild alias support: maps @server/* → ./server/* and @/* → ./src/*
  // This is the runtime equivalent of the tsconfig.json "paths" setting
  alias: {
    '@server': path.resolve(__dirname, 'server'),
    '@': path.resolve(__dirname, 'src'),
  },
});

console.log('✅ Server build complete → server.cjs');

