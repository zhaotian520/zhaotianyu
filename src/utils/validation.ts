import type { PropertyInfo } from '@/types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validatePropertyInfo(
  info: PropertyInfo,
  videoUri: string | null
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!videoUri) {
    errors.video = '请选择视频';
  }

  if (!info.communityName.trim()) {
    errors.communityName = '请输入小区名称';
  }

  if (!info.area.trim()) {
    errors.area = '请输入面积';
  } else if (isNaN(Number(info.area)) || Number(info.area) <= 0) {
    errors.area = '面积必须是正数';
  }

  if (!info.price.trim()) {
    errors.price = '请输入价格';
  } else if (isNaN(Number(info.price)) || Number(info.price) <= 0) {
    errors.price = '价格必须是正数';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
