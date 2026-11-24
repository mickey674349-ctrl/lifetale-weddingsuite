import {
  FinishingPreferenceOption,
  PaperPreferenceOption,
  PrintAssistantSelection,
  PrintProductOption,
  PrintVendorPreset,
  PrintVendorPresetId,
  PrintableProductId,
  ProductPrintSpec,
} from '../types/printAssistant';

export const SWATCH_COTTON_PAPER =
  '/src/assets/images/swatch_cotton_paper_1795504423256.jpg';
export const SWATCH_LINEN_TEXTURED =
  '/src/assets/images/swatch_linen_textured_1795504422736.jpg';
export const SWATCH_PEARL_SHIMMER =
  '/src/assets/images/swatch_pearl_shimmer_1795504423021.jpg';
export const SWATCH_FOIL_EMBOSS =
  '/src/assets/images/swatch_foil_emboss_1795504423285.jpg';

export const PRINT_PRODUCT_OPTIONS: Record<
  PrintableProductId,
  PrintProductOption
> = {
  'welcome-poster': {
    id: 'welcome-poster',
    sourceAssetTab: 'welcome-poster',
    nameZh: '婚禮現場迎賓海報',
    shortNameZh: '迎賓海報',
    categoryLabel: '大圖迎賓陳列',
    description: '擺放於宴會廳入口畫架，建議搭配相框或珍珠板裱貼。',
    sizeOptions: [
      {
        id: 'a1',
        label: 'A1 標準大圖（594 × 841 mm）',
        widthMm: 594,
        heightMm: 841,
        note: '最常見婚宴畫架尺寸，遠看大器',
      },
      {
        id: 'a2',
        label: 'A2 精緻海報（420 × 594 mm）',
        widthMm: 420,
        heightMm: 594,
        note: '適合小型家宴或迎賓桌立架',
      },
      {
        id: 'a3',
        label: 'A3 桌上迎賓框（297 × 420 mm）',
        widthMm: 297,
        heightMm: 420,
        note: '適合收禮桌或相片區陳列',
      },
    ],
    defaultSizeId: 'a1',
    defaultQuantity: 1,
    quantityPresets: [1, 2, 3],
    recommendedSides: 'single',
    minEffectiveDpi: 100,
    recommendedDpi: 150, // Large format viewed from 1m+ distance
    photoWidthFraction: 0.71,
  },
  'table-card': {
    id: 'table-card',
    sourceAssetTab: 'table-card',
    nameZh: '婚宴賓客桌卡',
    shortNameZh: '賓客桌卡',
    categoryLabel: '宴會桌面紙藝',
    description: '擺放於各桌中央或桌立夾，標示桌次、新人引言與婚宴時程。',
    sizeOptions: [
      {
        id: 'a5',
        label: 'A5 典雅桌卡（148 × 210 mm）',
        widthMm: 148,
        heightMm: 210,
        note: '遠近皆清楚易讀，最受長輩喜愛',
      },
      {
        id: '120x170',
        label: '120 × 170 mm 歐式桌卡',
        widthMm: 120,
        heightMm: 170,
        note: '細長精品比例，適合立牌夾',
      },
      {
        id: 'a6',
        label: 'A6 輕巧桌卡（105 × 148 mm）',
        widthMm: 105,
        heightMm: 148,
        note: '精緻不佔桌面空間',
      },
    ],
    defaultSizeId: 'a5',
    defaultQuantity: 20,
    quantityPresets: [10, 20, 30, 50],
    recommendedSides: 'double',
    minEffectiveDpi: 180,
    recommendedDpi: 300,
    photoWidthFraction: 0.43,
  },
  'printed-invite': {
    id: 'printed-invite',
    sourceAssetTab: 'e-invite',
    nameZh: '實體紀念喜帖卡片',
    shortNameZh: '實體喜帖',
    categoryLabel: '親友珍藏紙本',
    description: '由主視覺喜帖版面延伸為實體明信片式喜帖，適合贈送長輩與摯友。',
    sizeOptions: [
      {
        id: '120x180',
        label: '120 × 180 mm 精品長型卡',
        widthMm: 120,
        heightMm: 180,
        note: '最貼近 9:16 修長視覺比例',
      },
      {
        id: 'a5',
        label: 'A5 標準喜帖（148 × 210 mm）',
        widthMm: 148,
        heightMm: 210,
        note: '大器好閱讀，容易搭配現成信封',
      },
      {
        id: '105x185',
        label: '105 × 185 mm 歐式修長卡',
        widthMm: 105,
        heightMm: 185,
        note: '法式精品喜帖經典比例',
      },
    ],
    defaultSizeId: '120x180',
    defaultQuantity: 100,
    quantityPresets: [50, 100, 150, 200],
    recommendedSides: 'single',
    minEffectiveDpi: 200,
    recommendedDpi: 300,
    photoWidthFraction: 0.67,
  },
  'line-card-print': {
    id: 'line-card-print',
    sourceAssetTab: 'line-traffic',
    nameZh: '賓客交通導引小卡',
    shortNameZh: '交通小卡',
    categoryLabel: '附贈信封導引卡',
    description: '由 LINE 交通提醒卡延伸，可夾入實體喜帖信封中，方便長輩查看停車與地址。',
    sizeOptions: [
      {
        id: 'a6',
        label: 'A6 導引小卡（105 × 148 mm）',
        widthMm: 105,
        heightMm: 148,
        note: '剛好可夾入多數喜帖信封內',
      },
      {
        id: '90x112',
        label: '90 × 112 mm 精緻附卡',
        widthMm: 90,
        heightMm: 112,
        note: '4:5 等比例輕巧尺寸',
      },
    ],
    defaultSizeId: 'a6',
    defaultQuantity: 100,
    quantityPresets: [50, 100, 150],
    recommendedSides: 'single',
    minEffectiveDpi: 180,
    recommendedDpi: 300,
    photoWidthFraction: 0.34,
  },
};

