import {
  FINISHING_PREFERENCES,
  PRINT_PRODUCT_OPTIONS,
  PRINT_PRODUCT_ORDER,
  PRINT_VENDOR_PRESETS,
  getProductSpecForVendor,
} from '../data/printPresets';
import {
  PhotoResolutionMetrics,
  PreflightCheckItem,
  PrintAssistantSelection,
  PrintableProductId,
} from '../types/printAssistant';
import { WeddingData } from '../types/wedding';

export function measurePhotoNaturalDimensions(
  photoUrl: string
): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      });
    };
    img.onerror = () => resolve(null);
    img.src = photoUrl;
  });
}

export function getEnabledProductIds(
  selection: PrintAssistantSelection
): PrintableProductId[] {
  return PRINT_PRODUCT_ORDER.filter((id) => selection.products[id]?.enabled);
}

export function computePhotoResolutionMetrics(
  naturalSize: { width: number; height: number } | null,
  selection: PrintAssistantSelection,
  data: WeddingData
): PhotoResolutionMetrics {
  if (!naturalSize || naturalSize.width <= 0 || naturalSize.height <= 0) {
    return {
      loaded: false,
      naturalWidth: 0,
      naturalHeight: 0,
      worstEffectiveDpi: 0,
      worstProductName: '尚未載入',
      recommendedDpiForWorst: 300,
    };
  }

  const enabled = getEnabledProductIds(selection);
  const targets: PrintableProductId[] =
    enabled.length > 0 ? enabled : ['welcome-poster'];

  let worstRatio = Infinity;
  let worstEffectiveDpi = 0;
  let worstProductName = '';
  let recommendedDpiForWorst = 300;

  for (const productId of targets) {
    const cfg = selection.products[productId];
    const product = PRINT_PRODUCT_OPTIONS[productId];
    const spec = getProductSpecForVendor(
      selection.vendorId,
      productId,
      cfg.sizeId
    );
    // Calculate true physical printed width of the portrait slot in inches
    const photoWidthInches =
      (spec.finishedWidthMm * product.photoWidthFraction) / 25.4;
    // Account for user zoom scale (zooming in uses fewer original pixels per inch)
    const effectivePixelsWidth = naturalSize.width / Math.max(1, data.photoScale);
    const effectiveDpi = Math.round(effectivePixelsWidth / Math.max(0.5, photoWidthInches));
    const adequacyRatio = effectiveDpi / spec.recommendedDpi;

    if (adequacyRatio < worstRatio) {
      worstRatio = adequacyRatio;
      worstEffectiveDpi = effectiveDpi;
      worstProductName = `${product.shortNameZh}（${spec.finishedWidthMm}×${spec.finishedHeightMm}mm）`;
      recommendedDpiForWorst = spec.recommendedDpi;
    }
  }

  return {
    loaded: true,
    naturalWidth: naturalSize.width,
    naturalHeight: naturalSize.height,
    worstEffectiveDpi,
    worstProductName,
    recommendedDpiForWorst,
  };
}

