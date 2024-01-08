import { defineConfig } from 'tsup'
import react18Plugin from 'esbuild-plugin-react18'
import cssModulePlugin from 'esbuild-plugin-css-module'

export default defineConfig({
  entry: {
    chatbox: './components/widget/index.tsx',
    admin: './components/admin/index.tsx',
    api: './components/api.ts',
    style: './components/style.tsx',
  },
  format: ['cjs', 'esm'],
  clean: true,
  bundle: true,
  dts: true,
  plugins: [react18Plugin(), cssModulePlugin()],
})
