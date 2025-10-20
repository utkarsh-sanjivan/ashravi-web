import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AssessmentState {
  currentChildId: string | null;
  currentQuestionIndex: number;
  answers: Record<string, any>;
  completed: boolean;
}

const initialState: AssessmentState = {
  currentChildId: null,
  currentQuestionIndex: 0,
  answers: {},
  completed: false,
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    startAssessment: (state, action: PayloadAction<string>) => {
      state.currentChildId = action.payload;
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.completed = false;
    },
    setAnswer: (state, action: PayloadAction<{ questionId: string; answer: any }>) => {
      state.answers[action.payload.questionId] = action.payload.answer;
    },
    nextQuestion: (state) => {
      state.currentQuestionIndex += 1;
    },
    completeAssessment: (state) => {
      state.completed = true;
    },
    resetAssessment: (state) => {
      return initialState;
    },
  },
});

export const { startAssessment, setAnswer, nextQuestion, completeAssessment, resetAssessment } =
  assessmentSlice.actions;
export default assessmentSlice.reducer;
