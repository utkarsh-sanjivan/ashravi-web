import Link from 'next/link';

import ChevronDownIcon from '@/components/icons/ChevronDownIcon';
import { VideoIcon, DocumentIcon, QuizIcon } from '@/components/icons';

import type { Section } from '@/types';

interface CourseSidebarProps {
  courseId: string;
  sections: Section[];
  totalSections: number;
  lessonCount: number;
  durationLabel: string;
  lastUpdatedLabel: string;
  languageLabel: string;
  levelLabel: string;
  instructor?: {
    name?: string;
    credentials?: string;
    avatar?: string;
    bio?: string;
  } | null;
}

interface CurriculumEntry {
  id?: string;
  title: string;
  duration?: string;
  type: 'video' | 'quiz' | 'resource';
  isPreview?: boolean;
}

const getLectureLink = (courseId: string, lectureId?: string) =>
  lectureId ? `/learn/${courseId}?lectureId=${lectureId}` : `/learn/${courseId}`;

const resolveEntries = (section: Section): CurriculumEntry[] => {
  const entries: CurriculumEntry[] = [];

  section.videos?.forEach((video) => {
    entries.push({
      id: video?._id,
      title: video?.title ?? 'Video lesson',
      duration:
        typeof video?.duration === 'number' && video.duration > 0
          ? `${Math.round(video.duration / 60)}m`
          : undefined,
      type: 'video',
      isPreview: Boolean(video?.isFree),
    });
  });

  if (section.test) {
    entries.push({
      id: section.test._id,
      title: section.test.title ?? 'Quiz',
      duration: section.test.duration ? `${section.test.duration}m` : undefined,
      type: 'quiz',
    });
  }

  section.pdfs?.forEach((resource) => {
    entries.push({
      id: resource?._id,
      title: resource?.filename ?? 'Resource',
      duration:
        typeof resource?.size === 'number'
          ? `${Math.max(1, Math.round(resource.size / 1024))} KB`
          : undefined,
      type: 'resource',
    });
  });

  return entries;
};

const renderTypeIcon = (type: CurriculumEntry['type']) => {
  switch (type) {
    case 'video':
      return <VideoIcon width={16} height={16} />;
    case 'quiz':
      return <QuizIcon width={16} height={16} />;
    case 'resource':
    default:
      return <DocumentIcon width={16} height={16} />;
  }
};

import './index.css';

export default function CourseSidebar({
  courseId,
  sections,
  totalSections,
  lessonCount,
  durationLabel,
  lastUpdatedLabel,
  languageLabel,
  levelLabel,
  instructor,
}: CourseSidebarProps) {
  return (
    <aside className="course-detail-sidebar" aria-label="Course summary">
      {sections.length > 0 && (
        <div className="course-detail-curriculum-card">
          <div className="course-detail-curriculum-header">
            <h2>Course content</h2>
            <span>
              {totalSections} sections • {lessonCount} lessons
            </span>
          </div>
          <div className="course-detail-accordion">
            {sections.map((section, index) => {
              const entries = resolveEntries(section);
              if (entries.length === 0) {
                return null;
              }

              return (
                <details key={section?._id ?? `${section?.title}-${index}`} open={index === 0}>
                  <summary>
                    <span>{section?.title ?? `Section ${index + 1}`}</span>
                    <ChevronDownIcon />
                  </summary>
                  <ul>
                    {entries.map((entry, entryIndex) => (
                      <li key={entry.id ?? `${section?._id ?? index}-${entryIndex}`}>
                        <Link href={getLectureLink(courseId, entry.id)} className="course-detail-lecture-item">
                          <span className="course-detail-lecture-icon-wrapper">
                            {renderTypeIcon(entry.type)}
                          </span>
                          <span className="course-detail-lecture-title">{entry.title}</span>
                          <span className="course-detail-lecture-meta">
                            {entry.duration && (
                              <span className="course-detail-lecture-duration">{entry.duration}</span>
                            )}
                            {entry.isPreview && <span className="course-detail-lecture-preview">Preview</span>}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              );
            })}
          </div>
        </div>
      )}

      <div className="course-detail-summary-card">
        <h2>Course details</h2>
        <ul>
          <li>
            <span className="course-detail-summary-label">Duration</span>
            <span className="course-detail-summary-value">{durationLabel}</span>
          </li>
          <li>
            <span className="course-detail-summary-label">Last updated</span>
            <span className="course-detail-summary-value">{lastUpdatedLabel}</span>
          </li>
          <li>
            <span className="course-detail-summary-label">Language</span>
            <span className="course-detail-summary-value">{languageLabel}</span>
          </li>
          <li>
            <span className="course-detail-summary-label">Level</span>
            <span className="course-detail-summary-value">{levelLabel}</span>
          </li>
        </ul>
      </div>

      {instructor && (
        <div className="course-detail-summary-card">
          <h2>Your instructor</h2>
          <div className="course-detail-instructor-info">
            {instructor.avatar && (
              <img
                src={instructor.avatar}
                alt={instructor.name ?? 'Instructor'}
                className="course-detail-instructor-avatar"
              />
            )}
            <div>
              <p className="course-detail-instructor-name">{instructor.name ?? 'Instructor'}</p>
              {instructor.credentials && (
                <p className="course-detail-instructor-credentials">{instructor.credentials}</p>
              )}
            </div>
          </div>
          {instructor.bio && <p className="course-detail-instructor-bio">{instructor.bio}</p>}
        </div>
      )}
    </aside>
  );
}
