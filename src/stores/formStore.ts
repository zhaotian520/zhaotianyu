import { create } from 'zustand';
import type { PropertyInfo, PropertyType, BGMConfig } from '@/types';

interface FormState {
  propertyType: PropertyType;
  propertyInfo: PropertyInfo;
  videoUri: string | null;
  coverUri: string | null;
  bgm: BGMConfig;
  speechRate: number;

  setPropertyType: (type: PropertyType) => void;
  setPropertyInfo: (info: Partial<PropertyInfo>) => void;
  setVideoUri: (uri: string | null) => void;
  setCoverUri: (uri: string | null) => void;
  setBgm: (bgm: BGMConfig) => void;
  setSpeechRate: (rate: number) => void;
  reset: () => void;
}

const initialState = {
  propertyType: '二手买卖' as PropertyType,
  propertyInfo: { communityName: '', area: '', orientation: '', price: '', highlights: '' },
  videoUri: null,
  coverUri: null,
  bgm: { id: 'none', name: '无背景音乐' },
  speechRate: 0.85,
};

export const useFormStore = create<FormState>((set) => ({
  ...initialState,

  setPropertyType: (propertyType) => set({ propertyType }),
  setPropertyInfo: (info) => set((s) => ({ propertyInfo: { ...s.propertyInfo, ...info } })),
  setVideoUri: (videoUri) => set({ videoUri }),
  setCoverUri: (coverUri) => set({ coverUri }),
  setBgm: (bgm) => set({ bgm }),
  setSpeechRate: (speechRate) => set({ speechRate }),
  reset: () => set(initialState),
}));
