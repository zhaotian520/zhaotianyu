import type { PropertyType, PropertyInfo } from '@/types';
import { useSettingsStore } from '@/stores/settingsStore';
import { buildPrompt, generateLocalTemplate } from '@/templates/prompts';

export interface AiResult {
  content: string;
  source: 'api' | 'local';
  error?: string;
}

const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const TIMEOUT_MS = 20000;
const MAX_RETRIES = 2;

function getApiKey(): string {
  const key = useSettingsStore.getState().glmApiKey;
  return key || '36c0cc75e382a5eac2c5d6fbd2d1ab91.DnCUFyM00ofrW1YW';
}

async function fetchWithTimeout(url: string, options: RequestInit, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateCopy(
  type: PropertyType,
  info: PropertyInfo,
  videoDuration: number
): Promise<AiResult> {
  const { speechRate, prompts } = useSettingsStore.getState();
  const prompt = buildPrompt(type, info, videoDuration, speechRate, prompts[type]);
  const apiKey = getApiKey();

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, 1000));
      }

      const res = await fetchWithTimeout(
        API_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'glm-4-flash',
            messages: [
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        },
        TIMEOUT_MS
      );

      if (!res.ok) {
        if (attempt < MAX_RETRIES) continue;
        return {
          content: generateLocalTemplate(type, info, videoDuration, speechRate),
          source: 'local',
          error: `API HTTP ${res.status}`,
        };
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content?.trim();

      if (!content) {
        return {
          content: generateLocalTemplate(type, info, videoDuration, speechRate),
          source: 'local',
          error: 'API 返回空内容',
        };
      }

      return { content, source: 'api' };
    } catch (err) {
      if (attempt < MAX_RETRIES) continue;
      const msg = err instanceof Error ? err.message : '未知错误';
      return {
        content: generateLocalTemplate(type, info, videoDuration, speechRate),
        source: 'local',
        error: msg,
      };
    }
  }

  // Shouldn't reach here
  return {
    content: generateLocalTemplate(type, info, videoDuration, speechRate),
    source: 'local',
  };
}
