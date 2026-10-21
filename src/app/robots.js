import { seo } from '../data/profile'

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${seo.siteUrl}/sitemap.xml`,
    host: seo.siteUrl,
  }
}