export const PRINT_PRODUCT_ORDER: PrintableProductId[] = [
  'welcome-poster',
  'table-card',
  'printed-invite',
  'line-card-print',
];

export const PAPER_PREFERENCES: PaperPreferenceOption[] = [
  {
    id: 'matte-cotton',
    nameZh: '溫潤霧面美術棉紙',
    commonVendorNames: '常見對應：象牙卡 300g / 頂級象牙 / 美術棉紙',
    plainDescription:
      '紙面柔和不反光、手感厚實溫潤，最能呈現裸玫瑰粉與珍珠象牙白的柔和層次，字跡清晰好閱讀。',
    bestFor: '最推薦用於皇家玫瑰花園、法式莊園與韓系極簡系列',
    swatchImage: SWATCH_COTTON_PAPER,
    effectCaption: '紙材效果示意（實際色澤與厚度請以印刷廠紙樣為準）',
  },
  {
    id: 'linen-textured',
    nameZh: '細緻紋理手工美術紙',
    commonVendorNames: '常見對應：萊妮紙 / 水彩紙 / 細紋美術紙',
    plainDescription:
      '表面帶有柔和交織細紋與歐式古典紙藝手感，拿在手上極具精品訂製份量，但細小照片細節會略帶紙紋。',
    bestFor: '推薦用於法式復古莊園、新中式雅韻與賓客桌卡',
    swatchImage: SWATCH_LINEN_TEXTURED,
    effectCaption: '紙材效果示意（不同印刷廠紋理深淺略有差異）',
  },
  {
    id: 'pearl-shimmer',
    nameZh: '低調星幻珠光美術紙',
    commonVendorNames: '常見對應：星幻紙 / 炫光紙 / 珍珠美術紙',
    plainDescription:
      '在宴會廳柔和燈光下會散發細緻珍珠香檳微光，不俗氣且自帶輕奢光澤，適合喜帖卡片與桌卡。',
    bestFor: '推薦用於皇家玫瑰花園與晚宴燈光氛圍',
    swatchImage: SWATCH_PEARL_SHIMMER,
    effectCaption: '紙材效果示意（珠光成色請於送印前向印刷廠確認打樣）',
  },
];

