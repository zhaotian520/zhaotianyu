import * as LegacyFS from 'expo-file-system/legacy';

const SYSTEM_FONTS = [
  '/system/fonts/NotoSansSC-Regular.otf',
  '/system/fonts/NotoSansSC-Regular.ttf',
  '/system/fonts/NotoSansCJK-Regular.ttc',
  '/system/fonts/DroidSansFallback.ttf',
];

export async function getFontPath(): Promise<string> {
  for (const path of SYSTEM_FONTS) {
    try {
      const info = await LegacyFS.getInfoAsync(path);
      if (info.exists) return path;
    } catch {}
  }
  throw new Error('未找到中文字体文件，字幕功能无法使用');
}
