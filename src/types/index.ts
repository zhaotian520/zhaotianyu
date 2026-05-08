export type PropertyType = '租赁' | '二手买卖' | '新房买卖';

export interface PropertyInfo {
  communityName: string;
  area: string;
  orientation: string;
  price: string;
  highlights: string;
}

export interface VideoAsset {
  uri: string;
  duration: number;
}

export interface CoverImage {
  uri: string;
}

export interface ProcessingResult {
  videoUri: string;
  script: string;
  audioUri: string;
}

export interface PromptTemplate {
  id: string;
  type: PropertyType;
  content: string;
}

export interface BGMConfig {
  id: string;
  name: string;
  uri?: string;
}

export interface BGMItem {
  id: string;
  name: string;
  description: string;
}

export interface SubtitleSegment {
  text: string;
  startTime: number;
  endTime: number;
}

export interface ProcessingStage {
  id: string;
  label: string;
  progress: number;
}

export type SpeechEngine = 'youdao' | 'google' | 'system';

export type RootStackParamList = {
  Home: undefined;
  Processing: undefined;
  Settings: undefined;
};
