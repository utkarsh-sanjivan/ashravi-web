import type { RefObject } from 'react';

import Button from '@/components/atoms/Button';

import type { LectureItem } from '@/components/organisms/LearningShared/types';

import './index.css';

interface LearningPlayerSectionProps {
  activeLecture?: LectureItem;
  isVideoLecture: boolean;
  videoRef: RefObject<HTMLVideoElement>;
  videoUrl?: string;
  onTimeUpdate: () => void;
  onMarkComplete: () => void;
  markCompleteLoading: boolean;
}

export default function LearningPlayerSection({
  activeLecture,
  isVideoLecture,
  videoRef,
  videoUrl,
  onTimeUpdate,
  onMarkComplete,
  markCompleteLoading,
}: LearningPlayerSectionProps) {
  return (
    <section className="learning-player">
      {isVideoLecture && videoUrl ? (
        <video
          key={activeLecture?.id ?? 'learning-video'}
          ref={videoRef}
          className="learning-video"
          controls
          onTimeUpdate={onTimeUpdate}
          poster={activeLecture?.video?.thumbnail}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div className="learning-player-placeholder">
          <p>This lecture is not a video. Please review the resources below.</p>
        </div>
      )}

      <div className="learning-player-actions">
        <Button
          variant="secondary"
          size="sm"
          onClick={onMarkComplete}
          loading={markCompleteLoading}
        >
          Mark as Complete
        </Button>
      </div>
    </section>
  );
}
