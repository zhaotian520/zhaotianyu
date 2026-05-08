import { cacheDirectory } from 'expo-file-system/legacy';
import * as LegacyFS from 'expo-file-system/legacy';

export function getTempDir(): string {
  return `${cacheDirectory}video-processing/`;
}

export async function ensureTempDir(): Promise<string> {
  const dir = getTempDir();
  const info = await LegacyFS.getInfoAsync(dir);
  if (!info.exists) {
    await LegacyFS.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}

export async function cleanupTempDir(): Promise<void> {
  const dir = getTempDir();
  const info = await LegacyFS.getInfoAsync(dir);
  if (info.exists) {
    await LegacyFS.deleteAsync(dir, { idempotent: true });
  }
}

export async function copyToTemp(sourceUri: string, name: string): Promise<string> {
  const dir = await ensureTempDir();
  const dest = `${dir}${name}`;
  await LegacyFS.copyAsync({ from: sourceUri, to: dest });
  return dest;
}

export function sanitizePath(path: string): boolean {
  const dangerous = /[;|&$`]/;
  return !dangerous.test(path);
}
