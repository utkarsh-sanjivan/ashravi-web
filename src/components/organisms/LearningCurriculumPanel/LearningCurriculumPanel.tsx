import type { ChangeEvent } from 'react';

import SearchIcon from '@/components/icons/SearchIcon';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';
import CheckmarkIcon from '@/components/icons/CheckmarkIcon';
import { VideoIcon, DocumentIcon, QuizIcon } from '@/components/icons';

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
}

const renderTypeIcon = (type: LectureItem['type']) => {
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

export default function LearningCurriculumPanel({
  courseTitle,
  completionRatio,
  sections,
  lectures,
  activeLectureId,
  completedLectureIds,
  searchQuery,
  onSearchChange,
  onLectureSelect,
}: LearningCurriculumPanelProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const sectionLectureMap = sections.map((section) => ({
    section,
    items: lectures.filter((lecture) => lecture.sectionId === section._id),
  })).filter((entry) => entry.items.length > 0);

  return (
    <section className="learning-curriculum-card" aria-label="Course navigation">
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
          <details
            key={section?._id ?? `${section?.title}-${index}`}
            open={items.some((item) => item.id === activeLectureId)}
          >
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
                      <span className="learning-lecture-status">
                        {lecture.isLocked
                          ? '🔒'
                          : isCompleted
                          ? <CheckmarkIcon width={14} height={14} />
                          : renderTypeIcon(lecture.type)}
                      </span>
                      <span className="learning-lecture-info">
                        <span className="learning-lecture-title">{lecture.title}</span>
                        {lecture.durationLabel && (
                          <span className="learning-lecture-duration">{lecture.durationLabel}</span>
                        )}
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
