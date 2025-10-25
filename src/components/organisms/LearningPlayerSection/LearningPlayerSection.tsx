import type { RefObject } from 'react';

import Button from '@/components/atoms/Button';

import type { LectureItem } from '@/components/organisms/LearningShared/types';

import './index.css';

interface LearningPlayerSectionProps {
  activeLecture?: LectureItem;
  isVideoLecture: boolean;
  videoRef: RefObject<HTMLVideoElement>;
  videoUrl?: string;
  captionsEnabled: boolean;
  onToggleCaptions: (enabled: boolean) => void;
  playbackRate: number;
  onChangePlaybackRate: (value: number) => void;
  quality: string;
  onChangeQuality: (value: string) => void;
  playbackSpeedOptions: number[];
  qualityOptions: readonly string[];
  onTimeUpdate: () => void;
  onMarkComplete: () => void;
  markCompleteLoading: boolean;
}

export default function LearningPlayerSection({
  activeLecture,
  isVideoLecture,
  videoRef,
  videoUrl,
  captionsEnabled,
  onToggleCaptions,
  playbackRate,
  onChangePlaybackRate,
  quality,
  onChangeQuality,
  playbackSpeedOptions,
  qualityOptions,
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
          {captionsEnabled && activeLecture?.video?.description && (
            <track
              kind="subtitles"
              srcLang="en"
              label="English"
              src={`data:text/vtt,WEBVTT\n\n00:00.000 --> 00:10.000\n${activeLecture.video.description}`}
            />
          )}
        </video>
      ) : (
        <div className="learning-player-placeholder">
          <p>This lecture is not a video. Please review the resources below.</p>
        </div>
      )}

      <div className="learning-player-controls">
        <div className="learning-control-group">
          <label htmlFor="playback-speed">Speed</label>
          <select
            id="playback-speed"
            value={playbackRate}
            onChange={(event) => onChangePlaybackRate(Number(event.target.value))}
          >
            {playbackSpeedOptions.map((speed) => (
              <option key={speed} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </div>

        <div className="learning-control-group">
          <label htmlFor="quality">Quality</label>
          <select
            id="quality"
            value={quality}
            onChange={(event) => onChangeQuality(event.target.value)}
          >
            {qualityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <label className="learning-caption-toggle">
          <input
            type="checkbox"
            checked={captionsEnabled}
            onChange={(event) => onToggleCaptions(event.target.checked)}
          />
          <span>Captions</span>
        </label>

        <Button
          variant="secondary"
          size="sm"
          onClick={onMarkComplete}
          loading={markCompleteLoading}
        >
          Mark complete
        </Button>
      </div>
    </section>
  );
}
