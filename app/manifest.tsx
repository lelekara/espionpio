import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SpyPio',
    short_name: 'SpyPio',
    description: 'Application de gestion des scouts et de la boutique',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffffff', // blanc (cohérent avec le design)
    theme_color: '#ffffffff', // blanc (cohérent avec le design)
    icons: [
      {
        src: '/logo-pino.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo-pino.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
