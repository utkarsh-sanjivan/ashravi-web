'use client';

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import PublicNavbar from '@/components/organisms/PublicNavbar';
import Footer from '@/components/organisms/Footer';
import Button from '@/components/atoms/Button';
import SpinnerIcon from '@/components/icons/SpinnerIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import CheckmarkIcon from '@/components/icons/CheckmarkIcon';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useFeatureModules } from '@/hooks/useFeatureModule';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { FeatureModuleKey } from '@/store/modules/registry';
import { coursesApi, useCourseDetailQuery } from '@/store/api/courses.api';
import { selectUserProfile } from '@/store/selectors/user.selectors';
import type { Course, Section, Video, PDFMetadata } from '@/types';

import './index.css';

export interface LearningPageProps {
  courseId: string;
}

type LectureType = 'video' | 'quiz' | 'resource';

interface LectureItem {
  id: string;
  title: string;
  description?: string;
  durationLabel?: string;
  type: LectureType;
  isLocked: boolean;
  sectionId: string;
  sectionTitle: string;
  video?: Video;
  resources?: PDFMetadata[];
}

const PLAYBACK_SPEEDS: number[] = [0.75, 1, 1.25, 1.5, 2];
const QUALITY_OPTIONS = ['Auto', '1080p', '720p'] as const;
const PROGRESS_THRESHOLD = 0.9;
const FALLBACK_VIDEO = 'https://storage.googleapis.com/ashravi-assets/videos/positive-parenting-preview.mp4';

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

const formatDurationLabel = (seconds?: number): string | undefined => {
  if (!seconds || !Number.isFinite(seconds) || seconds <= 0) {
    return undefined;
  }

  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
};

const flattenCourseLectures = (course: Course | undefined): LectureItem[] => {
  if (!course || !Array.isArray(course.sections)) {
    return [];
  }

  const lectures: LectureItem[] = [];

  (course.sections as Section[]).forEach((section) => {
    if (!section) {
      return;
    }

    if (Array.isArray(section.videos)) {
      section.videos.forEach((video) => {
        lectures.push({
          id: video._id ?? `${section._id}-video-${video.order}`,
          title: video.title ?? 'Video lesson',
          description: video.description,
          durationLabel: formatDurationLabel(video.duration),
          type: 'video',
          isLocked: Boolean(section.isLocked),
          sectionId: section._id,
          sectionTitle: section.title ?? 'Section',
          video,
          resources: section.pdfs ?? [],
        });
      });
    }

    if (section.test) {
      lectures.push({
        id: section.test._id ?? `${section._id}-quiz`,
        title: section.test.title ?? 'Quiz',
        description: section.test.description,
        durationLabel: section.test.duration ? `${section.test.duration}m` : undefined,
        type: 'quiz',
        isLocked: Boolean(section.isLocked),
        sectionId: section._id,
        sectionTitle: section.title ?? 'Section',
      });
    }

    if (Array.isArray(section.pdfs)) {
      section.pdfs.forEach((resource) => {
        lectures.push({
          id: resource._id ?? `${section._id}-resource-${resource.filename}`,
          title: resource.filename ?? 'Resource',
          description: `${Math.round(resource.size / 1024)} KB`,
          type: 'resource',
          isLocked: Boolean(section.isLocked),
          sectionId: section._id,
          sectionTitle: section.title ?? 'Section',
          resources: [resource],
        });
      });
    }
  });

  return lectures;
};

const getInitialLecture = (lectures: LectureItem[]): LectureItem | undefined =>
  lectures.find((lecture) => lecture.type === 'video' && !lecture.isLocked) ?? lectures[0];

