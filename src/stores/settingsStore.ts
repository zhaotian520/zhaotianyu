import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { PropertyType } from '@/types';

const DEFAULT_PROMPTS: Record<PropertyType, string> = {
  租赁: '你是一个专业的租赁房产视频文案创作助手。请根据房源信息，生成适合配音的文案。要求：1. 语言生动有感染力 2. 字数控制在300字以内 3. 5-8个分句 4. 突出性价比和便利性',
  二手买卖: '你是一个专业的二手房视频文案创作助手。请根据房源信息，生成适合配音的文案。要求：1. 语言生动有感染力 2. 字数控制在300字以内 3. 5-8个分句 4. 突出户型优势和居住品质',
  新房买卖: '你是一个专业的新房视频文案创作助手。请根据房源信息，生成适合配音的文案。要求：1. 语言生动有感染力 2. 字数控制在300字以内 3. 5-8个分句 4. 突出开发商品牌和未来潜力',
};

interface SettingsState {
  glmApiKey: string;
  speechRate: number;
  prompts: Record<PropertyType, string>;
  _hasHydrated: boolean;
}

interface SettingsActions {
  setGlmApiKey: (key: string) => Promise<void>;
  loadApiKey: () => Promise<void>;
  clearApiKey: () => Promise<void>;
  setSpeechRate: (rate: number) => void;
  updatePrompt: (type: PropertyType, content: string) => void;
  resetPrompts: () => void;
  setHasHydrated: (v: boolean) => void;
}

type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      glmApiKey: '',
      speechRate: 0.85,
      prompts: { ...DEFAULT_PROMPTS },
      _hasHydrated: false,

      setGlmApiKey: async (key: string) => {
        if (key) {
          await SecureStore.setItemAsync('glm_api_key', key);
        } else {
          await SecureStore.deleteItemAsync('glm_api_key');
        }
        set({ glmApiKey: key });
      },

      loadApiKey: async () => {
        try {
          const key = await SecureStore.getItemAsync('glm_api_key');
          if (key) set({ glmApiKey: key });
        } catch {}
      },

      clearApiKey: async () => {
        await SecureStore.deleteItemAsync('glm_api_key');
        set({ glmApiKey: '' });
      },

      setSpeechRate: (speechRate) => set({ speechRate }),
      updatePrompt: (type, content) =>
        set((s) => ({ prompts: { ...s.prompts, [type]: content } })),
      resetPrompts: () => set({ prompts: { ...DEFAULT_PROMPTS } }),
      setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: 'app-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        speechRate: state.speechRate,
        prompts: state.prompts,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    }
  )
);