export function runHonestPreflightChecks(
  selection: PrintAssistantSelection,
  data: WeddingData,
  photoMetrics: PhotoResolutionMetrics
): PreflightCheckItem[] {
  const checks: PreflightCheckItem[] = [];
  const enabledIds = getEnabledProductIds(selection);
  const vendor = PRINT_VENDOR_PRESETS[selection.vendorId];
  const finishing =
    FINISHING_PREFERENCES.find((f) => f.id === selection.finishingId) ??
    FINISHING_PREFERENCES[0];

  // 1. Actual PDF Page Size & Bleed Check
  if (enabledIds.length === 0) {
    checks.push({
      id: 'pdf-size-bleed',
      title: 'PDF 實際頁面尺寸與出血設定',
      status: 'manual_required',
      statusLabel: '請先勾選印製項目',
      detail: '尚未選擇任何欲印製的婚禮用品，請於上方勾選至少一項品項以計算真實毫米尺寸與出血。',
    });
  } else {
    const sizeSummaries = enabledIds.map((id) => {
      const product = PRINT_PRODUCT_OPTIONS[id];
      const spec = getProductSpecForVendor(
        selection.vendorId,
        id,
        selection.products[id].sizeId
      );
      const pdfW = spec.finishedWidthMm + spec.bleedMm * 2;
      const pdfH = spec.finishedHeightMm + spec.bleedMm * 2;
      return `${product.shortNameZh} 成品 ${spec.finishedWidthMm}×${spec.finishedHeightMm}mm（含四周各 ${spec.bleedMm}mm 出血＝${pdfW}×${pdfH}mm）`;
    });

    checks.push({
      id: 'pdf-size-bleed',
      title: 'PDF 實際頁面尺寸與出血設定',
      status: vendor.verificationStatus === 'generic' ? 'pass' : 'warning',
      statusLabel:
        vendor.verificationStatus === 'generic'
          ? '已套用參考尺寸與出血'
          : '已設定尺寸（印刷廠規範待確認）',
      measuredValue: `${enabledIds.length} 項品項已設定`,
      detail: `${sizeSummaries.join('；')}。${
        vendor.verificationStatus === 'pending_verification'
          ? `目前選用「${vendor.nameZh}」參考參數仍屬待確認狀態，送印前請向印刷廠確認最終出血與裁切公差。`
          : '輸出 PDF 將以真實毫米尺寸建立並附細緻裁切參考線，送印前仍建議請印刷廠確認出血寬度。'
      }`,
    });
  }

  // 2. True Effective Image Resolution (NO fake DPI or silent upscaling)
  if (!photoMetrics.loaded) {
    checks.push({
      id: 'effective-dpi',
      title: '婚紗照真實像素與有效解析度',
      status: 'warning',
      statusLabel: '尚未量測完成',
      detail: '正在讀取原始婚紗照尺寸；系統不會以放大低解析度圖片或改寫 DPI 標籤冒充高解析品質。',
    });
  } else {
    const meetsRecommended =
      photoMetrics.worstEffectiveDpi >= photoMetrics.recommendedDpiForWorst;
    const isUsableMinimum = photoMetrics.worstEffectiveDpi >= 110;

    checks.push({
      id: 'effective-dpi',
      title: '婚紗照真實像素與有效解析度',
      status: meetsRecommended ? 'pass' : 'warning',
      statusLabel: meetsRecommended
        ? '解析度符合建議基準'
        : isUsableMinimum
        ? '建議改用更原始高畫質原圖'
        : '解析度偏低，不建議放大印刷',
      measuredValue: `原始 ${photoMetrics.naturalWidth}×${photoMetrics.naturalHeight} px · 約 ${photoMetrics.worstEffectiveDpi} PPI`,
      detail: meetsRecommended
        ? `針對目前印製比例最大之「${photoMetrics.worstProductName}」，考量縮放比例（${Math.round(
            data.photoScale * 100
          )}%）後，真實有效解析度約 ${photoMetrics.worstEffectiveDpi} PPI（達建議門檻 ${
            photoMetrics.recommendedDpiForWorst
          } PPI）。`
        : `目前照片原始尺寸為 ${photoMetrics.naturalWidth}×${photoMetrics.naturalHeight} px，套用至「${photoMetrics.worstProductName}」（縮放 ${Math.round(
            data.photoScale * 100
          )}%）時，真實有效解析度約 ${photoMetrics.worstEffectiveDpi} PPI，低於建議值 ${
            photoMetrics.recommendedDpiForWorst
          } PPI。請避免使用 LINE 壓縮圖，建議向攝影師取得原始無壓縮高解析檔重新上傳。`,
    });
  }

  // 3. Honest Color Mode & PDF Format Check (NEVER pretend RGB is CMYK or PDF/X)
  checks.push({
    id: 'color-mode-pdf',
    title: '色彩模式與 PDF 印刷規格誠實檢核',
    status: 'warning',
    statusLabel: 'RGB PDF（需印刷廠轉色確認）',
    measuredValue: 'RGB · 標準 PDF（非 PDF/X）',
    detail:
      '本工具採瀏覽器本機運算，目前僅能輸出標準 RGB 色彩模式 PDF，非 CMYK 分色檔亦非 PDF/X 印刷認證檔案。送印時請告知印刷廠協助轉為 CMYK 並評估裸玫瑰與香檳金色調之紙本色差，必要時建議先付費打樣 1 張。',
  });

  // 4. Text Safe Margin & Overflow Check
  const overflowIssues: string[] = [];
  if (data.coupleNamesZh.trim().length > 18) {
    overflowIssues.push('新人中文姓名偏長，可能接近左右安全邊界');
  }
  if (data.coupleNamesEn.trim().length > 28) {
    overflowIssues.push('新人英文姓名偏長，建議精簡縮寫以保留留白');
  }
  if (data.venueName.trim().length > 26) {
    overflowIssues.push('婚宴場地名稱較長，請確認預覽畫面未擠壓邊框');
  }
  if (data.trafficNote.trim().length > 72) {
    overflowIssues.push('交通停車叮嚀超過 72 字，輸出卡片可能會截斷後半段文字');
  }
  if (data.welcomeQuote.trim().length > 42) {
    overflowIssues.push('迎賓引言短句較長，建議控制在 35 字內最優雅');
  }

  checks.push({
    id: 'safe-margin-overflow',
    title: '文字安全邊界與內容溢出檢查',
    status: overflowIssues.length === 0 ? 'pass' : 'warning',
    statusLabel: overflowIssues.length === 0 ? '安全邊界內' : '偵測到文字偏長',
    measuredValue:
      enabledIds.length > 0
        ? `安全邊界 ≥ ${
            getProductSpecForVendor(
              selection.vendorId,
              enabledIds[0],
              selection.products[enabledIds[0]].sizeId
            ).safeMarginMm
          } mm`
        : undefined,
    detail:
      overflowIssues.length === 0
        ? '目前填入之新人姓名、日期、場地、引言與交通文字長度皆位於設計安全邊界內，無文字溢出裁切線風險。'
        : `提醒事項：${overflowIssues.join('；')}。建議回到 STEP 03 微調字數後再次檢視預覽。`,
  });

  // 5. Font Loading & Print Safety
  const fontsLoaded =
    typeof document !== 'undefined' &&
    'fonts' in document &&
    document.fonts.status === 'loaded';
  checks.push({
    id: 'font-status',
    title: '字型載入與防掉字檢查',
    status: fontsLoaded ? 'pass' : 'warning',
    statusLabel: fontsLoaded ? '字型已載入（高解析封裝）' : '字型載入中',
    detail: fontsLoaded
      ? '中英文襯線／手寫字型皆已於本機瀏覽器載入完成。輸出 PDF 會將排版文字以高解析點陣圖層封裝，可避免印刷廠電腦缺字變形；惟須注意輸出結果非可再編輯之向量轉外框字型。'
      : '部分網頁字型仍在載入中，建議稍候 2 秒待字型顯示正常後再輸出檔案。',
  });

  // 6. Photo Crop & Framing Safety
  const cropWarnings: string[] = [];
  if (data.photoScale > 1.35) {
    cropWarnings.push(
      `目前照片放大倍率達 ${Math.round(data.photoScale * 100)}%，會同步降低實際印刷清晰度`
    );
  }
  if (data.photoPosY < 10 || data.photoPosY > 88) {
    cropWarnings.push('上下焦點貼近邊緣，請確認新人頭頂或裙擺未被裁切');
  }
  if (data.photoPosX < 15 || data.photoPosX > 85) {
    cropWarnings.push('左右焦點偏移較大，請再次檢查人像構圖平衡');
  }

  checks.push({
    id: 'photo-crop',
    title: '婚紗照裁切位置與安全構圖',
    status: cropWarnings.length === 0 ? 'pass' : 'warning',
    statusLabel: cropWarnings.length === 0 ? '構圖位置良好' : '建議再次檢視裁切',
    measuredValue: `焦點 X ${data.photoPosX}% / Y ${data.photoPosY}% · 縮放 ${Math.round(
      data.photoScale * 100
    )}%`,
    detail:
      cropWarnings.length === 0
        ? '婚紗照焦點與縮放比例落於安全構圖範圍，未過度貼近裁切邊緣。'
        : `${cropWarnings.join('；')}。可回到 STEP 02 微調後重新確認。`,
  });

  // 7. Couple Information Proofreading Confirmation (Requires real check)
  const missingInfo: string[] = [];
  if (!data.coupleNamesZh.trim() && !data.coupleNamesEn.trim()) {
    missingInfo.push('新人姓名');
  }
  if (!data.dateTimeLabel.trim()) {
    missingInfo.push('婚宴日期與時間');
  }
  if (!data.venueName.trim()) {
    missingInfo.push('婚宴場地名稱');
  }
  if (!data.venueAddress.trim()) {
    missingInfo.push('婚宴詳細地址');
  }

  const infoComplete = missingInfo.length === 0;
  checks.push({
    id: 'couple-proofread',
    title: '新人姓名、日期時間與婚宴地址校稿確認',
    status: infoComplete && selection.proofreadConfirmed ? 'pass' : 'manual_required',
    statusLabel:
      !infoComplete
        ? '尚有必填欄位未填寫'
        : selection.proofreadConfirmed
        ? '新人已完成人工校稿'
        : '請勾選下方校稿確認',
    detail: !infoComplete
      ? `尚未填寫：${missingInfo.join('、')}，請回到 STEP 03 補齊後再行送印。`
      : selection.proofreadConfirmed
      ? `您已確認「${data.coupleNamesZh} / ${data.coupleNamesEn}」、「${data.dateTimeLabel}」與「${data.venueName}（${data.venueAddress}）」皆核對無誤。`
      : '印刷品一旦開印即無法修改錯字，請務必逐字檢查姓名、星期幾、入席時間與地址後，勾選下方的「新人校稿確認」。',
  });

  // 8. Special Finishing Honesty Check
  checks.push({
    id: 'special-finishing',
    title: '特殊加工與數位燙金限制確認',
    status: finishing.requiresSeparatePlate ? 'manual_required' : 'pass',
    statusLabel: finishing.requiresSeparatePlate
      ? '需由印刷廠另製獨立加工稿'
      : '一般平面彩印（無需額外加工稿）',
    detail: finishing.honestLimitation,
  });

  return checks;
}
