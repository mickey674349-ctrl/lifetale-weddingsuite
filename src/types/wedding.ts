export type ThemeId =
  | 'royal-rose'
  | 'french-manor'
  | 'korean-minimalist'
  | 'modern-oriental';

export type PreviewAssetTab =
  | 'e-invite'
  | 'welcome-poster'
  | 'table-card'
  | 'line-traffic';

export type StudioStep = 1 | 2 | 3 | 4;

export interface WeddingData {
  coupleNamesZh: string;
  coupleNamesEn: string;
  weddingDateIso: string;
  dateTimeLabel: string;
  venueName: string;
  venueAddress: string;
  trafficNote: string;
  tableLabel: string;
  timelineNote: string;
  welcomeQuote: string;
  photoUrl: string;
  isDefaultPhoto: boolean;
  photoScale: number;
  photoPosX: number;
  photoPosY: number;
}

export interface ThemeConfig {
  id: ThemeId;
  seriesNumber: string;
  nameZh: string;
  nameEn: string;
  tagline: string;
  description: string;
  craftNote: string;
  previewImage: string;
  featured?: boolean;
  colors: {
    canvasBg: string;
    surfaceBg: string;
    border: string;
    secondaryBorder: string;
    primaryAccent: string;
    primaryAccentText: string;
    foilAccent: string;
    inkPrimary: string;
    inkSecondary: string;
    inkMuted: string;
    softTint: string;
  };
  swatches: [string, string, string, string];
  typography: {
    displayClass: string;
    bodyClass: string;
    scriptOrSealLabel: string;
    welcomeSubtitle: string;
    canvasDisplayFont: string;
    canvasBodyFont: string;
    canvasScriptFont: string;
  };
}

// Brand Atelier Shell Palette (Fixed Master Palette)
export const ATELIER_PALETTE = {
  dustyRose: '#D1ADA2',
  mistyBlush: '#E6CBC3',
  vintageMauve: '#AD8980',
  champagneGold: '#C5AA7C',
  pearlIvory: '#F5F0E9',
  deepCocoa: '#655047',
  cocoaSoft: '#846E65',
  cocoaMuted: '#9B877E',
  paperWhite: '#FBF8F4',
  hairline: '#E3D7CA',
} as const;

// Generated Bespoke High-Resolution Visual Assets
export const HERO_STATIONERY_IMAGE =
  '/src/assets/images/hero_couture_stationery_1795505299365.jpg';

export const BOTANICAL_ROSE_CORNER =
  '/src/assets/images/botanical_rose_corner_1795505297960.jpg';

export const SERIES_ROYAL_ROSE_IMAGE =
  '/src/assets/images/series_royal_rose_1795502525890.jpg';

export const SERIES_FRENCH_MANOR_IMAGE =
  '/src/assets/images/series_french_manor_1795502525981.jpg';

export const SERIES_KOREAN_MINIMAL_IMAGE =
  '/src/assets/images/series_korean_minimal_1795502525593.jpg';

export const SERIES_MODERN_ORIENTAL_IMAGE =
  '/src/assets/images/series_modern_oriental_1795502526377.jpg';

export const DEFAULT_WEDDING_PHOTO =
  '/src/assets/images/default_east_asian_couple_1795502527044.jpg';

export const FILM_SHOWCASE_ROSE_ATELIER =
  '/src/assets/images/film_showcase_rose_atelier_1795502527103.jpg';

export const FILM_SHOWCASE_ORIENTAL =
  '/src/assets/images/film_showcase_oriental_1795414518216.jpg';

export const DEFAULT_WEDDING_DATA: WeddingData = {
  coupleNamesZh: '陳宥廷 & 林語希',
  coupleNamesEn: 'Ethan & Chloe',
  weddingDateIso: '2026-11-28',
  dateTimeLabel: '2026 年 11 月 28 日（星期六）午宴 12:00 入席',
  venueName: '高雄萬豪酒店 8F 萬享大宴會廳',
  venueAddress: '高雄市鼓山區龍德新路 222 號',
  trafficNote: '備有地下免費停車場 · 捷運凹子底站 2 號出口步行約 8 分鐘',
  tableLabel: '摯友席 · Table 06',
  timelineNote: '11:30 迎賓茶點 · 12:00 準時開席 · 14:30 送客合影',
  welcomeQuote: '在最美的時光裡，誠摯邀請您見證我們的承諾',
  photoUrl: DEFAULT_WEDDING_PHOTO,
  isDefaultPhoto: true,
  photoScale: 1,
  photoPosX: 50,
  photoPosY: 28,
};