const formatTimestamp = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function LearningPage({ courseId }: LearningPageProps) {
  const { isAuthenticated, isChecking } = useAuthGuard({ redirectTo: '/auth/login' });
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedLectureParam = searchParams?.get('lectureId');
  const requestedFeatures = useMemo<FeatureModuleKey[]>(
    () =>
      process.env.NODE_ENV !== 'production'
        ? (['courses', 'wishlist', 'mock'] as FeatureModuleKey[])
        : (['courses', 'wishlist'] as FeatureModuleKey[]),
    []
  );
  const featuresReady = useFeatureModules(requestedFeatures);

  const cachedCourse = coursesApi.endpoints.detail.useQueryState(courseId);
  const shouldFetch = !cachedCourse.data;
  const { isFetching: isFetchingFallback } = useCourseDetailQuery(courseId, {
    skip: !isAuthenticated || !shouldFetch,
  });

  const course = cachedCourse.data?.data;
  const userProfile = useAppSelector(selectUserProfile);

  const lectures = useMemo(() => flattenCourseLectures(course), [course]);
  const initialLecture = useMemo(() => getInitialLecture(lectures), [lectures]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeLectureId, setActiveLectureId] = useState<string | undefined>(
    initialLecture?.id
  );
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState<(typeof QUALITY_OPTIONS)[number]>('Auto');
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [completedLectures, setCompletedLectures] = useState<Set<string>>(new Set());
  const [markingLectureId, setMarkingLectureId] = useState<string | null>(null);
  const [notes, setNotes] = useState<
    Array<{ id: string; timestamp: number; text: string; lectureId: string }>
  >([]);
  const [noteDraft, setNoteDraft] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressPostedRef = useRef<Set<string>>(new Set());

  const activeLecture = useMemo(
    () => lectures.find((lecture) => lecture.id === activeLectureId) ?? initialLecture,
    [activeLectureId, lectures, initialLecture]
  );

  useEffect(() => {
    const requestedLectureId = selectedLectureParam;
    if (requestedLectureId && lectures.some((lecture) => lecture.id === requestedLectureId)) {
      setActiveLectureId(requestedLectureId);
      progressPostedRef.current.delete(requestedLectureId);
      return;
    }

    if (!initialLecture) {
      return;
    }

    setActiveLectureId((current) => current ?? initialLecture.id);
  }, [initialLecture?.id, initialLecture, lectures, selectedLectureParam]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!videoRef.current) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case ' ':
        case 'spacebar':
          event.preventDefault();
          if (videoRef.current.paused) {
            void videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
          break;
        case 'arrowright':
          videoRef.current.currentTime += 5;
          break;
        case 'arrowleft':
          videoRef.current.currentTime -= 5;
          break;
        case 'f':
          if (document.fullscreenElement) {
            void document.exitFullscreen();
          } else {
            void videoRef.current.requestFullscreen();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const filteredLectures = useMemo(() => {
    if (!searchQuery) {
      return lectures;
    }
    const normalized = searchQuery.trim().toLowerCase();
    return lectures.filter(
      (lecture) =>
        lecture.title.toLowerCase().includes(normalized) ||
        lecture.sectionTitle.toLowerCase().includes(normalized)
    );
  }, [lectures, searchQuery]);

  const completionRatio = useMemo(() => {
    if (lectures.length === 0) {
      return 0;
    }
    return completedLectures.size / lectures.length;
  }, [completedLectures.size, lectures.length]);

  const handleLectureSelect = (lectureId: string) => {
    setActiveLectureId(lectureId);
    progressPostedRef.current.delete(lectureId);
    router.push(`/learn/${courseId}?lectureId=${lectureId}`);
  };

  const markLectureComplete = useCallback(
    async (lectureId: string) => {
      if (!isAuthenticated || !userProfile?.id) {
        return;
      }

      setMarkingLectureId(lectureId);
      try {
        await fetch('/api/progress', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userProfile.id,
            courseId,
            lectureId,
            completedAt: new Date().toISOString(),
          }),
        });

        setCompletedLectures((prev) => new Set(prev).add(lectureId));
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[LearningPage] Failed to update progress', error);
        }
      } finally {
        setMarkingLectureId(null);
      }
    },
    [courseId, isAuthenticated, userProfile?.id]
  );

  const handleTimeUpdate = () => {
    if (!videoRef.current || !activeLecture || activeLecture.type !== 'video') {
      return;
    }

    const videoElement = videoRef.current;
    if (videoElement.duration && videoElement.currentTime / videoElement.duration >= PROGRESS_THRESHOLD) {
      if (!progressPostedRef.current.has(activeLecture.id)) {
        progressPostedRef.current.add(activeLecture.id);
        void markLectureComplete(activeLecture.id);
      }
    }
  };

  const handleAddNote = () => {
    if (!noteDraft.trim() || !activeLecture) {
      return;
    }

    const timestamp = videoRef.current?.currentTime ?? 0;
    setNotes((prev) => [
      ...prev,
      {
        id: `${activeLecture.id}-${Date.now()}`,
        timestamp,
        text: noteDraft.trim(),
        lectureId: activeLecture.id,
      },
    ]);
    setNoteDraft('');
  };

  const handleSeekToNote = (timestamp: number) => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.currentTime = timestamp;
    videoRef.current.focus();
  };

  const currentSectionResources: PDFMetadata[] =
    (activeLecture?.resources ?? []).filter((resource) => resource.url);
  const resolvedVideoUrl =
    resolveMediaUrl(activeLecture?.video?.videoUrl) ??
    resolveMediaUrl(activeLecture?.video?.thumbnail) ??
    FALLBACK_VIDEO;
  const isVideoLecture = activeLecture?.type === 'video' || Boolean(activeLecture?.video);

  const currentNotes = notes.filter((note) => note.lectureId === activeLecture?.id);

  const isLoadingState = isChecking || !featuresReady || (!course && isFetchingFallback);

  if (isLoadingState) {
    return (
      <div className="learning-page">
        <PublicNavbar />
        <main className="learning-main">
          <div className="learning-loading">
            <SpinnerIcon size={48} />
            <p>Preparing your learning experience...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course || lectures.length === 0 || !activeLecture) {
    return (
      <div className="learning-page">
        <PublicNavbar />
        <main className="learning-main">
          <div className="learning-error">
            <h1>Unable to open course</h1>
            <p>We could not load the course content right now. Please return to the course page.</p>
            <Link href={`/course/${courseId}`}>
              <Button variant="primary">Back to course</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const activeSection = course.sections.find((section) => section._id === activeLecture.sectionId);
  const activeLectureIndex = lectures.findIndex((lecture) => lecture.id === activeLecture.id);
  const previousLecture = activeLectureIndex > 0 ? lectures[activeLectureIndex - 1] : undefined;
  const nextLecture =
    activeLectureIndex >= 0 && activeLectureIndex < lectures.length - 1
      ? lectures[activeLectureIndex + 1]
      : undefined;

  return (
    <div className="learning-page">
      <PublicNavbar />
      <main className="learning-main">
        <div className="learning-container">
          <section className="learning-player">
            {isVideoLecture && resolvedVideoUrl ? (
                <video
                  key={activeLecture.id}
                  ref={videoRef}
                  className="learning-video"
                  controls
                  onTimeUpdate={handleTimeUpdate}
                  poster={activeLecture.video?.thumbnail}
                >
                  <source src={resolvedVideoUrl} type="video/mp4" />
                  {captionsEnabled && activeLecture.video?.description && (
                    <track
                      kind="subtitles"
                      srcLang="en"
                      label="English"
                      src={`data:text/vtt,WEBVTT\n\n00:00.000 --> 00:10.000\n${activeLecture.video?.description ?? ''}`}
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
                    onChange={(event) => setPlaybackRate(Number(event.target.value))}
                  >
                    {PLAYBACK_SPEEDS.map((speed) => (
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
                    onChange={(event) =>
                      setQuality(event.target.value as (typeof QUALITY_OPTIONS)[number])
                    }
                  >
                    {QUALITY_OPTIONS.map((option) => (
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
                    onChange={(event) => setCaptionsEnabled(event.target.checked)}
                  />
                  <span>Captions</span>
                </label>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => activeLecture && void markLectureComplete(activeLecture.id)}
                  loading={markingLectureId === activeLecture?.id}
                >
                  Mark complete
                </Button>
              </div>
          </section>

          <div className="learning-layout">
            <div className="learning-column learning-column--support">
              <section className="learning-course-details">
                <div className="learning-course-details-header">
                  <div>
                    <p className="learning-details-subtitle">
                      {activeSection?.title ?? 'Current lecture'}
                    </p>
                    <h2>{activeLecture.title}</h2>
                  </div>
                  <div className="learning-navigation">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => previousLecture && handleLectureSelect(previousLecture.id)}
                      disabled={!previousLecture}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => nextLecture && handleLectureSelect(nextLecture.id)}
                      disabled={!nextLecture}
                    >
                      Next
                    </Button>
                  </div>
                </div>

                {activeLecture.description && (
                  <p className="learning-details-description">{activeLecture.description}</p>
                )}

                <div className="learning-course-summary">
                  <div>
                    <span className="learning-summary-label">Duration</span>
                    <span className="learning-summary-value">
                      {activeLecture.durationLabel ?? formatDurationLabel(activeLecture.video?.duration) ?? 'Self-paced'}
                    </span>
                  </div>
                  <div>
                    <span className="learning-summary-label">Progress</span>
                    <span className="learning-summary-value">
                      {Math.round(completionRatio * 100)}%
                    </span>
                  </div>
                </div>

                <div className="learning-details-grid">
                  <section className="learning-panel">
                    <h3>Resources</h3>
                    {currentSectionResources.length === 0 ? (
                      <p className="learning-panel-empty">No downloadable resources for this lecture.</p>
                    ) : (
                      <ul className="learning-resource-list">
                        {currentSectionResources.map((resource) => (
                          <li key={resource._id}>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {resource.filename} ({Math.round(resource.size / 1024)} KB)
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  <section className="learning-panel">
                    <h3>Q&amp;A</h3>
                    <div className="learning-qa">
                      <div>
                        <p className="learning-qa-question">How do I apply this concept with younger kids?</p>
                        <p className="learning-qa-answer">
                          Focus on modeling and short practice sessions. Try the printable routine cards in the resources section.
                        </p>
                      </div>
                      <div>
                        <p className="learning-qa-question">Any recommended follow-up reading?</p>
                        <p className="learning-qa-answer">
                          Check the bonus PDF &ldquo;Connection Scripts&rdquo; which includes suggested books by age group.
                        </p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      Ask a question
                    </Button>
                  </section>
                </div>
              </section>
              
              <section className="learning-notes">
                <div className="learning-notes-header">
                  <h3>Notes</h3>
                  <span className="learning-notes-count">{currentNotes.length} saved</span>
                </div>
                <div className="learning-notes-form">
                  <textarea
                    placeholder="Write a note..."
                    value={noteDraft}
                    onChange={(event) => setNoteDraft(event.target.value)}
                  />
                  <Button variant="secondary" onClick={handleAddNote} disabled={!noteDraft.trim()}>
                    Add note
                  </Button>
                </div>

                <ul className="learning-notes-list">
                  {currentNotes.length === 0 ? (
                    <li className="learning-notes-empty">No notes yet.</li>
                  ) : (
                    currentNotes.map((note) => (
                      <li key={note.id}>
                        <button type="button" onClick={() => handleSeekToNote(note.timestamp)}>
                          {formatTimestamp(note.timestamp)}
                        </button>
                        <p>{note.text}</p>
                      </li>
                    ))
                  )}
                </ul>
              </section>
            </div>

            <div className="learning-column learning-column--primary">
              <section className="learning-curriculum-card" aria-label="Course navigation">
                <div className="learning-sidebar-header">
                  <div>
                    <p className="learning-sidebar-title">{course.title}</p>
                    <p className="learning-sidebar-progress">
                      {Math.round(completionRatio * 100)}% completed
                    </p>
                  </div>
                </div>

                <div className="learning-sidebar-search">
                  <SearchIcon />
                  <input
                    type="search"
                    placeholder="Search lectures"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>

                <div className="learning-curriculum">
                  {course.sections.map((section) => {
                    const isActiveSection = section?._id === activeLecture.sectionId;
                    const sectionLectures = filteredLectures.filter(
                      (lecture) => lecture.sectionId === section?._id
                    );
                    if (sectionLectures.length === 0) {
                      return null;
                    }

                    return (
                      <details key={section?._id ?? section?.title} open={isActiveSection}>
                        <summary>
                          <span>{section?.title ?? 'Section'}</span>
                          <ChevronDownIcon />
                        </summary>
                        <ul>
                          {sectionLectures.map((lecture) => {
                            const isCompleted = completedLectures.has(lecture.id);
                            const isCurrent = lecture.id === activeLecture.id;
                            return (
                              <li key={lecture.id}>
                                <button
                                  type="button"
                                  className={`learning-lecture-button ${
                                    isCurrent ? 'learning-lecture-button--active' : ''
                                  }`}
                                  onClick={() => handleLectureSelect(lecture.id)}
                                  disabled={lecture.isLocked}
                                >
                                  <span className="learning-lecture-status">
                                    {lecture.isLocked ? (
                                      <span className="learning-lecture-lock" aria-label="Locked lecture">
                                        🔒
                                      </span>
                                    ) : isCompleted ? (
                                      <CheckmarkIcon />
                                    ) : (
                                      <span className="learning-lecture-icon" aria-hidden />
                                    )}
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
                    );
                  })}
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
