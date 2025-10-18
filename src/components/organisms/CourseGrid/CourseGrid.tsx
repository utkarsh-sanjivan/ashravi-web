import CourseCard from '@/components/molecules/CourseCard';

import type { Course } from '@/types';

import './index.css';

export interface CourseGridProps {
  courses: Course[];
}

export default function CourseGrid({ courses }: CourseGridProps) {
  return (
    <div className="course-grid">
      {courses.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  );
}
