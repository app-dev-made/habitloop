import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://habitloop-rosy.vercel.app'
  return [
    {
      url:            base,
      lastModified:   new Date(),
      changeFrequency: 'weekly',
      priority:       1.0,
    },
    {
      url:            `${base}/auth/login`,
      lastModified:   new Date(),
      changeFrequency: 'monthly',
      priority:       0.8,
    },
    {
      url:            `${base}/onboarding`,
      lastModified:   new Date(),
      changeFrequency: 'monthly',
      priority:       0.5,
    },
  ]
}
