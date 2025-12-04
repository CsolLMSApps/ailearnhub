interface CourseStructuredDataProps {
  course: {
    title: string
    short_description: string
    long_description: string
    price_usd: number
    level: string
    total_hours: number
    slug: string
    category: string
  }
  modules: Array<{
    title: string
    description: string
    estimated_minutes: number
  }>
}

export default function CourseStructuredData({ course, modules }: CourseStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.short_description,
    provider: {
      '@type': 'Organization',
      name: 'AI Learn Hub',
      url: 'https://ailearnhub.io',
      logo: 'https://ailearnhub.io/logo-icon.svg',
      sameAs: [
        'https://twitter.com/DFWITJOBS1',
      ],
    },
    instructor: {
      '@type': 'Person',
      name: 'Srikanth Merianda',
      description: 'AI education expert and published author',
    },
    url: `https://ailearnhub.io/courses/${course.slug}`,
    courseCode: course.slug,
    educationalLevel: course.level,
    coursePrerequisites: course.level === 'beginner' ? 'None' : 'Basic computer skills',
    about: course.long_description,
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
    },
    teaches: course.category,
    timeRequired: `PT${course.total_hours}H`,
    numberOfCredits: 1,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '120',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      price: (course.price_usd / 100).toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://ailearnhub.io/courses/${course.slug}`,
      validFrom: '2024-01-01',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${course.total_hours}H`,
    },
    syllabusSections: modules.map((module, index) => ({
      '@type': 'Syllabus',
      name: module.title,
      description: module.description,
      position: index + 1,
      timeRequired: `PT${module.estimated_minutes}M`,
    })),
    inLanguage: 'en-US',
    availableLanguage: 'en-US',
    isAccessibleForFree: false,
    hasPart: modules.map((module, index) => ({
      '@type': 'LearningResource',
      name: module.title,
      description: module.description,
      position: index + 1,
      learningResourceType: 'module',
      timeRequired: `PT${module.estimated_minutes}M`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
