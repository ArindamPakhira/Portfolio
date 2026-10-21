import { seo } from '../data/profile'

export default function sitemap() {
  return [{ url: seo.siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }]
}
