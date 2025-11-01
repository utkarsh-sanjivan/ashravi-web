import type { ChangeEvent } from 'react';

import SearchIcon from '@/components/icons/SearchIcon';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';
import CheckmarkIcon from '@/components/icons/CheckmarkIcon';
import { VideoIcon, PdfIcon, TestIcon } from '@/components/icons';

import type { LectureItem, CourseSection } from '@/components/organisms/LearningShared/types';

import './index.css';

interface LearningCurriculumPanelProps {
  courseTitle: string;
  completionRatio: number;
  sections: CourseSection[];
  lectures: LectureItem[];
  activeLectureId?: string;
  completedLectureIds: Set<string>;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onLectureSelect: (lectureId: string) => void;
  variant?: 'card' | 'embedded';
}

const resolveMediaUrl = (url?: string | null): string | undefined => {
  if (!url || typeof url !== 'string') {
    return undefined;
  }

  if (url.startsWith('http')) {
    return url;
  }

  const base = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '') ?? '';
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

const renderLectureMedia = (lecture: LectureItem) => {
  if (lecture.type === 'video') {
    const thumbnailUrl = resolveMediaUrl(lecture.video?.thumbnail);
    if (thumbnailUrl) {
      return (
        <img
          src={thumbnailUrl}
          alt=""
          aria-hidden="true"
          className="learning-lecture-thumbnail"
        />
      );
    }

    return (
      <span className="learning-lecture-media-icon">
        <VideoIcon width={18} height={18} />
      </span>
    );
  }

  if (lecture.type === 'quiz') {
    return (
      <span className="learning-lecture-media-icon">
        <TestIcon width={18} height={18} />
      </span>
    );
  }

  return (
    <span className="learning-lecture-media-icon">
      <PdfIcon width={18} height={18} />
    </span>
  );
};

export default function LearningCurriculumPanel(props: LearningCurriculumPanelProps) {
  const {
    courseTitle,
    completionRatio,
    sections,
    lectures,
    activeLectureId,
    completedLectureIds,
    searchQuery,
    onSearchChange,
    onLectureSelect,
    variant = 'card',
  } = props;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const sectionLectureMap = sections.map((section) => ({
    section,
    items: lectures.filter((lecture) => lecture.sectionId === section._id),
  })).filter((entry) => entry.items.length > 0);

  const containerClassName =
    variant === 'embedded'
      ? 'learning-curriculum-card learning-curriculum-card--embedded'
      : 'learning-curriculum-card';

  return (
    <section className={containerClassName} aria-label="Course navigation">
      <div className="learning-sidebar-header">
        <div>
          <p className="learning-sidebar-title">{courseTitle}</p>
          <p className="learning-sidebar-progress">{Math.round(completionRatio * 100)}% completed</p>
        </div>
      </div>

      <div className="learning-sidebar-search">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search lectures"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="learning-curriculum">
        {sectionLectureMap.map(({ section, items }, index) => (
          <details key={section?._id ?? `${section?.title}-${index}`} open>
            <summary>
              <span>{section?.title ?? `Section ${index + 1}`}</span>
              <ChevronDownIcon width={16} height={16} />
            </summary>
            <ul>
              {items.map((lecture) => {
                const isActive = lecture.id === activeLectureId;
                const isCompleted = completedLectureIds.has(lecture.id);
                return (
                  <li key={lecture.id}>
                  <button
                    type="button"
                    className={`learning-lecture-button ${isActive ? 'learning-lecture-button--active' : ''}`}
                    onClick={() => onLectureSelect(lecture.id)}
                    disabled={lecture.isLocked}
                  >
                    <span className="learning-lecture-media">
                      {renderLectureMedia(lecture)}
                    </span>
                    <span className="learning-lecture-info">
                      <span className="learning-lecture-title">{lecture.title}</span>
                      {lecture.durationLabel && (
                        <span className="learning-lecture-duration">{lecture.durationLabel}</span>
                      )}
                    </span>
                    <span className="learning-lecture-status">
                      {lecture.isLocked
                        ? '🔒'
                        : isCompleted
                        ? <CheckmarkIcon width={14} height={14} />
                        : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          </details>
        ))}
      </div>
    </section>
  );
}