export const THEME_ORDER: ThemeId[] = [
  'royal-rose',
  'french-manor',
  'korean-minimalist',
  'modern-oriental',
];

export const THEME_CONFIGS: Record<ThemeId, ThemeConfig> = {
  'royal-rose': {
    id: 'royal-rose',
    seriesNumber: '01',
    nameZh: '皇家玫瑰花園',
    nameEn: 'Royal Rose Garden',
    tagline: '古典裸玫瑰 · 香檳燙金視覺 · 植物雕花 · 火漆印章',
    description:
      '品牌主打高級訂製系列，以細膩庭園玫瑰線條、裸粉信封色調與古董香檳金火漆徽章，勾勒法式浪漫紙藝典範。',
    craftNote: '珍珠象牙棉紙質感 · 庭園玫瑰雕花線框 · 香檳金火漆徽章',
    previewImage: SERIES_ROYAL_ROSE_IMAGE,
    featured: true,
    colors: {
      canvasBg: '#F5F0E9',
      surfaceBg: '#EFE7DF',
      border: '#C5AA7C',
      secondaryBorder: '#E2D4C6',
      primaryAccent: '#AD8980',
      primaryAccentText: '#FBF8F4',
      foilAccent: '#C5AA7C',
      inkPrimary: '#655047',
      inkSecondary: '#816A61',
      inkMuted: '#9B867D',
      softTint: 'rgba(209, 173, 162, 0.16)',
    },
    swatches: ['#F5F0E9', '#E6CBC3', '#D1ADA2', '#C5AA7C'],
    typography: {
      displayClass: 'font-editorial-serif',
      bodyClass: 'font-editorial-serif',
      scriptOrSealLabel: 'Save the Date',
      welcomeSubtitle: 'Welcome to Our Rose Garden Wedding',
      canvasDisplayFont: '"Cormorant Garamond", "Noto Serif TC", serif',
      canvasBodyFont: '"Noto Serif TC", "Cormorant Garamond", serif',
      canvasScriptFont: '"Pinyon Script", "Cormorant Garamond", cursive',
    },
  },
  'french-manor': {
    id: 'french-manor',
    seriesNumber: '02',
    nameZh: '法式復古莊園',
    nameEn: 'French Manor',
    tagline: '燕麥白 · 古董金 · 古典花卉雕刻',
    description:
      '歐式石造莊園與手抄棉紙的溫潤對語，以拱門式構圖搭配細緻古董金葉脈雕刻，展現雋永編輯感。',
    craftNote: '燕麥暖白手抄紙調 · 拱門人像框 · 橄欖葉古典邊飾',
    previewImage: SERIES_FRENCH_MANOR_IMAGE,
    colors: {
      canvasBg: '#FAF7F2',
      surfaceBg: '#F2ECE3',
      border: '#A88B68',
      secondaryBorder: '#DCCEB9',
      primaryAccent: '#9E7368',
      primaryAccentText: '#FAF7F2',
      foilAccent: '#A88B68',
      inkPrimary: '#3D3129',
      inkSecondary: '#6B5A4E',
      inkMuted: '#928174',
      softTint: 'rgba(168, 139, 104, 0.1)',
    },
    swatches: ['#FAF7F2', '#E5DAC8', '#A88B68', '#9E7368'],
    typography: {
      displayClass: 'font-editorial-serif',
      bodyClass: 'font-editorial-serif',
      scriptOrSealLabel: 'Save the Date',
      welcomeSubtitle: 'Welcome to Our Château Celebration',
      canvasDisplayFont: '"Cormorant Garamond", "Noto Serif TC", serif',
      canvasBodyFont: '"Noto Serif TC", "Cormorant Garamond", serif',
      canvasScriptFont: '"Pinyon Script", "Cormorant Garamond", cursive',
    },
  },
  'korean-minimalist': {
    id: 'korean-minimalist',
    seriesNumber: '03',
    nameZh: '韓系極簡留白',
    nameEn: 'Korean Minimalist',
    tagline: '珍珠白 · 鼠尾草綠 · 細緻極簡排版',
    description:
      '大面積呼吸感畫廊留白與建築幾何細線，搭配柔霧鼠尾草綠尤加利點綴，還原首爾當代婚紗攝影棚氣質。',
    craftNote: '純淨珍珠白卡紙 · 建築比例細線 · 柔霧尤加利枝枒',
    previewImage: SERIES_KOREAN_MINIMAL_IMAGE,
    colors: {
      canvasBg: '#FFFFFF',
      surfaceBg: '#F7F8F6',
      border: '#D7DDD8',
      secondaryBorder: '#E5E7E4',
      primaryAccent: '#6B8E78',
      primaryAccentText: '#FFFFFF',
      foilAccent: '#8DA696',
      inkPrimary: '#262C28',
      inkSecondary: '#58635C',
      inkMuted: '#8B958E',
      softTint: 'rgba(107, 142, 120, 0.08)',
    },
    swatches: ['#FFFFFF', '#F3F5F2', '#D7DDD8', '#6B8E78'],
    typography: {
      displayClass: 'font-editorial-sans',
      bodyClass: 'font-editorial-sans',
      scriptOrSealLabel: 'THE WEDDING DAY',
      welcomeSubtitle: 'Welcome to Our Wedding',
      canvasDisplayFont: '"Plus Jakarta Sans", "Noto Sans TC", sans-serif',
      canvasBodyFont: '"Plus Jakarta Sans", "Noto Sans TC", sans-serif',
      canvasScriptFont: '"Plus Jakarta Sans", "Noto Sans TC", sans-serif',
    },
  },
  'modern-oriental': {
    id: 'modern-oriental',
    seriesNumber: '04',
    nameZh: '新中式現代雅韻',
    nameEn: 'Modern Oriental',
    tagline: '宣紙米 · 低飽和硃砂紅 · 暗金線條',
    description:
      '融匯當代東方建築窗花幾何與溫潤宣紙米調，以低飽和硃砂印記與宋體字韻，演繹端莊不落俗套的喜慶大器。',
    craftNote: '宣紙米溫潤紙紋 · 極簡窗花幾何角飾 · 低飽和硃砂雙囍印',
    previewImage: SERIES_MODERN_ORIENTAL_IMAGE,
    colors: {
      canvasBg: '#F9F4EA',
      surfaceBg: '#F2E9DB',
      border: '#BFA065',
      secondaryBorder: '#DFCEAE',
      primaryAccent: '#A64B3E',
      primaryAccentText: '#FFFDF8',
      foilAccent: '#BFA065',
      inkPrimary: '#36231D',
      inkSecondary: '#664B41',
      inkMuted: '#8E7467',
      softTint: 'rgba(166, 75, 62, 0.09)',
    },
    swatches: ['#F9F4EA', '#E9DCC6', '#BFA065', '#A64B3E'],
    typography: {
      displayClass: 'font-oriental-serif',
      bodyClass: 'font-oriental-serif',
      scriptOrSealLabel: '良辰吉日 · 囍結連理',
      welcomeSubtitle: '佳偶天成 · 誠摯敬邀',
      canvasDisplayFont: '"Noto Serif TC", "Cormorant Garamond", serif',
      canvasBodyFont: '"Noto Serif TC", serif',
      canvasScriptFont: '"Noto Serif TC", serif',
    },
  },
};

