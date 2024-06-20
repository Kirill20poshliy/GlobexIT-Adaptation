import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default ({ mode }: {mode: string}) => {
  const isProduction = mode === 'production'

  return defineConfig({
    plugins: [react()],
    base: isProduction ? '/adaptations/subdivisions/frontend/dist/' : '/'
  })
  
} 