export const FINISHING_PREFERENCES: FinishingPreferenceOption[] = [
  {
    id: 'standard-color',
    nameZh: '標準霧面彩色印刷（最省預算、交期單純）',
    plainDescription:
      '一般數位或平版彩色印製，不追加特殊版費，適合多數新人快速完成喜帖、桌卡與迎賓海報。',
    requiresSeparatePlate: false,
    honestLimitation:
      '本系統輸出之 RGB PDF 需由印刷廠協助轉換 CMYK 印製，實際紙本色澤與手機螢幕可能略有溫潤色差。',
  },
  {
    id: 'digital-champagne-visual',
    nameZh: '保留「數位香檳金」平面彩印視覺（無實體燙金）',
    plainDescription:
      '直接以彩色油墨印出香檳金色階與火漆印章視覺效果，保留設計美感且免收開版燙金費用。',
    requiresSeparatePlate: false,
    honestLimitation:
      '此選項為平面彩色印刷之數位香檳金視覺效果，成品表面沒有實體金屬反光燙金或立體凹凸加工。',
  },
  {
    id: 'inquire-foil-emboss',
    nameZh: '想向印刷廠加價詢問「實體燙金 / 打凸 / 壓紋」',
    plainDescription:
      '若希望標題、玫瑰線框或徽章具備真實金屬燙金或立體壓紋手感，可於詢價時請印刷廠評估報價與打樣。',
    requiresSeparatePlate: true,
    honestLimitation:
      '重要限制：本系統目前無法直接輸出實體燙金／打凸用之獨立黑稿（K100 分色稿）。交付包內將提供「加工需求規格單」與「視覺參考圖」，實際加工稿製作方式與開版費須由印刷廠確認。',
    swatchImage: SWATCH_FOIL_EMBOSS,
    effectCaption: '實體燙金與壓紋效果示意（非本系統直接輸出之加工成品）',
  },
];

/**
 * Extensible Print Vendor Spec Registry
 * Strict Rule: Different vendors and products never mix specs.
 * Unverified vendor presets are explicitly marked as pending verification.
 */
export const PRINT_VENDOR_PRESETS: Record<
  PrintVendorPresetId,
  PrintVendorPreset
> = {
  'generic-reference': {
    id: 'generic-reference',
    nameZh: '尚未決定印刷廠（使用通用參考規格）',
    tagline: '依台灣常見數位／合版印刷習慣整理之安全基準',
    verificationStatus: 'generic',
    statusBadgeText: '通用參考規格 · 送印前請由印刷廠確認',
    inquiryHint: '可先下載完整交付包與詢價訊息，向任何住家附近影印輸出店或線上印刷廠詢價。',
    defaultBleedByProduct: {
      'welcome-poster': 3,
      'table-card': 3,
      'printed-invite': 3,
      'line-card-print': 3,
    },
    defaultSafeMarginByProduct: {
      'welcome-poster': 15,
      'table-card': 6,
      'printed-invite': 6,
      'line-card-print': 5,
    },
    disclaimer:
      '此為通用印前參考規格，不同印刷廠對出血、裁切公差與大圖留邊規範各異，送印前請務必交由印刷廠最終確認。',
  },
  gainhow: {
    id: 'gainhow',
    nameZh: '健豪印刷（健豪雲端數位網）',
    tagline: '台灣大型線上合版與數位輸出服務商（僅供參考，無合作關係）',
    verificationStatus: 'pending_verification',
    statusBadgeText: '規格待確認 · 請依健豪官網完稿須知為準',
    officialUrl: 'https://gainhow.tw/',
    guidelinesUrl: 'https://gainhow.tw/',
    inquiryHint: '建議前往官網「完稿須知 / 常見問題」查詢對應紙材與大圖海報出血規範。',
    defaultBleedByProduct: {
      'welcome-poster': 3,
      'table-card': 2,
      'printed-invite': 2,
      'line-card-print': 2,
    },
    defaultSafeMarginByProduct: {
      'welcome-poster': 15,
      'table-card': 5,
      'printed-invite': 5,
      'line-card-print': 5,
    },
    disclaimer:
      '尚未經過逐項實體送印驗證，出血與刀模參數標示為待確認；本平台與健豪印刷無任何商業合作關係，實際報價與交期請以官網為準。',
  },
  blueco: {
    id: 'blueco',
    nameZh: '藍格印刷',
    tagline: '台灣知名數位與合版印刷服務商（僅供參考，無合作關係）',
    verificationStatus: 'pending_verification',
    statusBadgeText: '規格待確認 · 請依藍格官網完稿規範為準',
    officialUrl: 'https://ec.blueco.com.tw/',
    guidelinesUrl: 'https://ec.blueco.com.tw/Page/how%20to%20placing%20order',
    inquiryHint: '可至藍格官網「下單流程與說明」確認各類卡片出血、雙面印製與紙材庫存。',
    defaultBleedByProduct: {
      'welcome-poster': 3,
      'table-card': 2,
      'printed-invite': 2,
      'line-card-print': 2,
    },
    defaultSafeMarginByProduct: {
      'welcome-poster': 15,
      'table-card': 5,
      'printed-invite': 5,
      'line-card-print': 5,
    },
    disclaimer:
      '尚未經過逐項實體送印驗證，規格標示為待確認；本平台與藍格印刷無合作或代理關係，請以官方公告規範為準。',
  },
  cardhome: {
    id: 'cardhome',
    nameZh: '卡之屋印刷',
    tagline: '台灣常見卡片、海報與各式美術紙印刷廠（僅供參考，無合作關係）',
    verificationStatus: 'pending_verification',
    statusBadgeText: '規格待確認 · 請依卡之屋官網完稿須知為準',
    officialUrl: 'https://www.cardhome.com.tw/',
    guidelinesUrl: 'https://www.cardhome.com.tw/',
    inquiryHint: '建議於官網選單「完稿須知」確認美術紙張可印尺寸、出血與後加工限制。',
    defaultBleedByProduct: {
      'welcome-poster': 3,
      'table-card': 2,
      'printed-invite': 2,
      'line-card-print': 2,
    },
    defaultSafeMarginByProduct: {
      'welcome-poster': 15,
      'table-card': 5,
      'printed-invite': 5,
      'line-card-print': 5,
    },
    disclaimer:
      '尚未經過逐項實體送印驗證，規格標示為待確認；本平台與卡之屋無合作或代理關係，實際紙材與價格請自行向官方確認。',
  },
};

