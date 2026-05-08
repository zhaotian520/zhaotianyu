import { useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types';
import { useFormStore } from '@/stores/formStore';
import { useProcessingStore } from '@/stores/processingStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { generateCopy } from '@/services/aiService';
import { generateSubtitles } from '@/services/subtitleService';
import { generateVoiceover } from '@/services/audioService';
import {
  getVideoDuration, mixAudio, burnSubtitles, finalAssembly,
} from '@/services/videoService';
import { cleanupTempDir, ensureTempDir } from '@/utils/file';
import { getFontPath } from '@/utils/font';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Processing'>;

export function useVideoProcessing() {
  const navigation = useNavigation<Nav>();
  const cancelledRef = useRef(false);
  const {
    setStatus, setProgress, setCurrentStep, setError, setResultUri, setScript,
  } = useProcessingStore.getState();

  // We need to destructure these lazily from the stores
  const runPipeline = useCallback(async () => {
    cancelledRef.current = false;
    const form = useFormStore.getState();
    const settings = useSettingsStore.getState();

    setStatus('processing');
    setProgress(0);
    setCurrentStep(0);
    setError(null);
    setResultUri(null);

    let tempFiles: string[] = [];
    let dir = '';

    try {
      // Step 0: Ensure temp dir
      if (cancelledRef.current) return;
      await ensureTempDir();
      setCurrentStep(0);
      setProgress(5);

      // Step 1: Get video duration
      if (cancelledRef.current) return;
      setCurrentStep(1);
      setProgress(10);
      const videoPath = form.videoUri!;
      const duration = await getVideoDuration(videoPath);
      const targetDuration = Math.min(duration, 600); // max 10 min

      // Step 2: Generate AI script
      if (cancelledRef.current) return;
      setCurrentStep(2);
      setProgress(15);
      const scriptResult = await generateCopy(
        form.propertyType,
        form.propertyInfo,
        targetDuration
      );
      const script = scriptResult.content;
      setScript(script);

      // Step 3: Generate subtitles
      if (cancelledRef.current) return;
      setCurrentStep(3);
      setProgress(25);
      const { segments } = generateSubtitles(script, targetDuration);

      // Step 4: TTS
      if (cancelledRef.current) return;
      setCurrentStep(4);
      setProgress(35);
      const ttsFile = await generateVoiceover(segments);
      if (ttsFile) tempFiles.push(ttsFile);

      // Step 5: Mix audio (TTS + BGM)
      if (cancelledRef.current) return;
      setCurrentStep(5);
      setProgress(55);
      const bgmUri = form.bgm.id !== 'none' ? form.bgm.uri ?? null : null;
      let audioMix: string | null = null;
      if (ttsFile && bgmUri) {
        try {
          dir = await ensureTempDir();
          audioMix = `${dir}mixed.mp3`;
          await mixAudio(ttsFile, bgmUri, targetDuration, audioMix);
          tempFiles.push(audioMix);
        } catch {
          audioMix = ttsFile;
        }
      } else if (ttsFile) {
        audioMix = ttsFile;
      } else if (bgmUri) {
        try {
          dir = await ensureTempDir();
          const bgmOnly = `${dir}bgm_only.mp3`;
          const { generateBgmOnly } = await import('@/services/videoService');
          await generateBgmOnly(bgmUri, targetDuration, bgmOnly);
          audioMix = bgmOnly;
          tempFiles.push(bgmOnly);
        } catch {}
      }

      // Step 6: Burn subtitles
      if (cancelledRef.current) return;
      setCurrentStep(6);
      setProgress(70);
      dir = await ensureTempDir();
      const subtitledVideo = `${dir}subtitled.mp4`;
      const fontPath = await getFontPath();
      await burnSubtitles(videoPath, segments, fontPath, subtitledVideo);
      tempFiles.push(subtitledVideo);

      // Step 7: Final assembly
      if (cancelledRef.current) return;
      setCurrentStep(7);
      setProgress(85);
      const finalVideo = `${dir}final.mp4`;
      if (audioMix) {
        await finalAssembly(subtitledVideo, audioMix, targetDuration, finalVideo);
      } else {
        // No audio, just use subtitled video
        const { copyAsync } = await import('expo-file-system/legacy');
        await copyAsync({ from: subtitledVideo, to: finalVideo });
      }

      // Step 8: Cleanup
      setCurrentStep(8);
      setProgress(95);
      // Keep final video, remove intermediate temp dirs
      // Temp dir will be cleaned on next run

      setProgress(100);
      setResultUri(finalVideo);
      setStatus('completed');
    } catch (err) {
      if (cancelledRef.current) {
        setStatus('cancelled');
      } else {
        const msg = err instanceof Error ? err.message : '处理失败，请重试';
        setError(msg);
        setStatus('failed');
      }
    }
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    cleanupTempDir();
    setStatus('cancelled');
  }, []);

  const retry = useCallback(() => {
    runPipeline();
  }, [runPipeline]);

  const goHome = useCallback(() => {
    useProcessingStore.getState().reset();
    navigation.navigate('Home');
  }, [navigation]);

  return { runPipeline, cancel, retry, goHome, cancelledRef };
}
