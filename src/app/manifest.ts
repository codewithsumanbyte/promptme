import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WTFprompt AI',
    short_name: 'WTFprompt',
    description: 'Discover Viral AI Prompts Before Everyone Else',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/wtf-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
