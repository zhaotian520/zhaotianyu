export interface BGMItem {
  id: string;
  name: string;
  description: string;
}

export const BGM_LIST: BGMItem[] = [
  { id: 'none', name: '无背景音乐', description: '纯配音' },
  { id: 'city_sunshine', name: '轻快节奏', description: '活力 · 租赁房源' },
  { id: 'waltz_naseem', name: '优雅大气', description: '品质 · 新房' },
  { id: 'connecting_rainbows', name: '温馨柔和', description: '亲切 · 二手房' },
  { id: 'downtown_boogie', name: '都市律动', description: '现代 · 高端公寓' },
  { id: 'be_chillin', name: '宁静午后', description: '轻柔 · 别墅洋房' },
  { id: 'upbeat', name: '活力清晨', description: '轻快 · 刚需房源' },
  { id: 'elegant', name: '经典优雅', description: '大气 · 高端改善' },
  { id: 'warm', name: '温暖时光', description: '温馨 · 改善住宅' },
  { id: 'modern', name: '现代都市', description: '时尚 · 智能社区' },
  { id: 'calm', name: '静谧自然', description: '自然 · 度假房源' },
  { id: 'urban', name: '城市节拍', description: '现代 · 商圈房源' },
  { id: 'relax', name: '轻松一刻', description: '休闲 · 养老房源' },
  { id: 'dream', name: '梦想家园', description: '励志 · 首套房' },
  { id: 'business', name: '商务精英', description: '干练 · 写字楼' },
  { id: 'explore', name: '探索发现', description: '神秘 · 特色房源' },
  { id: 'classical', name: '古典韵味', description: '典雅 · 中式房源' },
  { id: 'jazz', name: '爵士时光', description: '慵懒 · LOFT' },
  { id: 'celebration', name: '庆典时刻', description: '欢快 · 开盘活动' },
  { id: 'seaside', name: '海滨假日', description: '轻松 · 海景房' },
];

export const SPEED_OPTIONS = [
  { value: 0.5, label: '极慢' },
  { value: 0.65, label: null },
  { value: 0.75, label: '较慢' },
  { value: 0.85, label: '正常' },
  { value: 0.95, label: null },
  { value: 1.1, label: '较快' },
  { value: 1.3, label: '极快' },
] as const;