export const ASSET_META: {
  id: PreviewAssetTab;
  label: string;
  shortLabel: string;
  ratio: string;
  spec: string;
}[] = [
  {
    id: 'e-invite',
    label: '手機電子喜帖',
    shortLabel: '電子喜帖',
    ratio: '9:16',
    spec: '1080 × 1920 px · 含互動導航與出席回覆預覽',
  },
  {
    id: 'welcome-poster',
    label: '婚禮迎賓海報',
    shortLabel: '迎賓海報',
    ratio: 'A1',
    spec: 'A1 等比高解析 · 適用現場畫架迎賓區陳列',
  },
  {
    id: 'table-card',
    label: '婚宴賓客桌卡',
    shortLabel: '賓客桌卡',
    ratio: '3:4',
    spec: '桌次牌與當日時程 · 統一宴會廳桌面美學',
  },
  {
    id: 'line-traffic',
    label: 'LINE 交通提醒卡',
    shortLabel: '交通提醒',
    ratio: '4:5',
    spec: '手機滿版易讀資訊圖 · 一鍵轉傳賓客群組',
  },
];

export function getCoupleMonogram(coupleEn: string): string {
  const letters = coupleEn
    .split(/[^A-Za-z]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase());
  if (letters.length >= 2) {
    return `${letters[0]}&${letters[1]}`;
  }
  if (letters.length === 1) {
    return letters[0];
  }
  return 'L&T';
}

export function getDaysUntilWedding(dateIso: string): number {
  if (!dateIso) return 0;
  const target = new Date(`${dateIso}T12:00:00`);
  if (Number.isNaN(target.getTime())) return 0;
  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const targetMidnight = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );
  const diffMs = targetMidnight.getTime() - todayMidnight.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}
