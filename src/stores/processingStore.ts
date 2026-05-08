import { create } from 'zustand';

export type ProcessStatus = 'idle' | 'processing' | 'completed' | 'failed' | 'cancelled';

interface ProcessingState {
  status: ProcessStatus;
  progress: number;
  currentStep: number;
  error: string | null;
  resultUri: string | null;
  script: string;

  setStatus: (status: ProcessStatus) => void;
  setProgress: (progress: number) => void;
  setCurrentStep: (step: number) => void;
  setError: (error: string | null) => void;
  setResultUri: (uri: string | null) => void;
  setScript: (script: string) => void;
  reset: () => void;
}

const initialState = {
  status: 'idle' as ProcessStatus,
  progress: 0,
  currentStep: 0,
  error: null,
  resultUri: null,
  script: '',
};

export const useProcessingStore = create<ProcessingState>((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setError: (error) => set({ error }),
  setResultUri: (resultUri) => set({ resultUri }),
  setScript: (script) => set({ script }),
  reset: () => set(initialState),
}));
