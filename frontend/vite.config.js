import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  // Where the site lives on the web. GitHub Pages serves this repo from a sub-folder:
  //   https://justinesanchez1405.github.io/CT301-Websiteproject/
  // so the built site (npm run build) and its local test (npm run preview) use that
  // address. While developing (npm run dev) it stays at the root, "/".
  // If the repo is renamed, change this too.
  base: command === 'build' || isPreview ? '/CT301-Websiteproject/' : '/',
}))
