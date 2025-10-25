import type { PDFMetadata, Section, Video } from '@/types';

export type LectureType = 'video' | 'quiz' | 'resource';

export interface LectureItem {
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

export interface CourseSection extends Section {}
