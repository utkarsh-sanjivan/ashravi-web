export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ashravi',
  description: 'Evidence-based child behavior learning platform',
  url: 'https://ashravi.com',
  logo: 'https://ashravi.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-0100',
    contactType: 'Customer Support',
    email: 'support@ashravi.com',
  },
  sameAs: [
    'https://facebook.com/ashravi',
    'https://twitter.com/ashravi',
    'https://linkedin.com/company/ashravi',
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Ashravi',
  url: 'https://ashravi.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://ashravi.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export function getCourseSchema(course: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: 'Ashravi',
      sameAs: 'https://ashravi.com',
    },
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'USD',
    },
    aggregateRating: course.rating ? {
      '@type': 'AggregateRating',
      ratingValue: course.rating,
      reviewCount: course.reviewCount,
    } : undefined,
  };
}
