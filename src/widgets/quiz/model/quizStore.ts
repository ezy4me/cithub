export type QuizState = 'not_started' | 'in_progress' | 'completed';

export interface Answer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
}

export interface QuizStore {
  state: QuizState;
  currentQuestion: number;
  answers: Answer[];
  selectedAnswer: string | string[];
  showExplanation: boolean;
  inputValue: string;
  
  setState: (state: QuizState) => void;
  setCurrentQuestion: (index: number) => void;
  addAnswer: (answer: Answer) => void;
  setSelectedAnswer: (answer: string | string[]) => void;
  setShowExplanation: (show: boolean) => void;
  setInputValue: (value: string) => void;
  reset: () => void;
}

export function createQuizStore(): QuizStore {
  return {
    state: 'not_started',
    currentQuestion: 0,
    answers: [],
    selectedAnswer: '',
    showExplanation: false,
    inputValue: '',
    
    setState: function(state: QuizState) {
      this.state = state;
    },
    
    setCurrentQuestion: function(index: number) {
      this.currentQuestion = index;
    },
    
    addAnswer: function(answer: Answer) {
      this.answers.push(answer);
    },
    
    setSelectedAnswer: function(answer: string | string[]) {
      this.selectedAnswer = answer;
    },
    
    setShowExplanation: function(show: boolean) {
      this.showExplanation = show;
    },
    
    setInputValue: function(value: string) {
      this.inputValue = value;
    },
    
    reset: function() {
      this.state = 'not_started';
      this.currentQuestion = 0;
      this.answers = [];
      this.selectedAnswer = '';
      this.showExplanation = false;
      this.inputValue = '';
    }
  };
}
