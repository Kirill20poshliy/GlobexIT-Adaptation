import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'


export default ({ mode }: {mode: string}) => {
  const isProduction = mode === 'production'

  return defineConfig({
    plugins: [
      react(),
      nodePolyfills()
    ],
    base: isProduction ? '/adaptations/subdivisions/frontend/dist/' : '/'
  })
  
} 
