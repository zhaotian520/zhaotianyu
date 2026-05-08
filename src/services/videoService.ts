import { FFmpegKit, FFprobeKit } from 'ffmpeg-kit-react-native';
import * as LegacyFS from 'expo-file-system/legacy';
import type { SubtitleSegment } from '@/types';
import { ensureTempDir } from '@/utils/file';

export interface VideoAnalysis {
  duration: number;
  width: number;
  height: number;
}

export async function getVideoDuration(videoPath: string): Promise<number> {
  const session = await FFprobeKit.getMediaInformation(videoPath);
  const info = session.getMediaInformation();
  if (info) {
    const duration = info.getDuration();
    if (duration != null) return duration;
  }
  throw new Error('无法获取视频时长');
}

export async function getVideoAnalysis(videoPath: string): Promise<VideoAnalysis> {
  const session = await FFprobeKit.getMediaInformation(videoPath);
  const info = session.getMediaInformation();
  if (!info) throw new Error('无法解析视频信息');
  const duration = info.getDuration() ?? 0;
  const streams = info.getStreams() ?? [];
  const videoStream = streams.find((s) => s.getType() === 'video');
  return {
    duration,
    width: videoStream?.getWidth() ?? 0,
    height: videoStream?.getHeight() ?? 0,
  };
}

export function escapeDrawtext(text: string): string {
  return text
    .replace(/'/g, "'\\''")
    .replace(/:/g, '\\:')
    .replace(/,/g, '\\,')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/!/g, '\\!');
}

export async function burnSubtitles(
  inputVideo: string,
  segments: SubtitleSegment[],
  fontPath: string,
  outputPath: string
): Promise<string> {
  if (segments.length === 0) {
    await LegacyFS.copyAsync({ from: inputVideo, to: outputPath });
    return outputPath;
  }

  const filterParts = segments.map((seg) => {
    const text = escapeDrawtext(seg.text);
    return `drawtext=fontfile='${fontPath}':text='${text}':x=(w-text_w)/2:y=h-text_h-100:fontsize=28:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=10:enable='between(t,${seg.startTime},${seg.endTime})'`;
  });

  const filterComplex = filterParts.join(',');
  const cmd = `-i "${inputVideo}" -vf "${filterComplex}" -c:a copy -preset fast -y "${outputPath}"`;

  const session = await FFmpegKit.execute(cmd);
  const rc = await session.getReturnCode();
  if (rc.isValueSuccess()) return outputPath;

  // Fallback: copy video without subtitles
  await LegacyFS.copyAsync({ from: inputVideo, to: outputPath });
  return outputPath;
}

export async function mixAudio(
  ttsAudio: string,
  bgmAudio: string | null,
  targetDuration: number,
  outputPath: string
): Promise<string> {
  if (!bgmAudio) {
    await LegacyFS.copyAsync({ from: ttsAudio, to: outputPath });
    return outputPath;
  }

  const cmd =
    `-i "${ttsAudio}" -i "${bgmAudio}" ` +
    `-filter_complex ` +
    `"[0:a]volume=1.0[voice];[1:a]aloop=loop=-1:size=2147483647,volume=0.25,atrim=duration=${targetDuration}[bgm];` +
    `[voice][bgm]amix=inputs=2:duration=first:dropout_transition=2[aout]" ` +
    `-map "[aout]" -ac 2 -ar 44100 -t ${targetDuration} -y "${outputPath}"`;

  const session = await FFmpegKit.execute(cmd);
  const rc = await session.getReturnCode();
  if (rc.isValueSuccess()) return outputPath;
  throw new Error('混音失败');
}

export async function generateBgmOnly(
  bgmAudio: string,
  targetDuration: number,
  outputPath: string
): Promise<string> {
  const cmd = `-i "${bgmAudio}" -filter_complex "aloop=loop=-1:size=2147483647,atrim=duration=${targetDuration}[a]" -map "[a]" -ac 2 -ar 44100 -y "${outputPath}"`;
  const session = await FFmpegKit.execute(cmd);
  const rc = await session.getReturnCode();
  if (rc.isValueSuccess()) return outputPath;
  throw new Error('背景音乐生成失败');
}

export async function finalAssembly(
  inputVideo: string,
  audioMix: string,
  targetDuration: number,
  outputPath: string
): Promise<string> {
  const cmd =
    `-i "${inputVideo}" -i "${audioMix}" -c:v copy -map 0:v:0 -map 1:a:0 -t ${targetDuration} -preset fast -y "${outputPath}"`;

  const session = await FFmpegKit.execute(cmd);
  const rc = await session.getReturnCode();
  if (rc.isValueSuccess()) return outputPath;
  throw new Error('视频合成失败');
}

export async function concatAudios(
  audioFiles: string[],
  outputPath: string
): Promise<string> {
  if (audioFiles.length === 0) throw new Error('没有音频文件');
  if (audioFiles.length === 1) {
    await LegacyFS.copyAsync({ from: audioFiles[0], to: outputPath });
    return outputPath;
  }

  const dir = await ensureTempDir();
  const listPath = `${dir}filelist.txt`;
  const listContent = audioFiles.map((f) => `file '${f}'`).join('\n');
  await LegacyFS.writeAsStringAsync(listPath, listContent);

  const cmd = `-f concat -safe 0 -i "${listPath}" -c copy -y "${outputPath}"`;
  const session = await FFmpegKit.execute(cmd);
  const rc = await session.getReturnCode();
  if (rc.isValueSuccess()) return outputPath;
  throw new Error('音频拼接失败');
}
