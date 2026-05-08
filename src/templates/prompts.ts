import type { PropertyType, PropertyInfo } from '@/types';

export function buildPrompt(
  type: PropertyType,
  info: PropertyInfo,
  videoDuration: number,
  speechRate: number,
  customPrompt?: string
): string {
  const maxChars = Math.floor(videoDuration * speechRate * 4);
  const formattedInfo = [
    `小区名称: ${info.communityName}`,
    `面积: ${info.area}㎡`,
    info.orientation ? `朝向: ${info.orientation}` : '',
    `价格: ${info.price}`,
    info.highlights ? `亮点: ${info.highlights}` : '',
  ].filter(Boolean).join('\n');

  if (customPrompt) {
    return customPrompt
      .replace(/\${formattedPropertyInfo}/g, formattedInfo)
      .replace(/\${videoDuration}/g, String(videoDuration))
      .replace(/\${maxChars}/g, String(maxChars));
  }

  const defaultPrompt = `你是一个专业的房产视频文案创作助手。请根据房源信息，生成适合配音的文案。

房源信息：
${formattedInfo}

要求：
1. 语言生动、有感染力
2. 视频时长${videoDuration}秒
3. 按语速约每秒4字计算，总字数控制在${maxChars}字以内
4. 5-8个分句
5. 每句以句号、问号或感叹号结束
6. 只输出文案内容，不要解释`;

  switch (type) {
    case '租赁':
      return defaultPrompt + '\n7. 突出性价比、交通便利性和周边配套';
    case '二手买卖':
      return defaultPrompt + '\n7. 突出户型优势、装修品质和居住舒适度';
    case '新房买卖':
      return defaultPrompt + '\n7. 突出开发商品牌、区域潜力和未来规划';
  }
}

export function generateLocalTemplate(
  type: PropertyType,
  info: PropertyInfo,
  videoDuration: number,
  speechRate: number
): string {
  const maxChars = Math.floor(videoDuration * speechRate * 4);
  const base = `欢迎来到${info.communityName}！${info.area}平方米的精美空间，邀您品鉴。`;

  let middle = '';
  switch (type) {
    case '租赁':
      middle = `月租仅需${info.price}元，超高性价比，交通便利，周边配套齐全。`;
      break;
    case '二手买卖':
      middle = `总价${info.price}元，户型方正，装修考究，即买即住。`;
      break;
    case '新房买卖':
      middle = `总价${info.price}元起，品牌开发商，品质保障，未来可期。`;
      break;
  }

  const orientation = info.orientation ? `${info.orientation}，采光充足。` : '采光充足。';
  const highlight = info.highlights ? `${info.highlights}。` : '';

  const template = `${base}${middle}${orientation}${highlight}不要错过这个理想家园，立即联系看房！`;

  if (template.length > maxChars) {
    return template.slice(0, maxChars);
  }

  return template;
}
