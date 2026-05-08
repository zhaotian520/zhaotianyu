import type { SubtitleSegment } from '@/types';
import { ensureTempDir } from '@/utils/file';
import { concatAudios } from '@/services/videoService';
import { useFormStore } from '@/stores/formStore';

// Will be replaced by custom native module
let nativeTtsModule: any = null;

export function setTtsModule(module: any) {
  nativeTtsModule = module;
}

export async function synthesizeToFile(
  text: string,
  outputPath: string
): Promise<string> {
  if (nativeTtsModule?.synthesizeToFile) {
    try {
      await nativeTtsModule.synthesizeToFile(text, outputPath);
      return outputPath;
    } catch (err) {
      console.warn('Native TTS failed, falling back to empty audio', err);
      throw err;
    }
  }

  throw new Error('TTS module not available');
}

export async function generateVoiceover(
  segments: SubtitleSegment[]
): Promise<string | null> {
  // Set speech rate on TTS module
  if (nativeTtsModule?.setSpeechRate) {
    try {
      const rate = useFormStore.getState().speechRate;
      await nativeTtsModule.setSpeechRate(rate);
    } catch {}
  }

  const dir = await ensureTempDir();
  const audioFiles: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    const outputPath = `${dir}tts_${i}.wav`;
    try {
      await synthesizeToFile(segments[i].text, outputPath);
      audioFiles.push(outputPath);
    } catch {
      console.warn(`TTS segment ${i} failed, skipping`);
      continue;
    }
  }

  if (audioFiles.length === 0) {
    return null;
  }

  const fullPath = `${dir}tts_full.wav`;
  return concatAudios(audioFiles, fullPath);
}
