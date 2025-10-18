import { Metadata } from 'next';
import CourseListingPage from '@/components/pages/CourseListingPage';

export const metadata: Metadata = {
  title: 'Browse Courses | Ashravi Web',
  description: 'Discover the perfect parenting education course. Filter by price, duration, level, and rating to find courses that match your needs.',
  openGraph: {
    title: 'Browse Courses | Ashravi Web',
    description: 'Explore our comprehensive catalog of parenting education courses',
    type: 'website',
  },
};

export default function CoursesPage() {
  return <CourseListingPage />;
}
