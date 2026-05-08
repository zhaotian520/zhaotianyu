export interface StepDef {
  id: string;
  label: string;
  progress: number;
}

export const PIPELINE_STEPS: StepDef[] = [
  { id: 'analyze', label: '正在获取视频时长...', progress: 5 },
  { id: 'script', label: '正在生成 AI 文案...', progress: 15 },
  { id: 'adjust', label: '正在调整文案长度...', progress: 20 },
  { id: 'tts', label: '正在生成配音音频...', progress: 30 },
  { id: 'mix', label: '正在混合背景音乐...', progress: 50 },
  { id: 'subtitle', label: '正在烧录字幕...', progress: 65 },
  { id: 'finalize', label: '正在合成最终视频...', progress: 80 },
  { id: 'cleanup', label: '正在清理临时文件...', progress: 95 },
] as const;