export const PRINT_VENDOR_ORDER: PrintVendorPresetId[] = [
  'generic-reference',
  'gainhow',
  'blueco',
  'cardhome',
];

export function getProductSpecForVendor(
  vendorId: PrintVendorPresetId,
  productId: PrintableProductId,
  sizeId: string
): ProductPrintSpec {
  const vendor = PRINT_VENDOR_PRESETS[vendorId];
  const product = PRINT_PRODUCT_OPTIONS[productId];
  const size =
    product.sizeOptions.find((s) => s.id === sizeId) ?? product.sizeOptions[0];

  return {
    productId,
    vendorId,
    finishedWidthMm: size.widthMm,
    finishedHeightMm: size.heightMm,
    bleedMm: vendor.defaultBleedByProduct[productId],
    safeMarginMm: vendor.defaultSafeMarginByProduct[productId],
    minEffectiveDpi: product.minEffectiveDpi,
    recommendedDpi: product.recommendedDpi,
    colorModeLabel: 'RGB（瀏覽器本機輸出，非 CMYK 認證檔；請印刷廠協助轉色確認）',
    pdfFormatLabel: '標準 RGB PDF（非 PDF/X 印刷認證格式）',
    specialFinishingRule:
      '實體燙金、壓紋、打凸需另備獨立加工黑稿（K100），本系統僅提供視覺參考與需求規格單。',
    verificationStatus: vendor.verificationStatus,
  };
}

export function getDefaultExpectedReceiveDate(weddingDateIso: string): string {
  if (!weddingDateIso) return '2026-11-18';
  const wedding = new Date(`${weddingDateIso}T12:00:00`);
  if (Number.isNaN(wedding.getTime())) return '2026-11-18';
  // Suggest 10 days before wedding as safe buffer
  wedding.setDate(wedding.getDate() - 10);
  const y = wedding.getFullYear();
  const m = String(wedding.getMonth() + 1).padStart(2, '0');
  const d = String(wedding.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultPrintSelection(
  weddingDateIso: string
): PrintAssistantSelection {
  return {
    vendorId: 'generic-reference',
    products: {
      'welcome-poster': {
        enabled: true,
        sizeId: 'a1',
        quantity: 1,
      },
      'table-card': {
        enabled: true,
        sizeId: 'a5',
        quantity: 20,
      },
      'printed-invite': {
        enabled: false,
        sizeId: '120x180',
        quantity: 100,
      },
      'line-card-print': {
        enabled: false,
        sizeId: 'a6',
        quantity: 100,
      },
    },
    sides: 'single',
    paperId: 'matte-cotton',
    finishingId: 'digital-champagne-visual',
    expectedReceiveDate: getDefaultExpectedReceiveDate(weddingDateIso),
    customRemarks: '',
    proofreadConfirmed: false,
  };
}
