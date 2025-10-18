export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
  explanation?: string;
}

export interface Assessment {
  id: string;
  childId: string;
  courseId: string;
  score: number;
  maxScore: number;
  completedAt: string;
  questions: AssessmentQuestion[];
  feedback?: string;
}
