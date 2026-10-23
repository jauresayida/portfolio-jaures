import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' : le site fonctionne aussi bien à la racine (Netlify, Vercel)
// que dans un sous-dossier (GitHub Pages : https://pseudo.github.io/portfolio/)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
