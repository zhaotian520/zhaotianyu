import * as LegacyFS from 'expo-file-system/legacy';
import { ensureTempDir } from '@/utils/file';

// Cloud TTS fallback using Baidu TTS (free tier)
const BAIDU_TTS_URL = 'https://tsn.baidu.com/text2audio';

async function getBaiduAccessToken(): Promise<string> {
  const response = await fetch(
    `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=DEMO&client_secret=DEMO`,
    { method: 'POST' }
  );
  const data = await response.json();
  return data.access_token || '';
}

export async function cloudTTS(
  text: string,
  outputPath: string
): Promise<string> {
  const token = await getBaiduAccessToken();
  if (!token) {
    throw new Error('Failed to get Baidu access token');
  }

  const response = await fetch(
    `${BAIDU_TTS_URL}?tok=${token}&tex=${encodeURIComponent(text)}&cuid=android_app&ctp=1&lan=zh&per=0&spd=5&pit=5&vol=9`
  );

  if (!response.ok) {
    throw new Error(`TTS API error: ${response.status}`);
  }

  const blob = await response.blob();
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

  await LegacyFS.writeAsStringAsync(outputPath, base64.split(',')[1], {
    encoding: LegacyFS.EncodingType.Base64,
  });

  return outputPath;
}
