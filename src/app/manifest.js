import { profile, seo } from '../data/profile'

export default function manifest() {
  return {
    name: `${profile.name} Portfolio`,
    short_name: profile.firstName,
    description: seo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#050607',
    theme_color: '#050607',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
