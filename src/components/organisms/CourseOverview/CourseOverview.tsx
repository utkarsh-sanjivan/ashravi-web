import CheckmarkIcon from '@/components/icons/CheckmarkIcon';

import './index.css';

interface CourseOverviewProps {
  learningOutcomes: string[];
  description?: string;
  prerequisites: string[];
  targetAudience: string[];
}

export default function CourseOverview({
  learningOutcomes,
  description,
  prerequisites,
  targetAudience,
}: CourseOverviewProps) {
  const showOverview = Boolean(description) || prerequisites.length > 0 || targetAudience.length > 0;

  return (
    <>
      {learningOutcomes.length > 0 && (
        <section className="course-detail-panel">
          <h2>What you&apos;ll learn</h2>
          <ul className="course-detail-learning-list">
            {learningOutcomes.map((outcome) => (
              <li key={outcome}>
                <CheckmarkIcon className="course-detail-learning-icon" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {showOverview && (
        <section className="course-detail-panel">
          <h2>About this course</h2>
          {description && <p className="course-detail-description">{description}</p>}

          {prerequisites.length > 0 && (
            <div className="course-detail-stack">
              <h3>Prerequisites</h3>
              <ul className="course-detail-bullet-list">
                {prerequisites.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {targetAudience.length > 0 && (
            <div className="course-detail-stack">
              <h3>Who this course is for</h3>
              <ul className="course-detail-bullet-list">
                {targetAudience.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </>
  );
}
