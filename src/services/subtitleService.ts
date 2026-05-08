import type { SubtitleSegment } from '@/types';

export interface SubtitleResult {
  segments: SubtitleSegment[];
  totalDuration: number;
}

export function generateSubtitles(
  text: string,
  videoDuration: number
): SubtitleResult {
  const sentences = text
    .split(/[。！？.!?]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length === 0) {
    return { segments: [], totalDuration: 0 };
  }

  const avgDuration = videoDuration / sentences.length;
  let currentTime = 0;
  const segments: SubtitleSegment[] = [];

  for (let i = 0; i < sentences.length; i++) {
    const start = i === 0 ? 0 : currentTime;
    const end = i === sentences.length - 1
      ? videoDuration
      : Math.min(currentTime + avgDuration, videoDuration);

    segments.push({
      text: sentences[i],
      startTime: Math.round(start * 10) / 10,
      endTime: Math.round(end * 10) / 10,
    });

    currentTime = end;
  }

  return { segments, totalDuration: videoDuration };
}
