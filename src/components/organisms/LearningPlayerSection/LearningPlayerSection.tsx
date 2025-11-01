import type { RefObject } from 'react';

import type { LectureItem } from '@/components/organisms/LearningShared/types';

import './index.css';

interface LearningPlayerSectionProps {
  activeLecture?: LectureItem;
  isVideoLecture: boolean;
  videoRef: RefObject<HTMLVideoElement>;
  videoUrl?: string;
  onTimeUpdate: () => void;
}

export default function LearningPlayerSection({
  activeLecture,
  isVideoLecture,
  videoRef,
  videoUrl,
  onTimeUpdate,
}: LearningPlayerSectionProps) {
  return (
    <section className="learning-player">
      {isVideoLecture && videoUrl ? (
        <video
          key={activeLecture?.id ?? 'learning-video'}
          ref={videoRef}
          className="learning-video"
          controls
          playsInline
          preload="metadata"
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
    </section>
  );
}
