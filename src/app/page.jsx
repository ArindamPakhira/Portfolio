import { profile, seo, introScene } from '../data/profile'
import App from '../App'

// Structured data for search engines. Social links are only included once you replace the placeholders.
const sameAs = Object.values(profile.socials).filter((u) => u && !u.includes('YOUR_USERNAME'))
const person = {
  '@type': 'Person',
  '@id': `${seo.siteUrl}/#person`,
  name: profile.name,
  url: seo.siteUrl,
  jobTitle: introScene.panel.role,
  description: seo.description,
  alumniOf: { '@type': 'CollegeOrUniversity', name: profile.education.school },
  knowsAbout: [...introScene.panel.skills, 'Frontend Development', 'Web Development', 'Mobile App Development'],
  ...(sameAs.length ? { sameAs } : {}),
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    person,
    {
      '@type': 'WebSite',
      '@id': `${seo.siteUrl}/#website`,
      url: seo.siteUrl,
      name: `${profile.name} Portfolio`,
      description: seo.description,
      inLanguage: 'en',
      publisher: { '@id': `${seo.siteUrl}/#person` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${seo.siteUrl}/#profile`,
      url: seo.siteUrl,
      name: seo.title,
      isPartOf: { '@id': `${seo.siteUrl}/#website` },
      mainEntity: { '@id': `${seo.siteUrl}/#person` },
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <App />
    </>
  )
}
