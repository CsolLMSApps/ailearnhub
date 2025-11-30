import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ailearnhub.io'
  const currentDate = new Date()

  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // Main Pages
    {
      url: `${baseUrl}/courses`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // Course Pages
    {
      url: `${baseUrl}/courses/chatgpt-mastery`,
      lastModified: new Date('2024-11-29'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/courses/ai-for-beginners`,
      lastModified: new Date('2024-11-29'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/courses/social-media-marketing-ai`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // Legal Pages
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2024-11-28'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2024-11-28'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date('2024-11-28'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date('2024-11-28'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-settings`,
      lastModified: new Date('2024-11-30'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/affiliate-agreement`,
      lastModified: new Date('2024-11-28'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    // Auth Pages (noindex via meta, but included for completeness)
    {
      url: `${baseUrl}/login`,
      lastModified: new Date('2024-11-30'),
      changeFrequency: 'yearly',
      priority: 0.1,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date('2024-11-30'),
      changeFrequency: 'yearly',
      priority: 0.1,
    },
  ]
}
