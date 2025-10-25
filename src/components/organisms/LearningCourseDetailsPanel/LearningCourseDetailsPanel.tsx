import Button from '@/components/atoms/Button';

import type { LectureItem } from '@/components/organisms/LearningShared/types';
import type { PDFMetadata, Section } from '@/types';

import './index.css';

interface LearningCourseDetailsPanelProps {
  activeLecture?: LectureItem;
  activeSection?: Section;
  completionRatio: number;
  resources: PDFMetadata[];
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const formatResourceSize = (size?: number) => {
  if (!size || !Number.isFinite(size)) {
    return '';
  }
  return `${Math.round(size / 1024)} KB`;
};

export default function LearningCourseDetailsPanel({
  activeLecture,
  activeSection,
  completionRatio,
  resources,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: LearningCourseDetailsPanelProps) {
  return (
    <section className="learning-course-details">
      <div className="learning-course-details-header">
        <div>
          <p className="learning-details-subtitle">{activeSection?.title ?? 'Current lecture'}</p>
          <h2>{activeLecture?.title ?? 'Lecture overview'}</h2>
        </div>
        <div className="learning-navigation">
          <Button variant="secondary" size="sm" onClick={onPrevious} disabled={!hasPrevious}>
            Previous
          </Button>
          <Button variant="primary" size="sm" onClick={onNext} disabled={!hasNext}>
            Next
          </Button>
        </div>
      </div>

      {activeLecture?.description && (
        <p className="learning-details-description">{activeLecture.description}</p>
      )}

      <div className="learning-course-summary">
        <div>
          <span className="learning-summary-label">Duration</span>
          <span className="learning-summary-value">
            {activeLecture?.durationLabel ?? 'Self-paced'}
          </span>
        </div>
        <div>
          <span className="learning-summary-label">Progress</span>
          <span className="learning-summary-value">{Math.round(completionRatio * 100)}%</span>
          <div className="learning-progress-bar" aria-hidden>
            <div
              className="learning-progress-bar-fill"
              style={{ width: `${Math.min(100, Math.round(completionRatio * 100))}%` }}
            />
          </div>
        </div>
      </div>

      <div className="learning-details-grid">
        <section className="learning-panel">
          <h3>Resources</h3>
          {resources.length === 0 ? (
            <p className="learning-panel-empty">No downloadable resources for this lecture.</p>
          ) : (
            <ul className="learning-resource-list">
              {resources.map((resource) => (
                <li key={resource._id}>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    {resource.filename}
                    {resource.size ? ` (${formatResourceSize(resource.size)})` : ''}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}
