import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import {
  FINISHING_PREFERENCES,
  PAPER_PREFERENCES,
  PRINT_PRODUCT_OPTIONS,
  PRINT_VENDOR_PRESETS,
  getProductSpecForVendor,
} from '../data/printPresets';
import {
  PhotoResolutionMetrics,
  PreflightCheckItem,
  PrintAssistantSelection,
  PrintableProductId,
} from '../types/printAssistant';
import { THEME_CONFIGS, ThemeId, WeddingData } from '../types/wedding';
import { renderWeddingAssetCanvas } from './canvasExporter';
import { getEnabledProductIds } from './printPreflight';

function sanitizeFileSegment(raw: string, fallback: string): string {
  const cleaned = raw
    .trim()
    .replace(/[\\/:*?"<>|\s]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  return cleaned.slice(0, 24) || fallback;
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function buildLineInquiryMessage(
  selection: PrintAssistantSelection,
  data: WeddingData,
  themeId: ThemeId
): string {
  const series = THEME_CONFIGS[themeId];
  const vendor = PRINT_VENDOR_PRESETS[selection.vendorId];
  const paper =
    PAPER_PREFERENCES.find((p) => p.id === selection.paperId) ??
    PAPER_PREFERENCES[0];
  const finishing =
    FINISHING_PREFERENCES.find((f) => f.id === selection.finishingId) ??
    FINISHING_PREFERENCES[0];
  const enabledIds = getEnabledProductIds(selection);

  const itemLines =
    enabledIds.length > 0
      ? enabledIds.map((id, idx) => {
          const product = PRINT_PRODUCT_OPTIONS[id];
          const cfg = selection.products[id];
          const spec = getProductSpecForVendor(
            selection.vendorId,
            id,
            cfg.sizeId
          );
          return `  ${idx + 1}. ${product.nameZh}：成品 ${spec.finishedWidthMm} × ${spec.finishedHeightMm} mm（含四周各 ${spec.bleedMm}mm 出血）、數量 ${cfg.quantity} 張`;
        })
      : ['  （尚未勾選具體印製項目）'];

  const sidesLabel =
    selection.sides === 'double'
      ? '雙面印刷（背面可沿用素色紙面或依貴廠建議配置）'
      : '單面印刷';

  const finishingInquiryNote = finishing.requiresSeparatePlate
    ? `${finishing.nameZh}\n  ※ 註：目前檔案僅含彩色視覺參考，尚未獨立製作燙金／壓紋黑稿，請問貴廠是否能協助評估開版費與加工稿製作方式？`
    : `${finishing.nameZh}（無需實體燙金開版，僅需一般彩色印刷）`;

  const remarksBlock = selection.customRemarks.trim()
    ? `\n• 其他備註：${selection.customRemarks.trim()}`
    : '';

  return [
    '您好，我想詢問婚禮印刷品印製報價與完稿確認，以下為目前需求規格：',
    '',
    `• 設計風格參考：${series.nameZh}（${series.nameEn}）`,
    `• 參考印刷廠規範：${vendor.nameZh}（以貴廠實際規範為準）`,
    '• 欲印製品項、尺寸與數量：',
    ...itemLines,
    `• 單／雙面印刷：${sidesLabel}`,
    `• 紙材偏好：${paper.nameZh}（${paper.commonVendorNames}）`,
    `• 印刷／加工需求：${finishingInquiryNote}`,
    `• 檔案格式說明：標準 RGB PDF（含出血參考）＋ PNG 視覺參考圖`,
    `• 預計希望收到成品日期：${selection.expectedReceiveDate || '待與貴廠確認'}（婚宴日期：${data.weddingDateIso || '未填寫'}）${remarksBlock}`,
    '',
    '煩請協助確認以下四點，非常感謝您：',
    '1. 我們準備的 RGB PDF 檔案是否相容貴廠印刷流程，以及 RGB 轉 CMYK 之建議？',
    '2. 是否建議先進行單張數位打樣？打樣費用大約多少？',
    '3. 上述品項、紙材與數量的正式報價？',
    '4. 若確認下單與完稿後，實際預計的交貨／取件日期是否趕得上預計收件日？',
  ].join('\n');
}

export function buildAfterSalesFixMessage(
  data: WeddingData,
  themeId: ThemeId,
  selection: PrintAssistantSelection
): string {
  const series = THEME_CONFIGS[themeId];
  const enabledNames = getEnabledProductIds(selection)
    .map((id) => PRINT_PRODUCT_OPTIONS[id].shortNameZh)
    .join('、');

  return [
    '您好，我是使用 LifeTale WeddingSuite 的新人，想回報數位完稿檔案的規格或輸出異常，請求協助修正：',
    `• 設計系列：${series.nameZh}（${series.nameEn}）`,
    `• 新人姓名：${data.coupleNamesZh || '未填寫'}`,
    `• 相關品項：${enabledNames || '未指定'}`,
    '• 印刷廠回饋或遇到的問題說明：（請在此貼上印刷廠客服提醒的出血、尺寸或裁切問題）',
  ].join('\n');
}

function drawWrappedLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
): number {
  const paragraphs = text.split('\n');
  let y = startY;

  for (const para of paragraphs) {
    const chars = Array.from(para);
    let current = '';
    for (const ch of chars) {
      const test = current + ch;
      if (ctx.measureText(test).width > maxWidth && current.length > 0) {
        ctx.fillText(current, x, y);
        y += lineHeight;
        current = ch;
      } else {
        current = test;
      }
    }
    if (current || para === '') {
      ctx.fillText(current, x, y);
      y += lineHeight;
    }
  }
  return y;
}

/**
 * Generates a crisp A4 Traditional Chinese PDF Spec Sheet for print shops.
 * Uses high-DPI Canvas rendering embedded into true 210×297mm jsPDF so CJK typography
 * renders cleanly with zero font corruption.
 */
export async function generatePrintSpecSheetPdfBlob(
  selection: PrintAssistantSelection,
  data: WeddingData,
  themeId: ThemeId,
  preflightItems: PreflightCheckItem[],
  photoMetrics: PhotoResolutionMetrics
): Promise<Blob> {
  const series = THEME_CONFIGS[themeId];
  const vendor = PRINT_VENDOR_PRESETS[selection.vendorId];
  const paper =
    PAPER_PREFERENCES.find((p) => p.id === selection.paperId) ??
    PAPER_PREFERENCES[0];
  const finishing =
    FINISHING_PREFERENCES.find((f) => f.id === selection.finishingId) ??
    FINISHING_PREFERENCES[0];
  const enabledIds = getEnabledProductIds(selection);

  // Render A4 at 2x crisp resolution (1654 × 2339 px ≈ 200 DPI sharp document)
  const w = 1654;
  const h = 2339;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('無法建立規格單畫布');

  // Pearl Ivory background + Champagne Gold border
  ctx.fillStyle = '#F5F0E9';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#C5AA7C';
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, w - 96, h - 96);

  ctx.strokeStyle = 'rgba(209, 173, 162, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(62, 62, w - 124, h - 124);

  const marginX = 110;
  const contentW = w - marginX * 2;
  let y = 136;

  // Header
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#AD8980';
  ctx.font = '500 24px "Plus Jakarta Sans", "Noto Sans TC", sans-serif';
  ctx.fillText('LIFETALE WEDDINGSUITE · WEDDING PRINT ASSISTANT', marginX, y);
  y += 40;

  ctx.fillStyle = '#655047';
  ctx.font = '600 50px "Noto Serif TC", "Cormorant Garamond", serif';
  ctx.fillText('婚禮印刷需求規格單（印刷廠交付專用）', marginX, y);
  y += 72;

  ctx.fillStyle = '#846E65';
  ctx.font = '400 24px "Noto Sans TC", sans-serif';
  const generatedDate = new Date().toLocaleDateString('zh-TW');
  ctx.fillText(
    `建立日期：${generatedDate}   ｜   設計系列：${series.nameZh}（${series.nameEn}）   ｜   預計收件日：${
      selection.expectedReceiveDate || '待確認'
    }`,
    marginX,
    y
  );
  y += 48;

  // Divider line
  ctx.strokeStyle = '#C5AA7C';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(marginX, y);
  ctx.lineTo(w - marginX, y);
  ctx.stroke();
  y += 38;

  // Section 1: Couple & Reference Vendor Summary
  ctx.fillStyle = '#655047';
  ctx.font = '600 30px "Noto Serif TC", serif';
  ctx.fillText('一、基本資訊與參考印刷廠規格', marginX, y);
  y += 48;

  ctx.fillStyle = '#FBF8F4';
  ctx.fillRect(marginX, y, contentW, 210);
  ctx.strokeStyle = '#DFD2C4';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(marginX, y, contentW, 210);

  ctx.fillStyle = '#655047';
  ctx.font = '400 25px "Noto Sans TC", sans-serif';
  const infoText = [
    `新人姓名：${data.coupleNamesZh || '未填寫'}（${data.coupleNamesEn || '未填寫'}）`,
    `婚宴時間：${data.dateTimeLabel || '未填寫'}`,
    `婚宴地點：${data.venueName || '未填寫'}（${data.venueAddress || '未填寫'}）`,
    `參考規格設定：${vendor.nameZh}【${vendor.statusBadgeText}】`,
  ].join('\n');
  drawWrappedLines(ctx, infoText, marginX + 28, y + 26, contentW - 56, 44);
  y += 248;

  // Section 2: Printable Items Table
  ctx.fillStyle = '#655047';
  ctx.font = '600 30px "Noto Serif TC", serif';
  ctx.fillText('二、欲印製婚禮品項、真實尺寸與出血參數', marginX, y);
  y += 48;

  // Table header
  ctx.fillStyle = '#EFE7DF';
  ctx.fillRect(marginX, y, contentW, 56);
  ctx.strokeStyle = '#D7C9BA';
  ctx.strokeRect(marginX, y, contentW, 56);
  ctx.fillStyle = '#655047';
  ctx.font = '600 22px "Noto Sans TC", sans-serif';
  ctx.fillText('品項名稱', marginX + 20, y + 16);
  ctx.fillText('成品尺寸 (mm)', marginX + 350, y + 16);
  ctx.fillText('出血 / 安全邊界', marginX + 660, y + 16);
  ctx.fillText('數量', marginX + 1020, y + 16);
  ctx.fillText('單雙面', marginX + 1180, y + 16);
  y += 56;

  const sidesShort = selection.sides === 'double' ? '雙面印刷' : '單面印刷';
  if (enabledIds.length === 0) {
    ctx.fillStyle = '#FBF8F4';
    ctx.fillRect(marginX, y, contentW, 64);
    ctx.strokeRect(marginX, y, contentW, 64);
    ctx.fillStyle = '#846E65';
    ctx.font = '400 23px "Noto Sans TC", sans-serif';
    ctx.fillText('尚未勾選欲印製品項（請返回助手勾選）', marginX + 20, y + 19);
    y += 64;
  } else {
    for (const id of enabledIds) {
      const product = PRINT_PRODUCT_OPTIONS[id];
      const cfg = selection.products[id];
      const spec = getProductSpecForVendor(selection.vendorId, id, cfg.sizeId);
      ctx.fillStyle = '#FBF8F4';
      ctx.fillRect(marginX, y, contentW, 74);
      ctx.strokeStyle = '#E3D7CA';
      ctx.strokeRect(marginX, y, contentW, 74);

      ctx.fillStyle = '#655047';
      ctx.font = '500 23px "Noto Sans TC", sans-serif';
      ctx.fillText(product.nameZh, marginX + 20, y + 24);
      ctx.font = '400 22px "Noto Sans TC", sans-serif';
      ctx.fillText(
        `${spec.finishedWidthMm} × ${spec.finishedHeightMm} mm`,
        marginX + 350,
        y + 24
      );
      ctx.fillText(
        `四周各 ${spec.bleedMm}mm / 安全 ${spec.safeMarginMm}mm`,
        marginX + 660,
        y + 24
      );
      ctx.fillText(`${cfg.quantity} 張`, marginX + 1020, y + 24);
      ctx.fillText(sidesShort, marginX + 1180, y + 24);
      y += 74;
    }
  }
  y += 40;

  // Section 3: Paper, Finishing & File Technical Spec
  ctx.fillStyle = '#655047';
  ctx.font = '600 30px "Noto Serif TC", serif';
  ctx.fillText('三、紙材偏好、加工說明與檔案技術規格', marginX, y);
  y += 48;

  ctx.fillStyle = '#FBF8F4';
  const techBoxHeight = 360;
  ctx.fillRect(marginX, y, contentW, techBoxHeight);
  ctx.strokeStyle = '#DFD2C4';
  ctx.strokeRect(marginX, y, contentW, techBoxHeight);

  ctx.fillStyle = '#655047';
  ctx.font = '400 23px "Noto Sans TC", sans-serif';
  const techLines = [
    `• 紙材偏好：${paper.nameZh}（${paper.commonVendorNames}）`,
    `• 加工偏好：${finishing.nameZh}`,
    `• 檔案格式：標準 RGB PDF（非 PDF/X 印刷認證檔）＋ PNG 視覺參考圖`,
    `• 色彩模式：RGB（瀏覽器本機產出，送印前請由印刷廠協助轉為 CMYK 並評估色差）`,
    `• 原始婚紗照量測：${
      photoMetrics.loaded
        ? `${photoMetrics.naturalWidth} × ${photoMetrics.naturalHeight} px（最低有效解析度約 ${photoMetrics.worstEffectiveDpi} PPI）`
        : '尚未量測'
    }`,
    `• 特殊加工提醒：數位香檳金不等於實體燙金；若需實體燙金／打凸／壓紋，須另依印刷廠規定製作獨立黑稿（K100）。`,
    `• 新人補充備註：${selection.customRemarks.trim() || '無'}`,
  ].join('\n');
  drawWrappedLines(ctx, techLines, marginX + 28, y + 26, contentW - 56, 44);
  y += techBoxHeight + 40;

  // Section 4: Preflight Status Summary
  ctx.fillStyle = '#655047';
  ctx.font = '600 30px "Noto Serif TC", serif';
  ctx.fillText('四、自動印前檢查摘要（本機真實量測結果）', marginX, y);
  y += 46;

  ctx.font = '400 22px "Noto Sans TC", sans-serif';
  for (const item of preflightItems) {
    if (y > h - 220) break;
    const badgeColor =
      item.status === 'pass'
        ? '#587864'
        : item.status === 'warning'
        ? '#AD6A55'
        : '#9A784B';
    ctx.fillStyle = badgeColor;
    ctx.fillText(`【${item.statusLabel}】`, marginX, y);
    ctx.fillStyle = '#655047';
    ctx.fillText(
      `${item.title}${item.measuredValue ? `（${item.measuredValue}）` : ''}`,
      marginX + 280,
      y
    );
    y += 40;
  }

  // Footer Responsibility Note
  ctx.strokeStyle = '#DFD2C4';
  ctx.beginPath();
  ctx.moveTo(marginX, h - 165);
  ctx.lineTo(w - marginX, h - 165);
  ctx.stroke();

  ctx.fillStyle = '#846E65';
  ctx.font = '400 20px "Noto Sans TC", sans-serif';
  drawWrappedLines(
    ctx,
    '營運責任聲明：本規格單由 LifeTale WeddingSuite 婚禮印製交付助手依新人實際填寫內容生成，僅供數位設計交付與印前溝通輔助。本平台不承接實體印刷、不代收印刷費用亦不處理物流，實體印製、紙樣確認、打樣與交貨均由新人與印刷廠直接確認。',
    marginX,
    h - 144,
    contentW,
    30
  );

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });
  const imgData = canvas.toDataURL('image/jpeg', 0.94);
  pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  return pdf.output('blob');
}

export async function downloadPrintSpecSheetPdf(
  selection: PrintAssistantSelection,
  data: WeddingData,
  themeId: ThemeId,
  preflightItems: PreflightCheckItem[],
  photoMetrics: PhotoResolutionMetrics
): Promise<string> {
  const blob = await generatePrintSpecSheetPdfBlob(
    selection,
    data,
    themeId,
    preflightItems,
    photoMetrics
  );
  const coupleSeg = sanitizeFileSegment(data.coupleNamesZh || data.coupleNamesEn, '新人');
  const filename = `LifeTale_印刷需求規格單_${coupleSeg}.pdf`;
  triggerBlobDownload(blob, filename);
  return filename;
}

/**
 * Generates a millimeter-accurate RGB PDF for a selected printable item,
 * including real bleed margins and subtle crop marks.
 */
export async function generatePrintableAssetPdfBlob(
  productId: PrintableProductId,
  selection: PrintAssistantSelection,
  data: WeddingData,
  themeId: ThemeId,
  includeWatermark: boolean
): Promise<{ blob: Blob; filename: string; pdfWidthMm: number; pdfHeightMm: number }> {
  const product = PRINT_PRODUCT_OPTIONS[productId];
  const cfg = selection.products[productId];
  const spec = getProductSpecForVendor(selection.vendorId, productId, cfg.sizeId);

  const pdfWidthMm = spec.finishedWidthMm + spec.bleedMm * 2;
  const pdfHeightMm = spec.finishedHeightMm + spec.bleedMm * 2;

  // Compute proportional pixel bleed matching canvas width (~1080-1188px)
  const baseCanvasW = product.sourceAssetTab === 'welcome-poster' ? 1188 : 1080;
  const bleedPx = Math.max(
    18,
    Math.round((spec.bleedMm / spec.finishedWidthMm) * baseCanvasW)
  );

  const canvas = await renderWeddingAssetCanvas({
    data,
    themeId,
    assetTab: product.sourceAssetTab,
    includeWatermark,
    bleedPx,
    drawCropMarks: true,
  });

  const orientation = pdfWidthMm > pdfHeightMm ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: [pdfWidthMm, pdfHeightMm],
    compress: true,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidthMm, pdfHeightMm, undefined, 'FAST');

  const filename = `${product.shortNameZh}_${spec.finishedWidthMm}x${spec.finishedHeightMm}mm_含${spec.bleedMm}mm出血_RGB.pdf`;
  return {
    blob: pdf.output('blob'),
    filename,
    pdfWidthMm,
    pdfHeightMm,
  };
}

function buildProofreadingText(
  selection: PrintAssistantSelection,
  data: WeddingData,
  themeId: ThemeId,
  preflightItems: PreflightCheckItem[]
): string {
  const series = THEME_CONFIGS[themeId];
  const statusLines = preflightItems.map(
    (item) =>
      `- [${item.statusLabel}] ${item.title}${
        item.measuredValue ? `（${item.measuredValue}）` : ''
      }\n  說明：${item.detail}`
  );

  return [
    '====================================================',
    '  LifeTale WeddingSuite｜新人送印前校稿確認單',
    '====================================================',
    `建立時間：${new Date().toLocaleString('zh-TW')}`,
    `設計系列：${series.nameZh}（${series.nameEn}）`,
    `新人校稿勾選狀態：${
      selection.proofreadConfirmed ? '已由新人勾選確認無誤' : '尚未勾選確認（送印前請務必逐字校對）'
    }`,
    '',
    '【一、婚禮文字內容逐字核對】',
    `1. 新人中文姓名：${data.coupleNamesZh || '（未填寫）'}`,
    `2. 新人英文姓名：${data.coupleNamesEn || '（未填寫）'}`,
    `3. 婚宴日期與入席時間：${data.dateTimeLabel || '（未填寫）'}`,
    `4. 倒數計算基準日：${data.weddingDateIso || '（未填寫）'}`,
    `5. 婚宴場地與廳別：${data.venueName || '（未填寫）'}`,
    `6. 婚宴詳細地址：${data.venueAddress || '（未填寫）'}`,
    `7. 交通與停車叮嚀：${data.trafficNote || '（未填寫）'}`,
    `8. 賓客桌次範例：${data.tableLabel || '（未填寫）'}`,
    `9. 婚宴當日時程：${data.timelineNote || '（未填寫）'}`,
    `10. 迎賓引言短句：${data.welcomeQuote || '（未填寫）'}`,
    '',
    '【二、自動印前檢查結果】',
    ...statusLines,
    '',
    '※ 提醒：實體印刷開印後恕無法更改文字，請雙方新人與長輩再次確認星期、日期、廳別與地址完全正確後再行委託印刷廠印製。',
  ].join('\n');
}

function buildPrintPrecautionsText(
  selection: PrintAssistantSelection
): string {
  const vendor = PRINT_VENDOR_PRESETS[selection.vendorId];
  return [
    '====================================================',
    '  LifeTale WeddingSuite｜送印注意事項與重要聲明',
    '====================================================',
    '',
    '一、檔案分類說明（請勿混淆使用）',
    '  • 01_手機分享版：適合透過 LINE、IG 或簡訊直接傳送給賓客，不建議用於實體印刷。',
    '  • 02_印刷廠交付用：包含「印刷需求規格單 PDF」、各品項「含出血參考 RGB PDF」與「成品視覺參考圖 PNG」，請將整個資料夾提供給印刷廠評估與完稿確認。',
    '  • 03_新人校稿與送印須知：供新人自我核對文字、貼上 LINE 詢價與備忘。',
    '',
    '二、色彩模式與打樣建議（誠實告知）',
    '  • 本系統於瀏覽器端輸出「標準 RGB PDF」，非 CMYK 亦非 PDF/X 印刷認證檔案。',
    '  • 送印前請務必由印刷廠協助轉為 CMYK 模式；若預算與時間允許，強烈建議正式大量印製前先做 1 張數位打樣，以確認裸玫瑰粉、象牙白與紙張吸墨後的真實色澤。',
    '',
    '三、特殊加工限制（重要）',
    '  • 設計中的「香檳燙金」、「金箔」與「火漆印章」皆為數位視覺效果，不等於實體紙本燙金加工。',
    '  • 若希望進行實體燙金、壓紋、打凸或局部上光，印刷廠通常會要求另備獨立加工黑稿（K100 刀模／分色稿）。本系統目前無法直接產出實體燙金加工稿，僅能提供視覺參考與需求規格單協助您與印刷廠溝通。',
    '',
    '四、印刷廠參考規格與責任邊界',
    `  • 本次選用參考設定：${vendor.nameZh}（${vendor.statusBadgeText}）`,
    `  • 說明：${vendor.disclaimer}`,
    '  • LifeTale WeddingSuite 僅提供數位設計與印前交付輔助服務，不承接實體印刷、不代收印刷費亦不處理物流。實體印刷報價、紙樣、打樣與交期均由新人與印刷廠直接確認。',
    '  • 若印刷廠回報數位完稿檔案本身有尺寸或輸出格式異常，歡迎聯繫官方 LINE @lifetale.studio，由專屬顧問協助數位檔修正。',
  ].join('\n');
}

/**
 * Generates and downloads the complete Traditional Chinese ZIP delivery package,
 * strictly separating Mobile Sharing vs. Print Shop Delivery files.
 */
export async function downloadPrintDeliveryZip(
  selection: PrintAssistantSelection,
  data: WeddingData,
  themeId: ThemeId,
  preflightItems: PreflightCheckItem[],
  photoMetrics: PhotoResolutionMetrics,
  includeWatermark = true
): Promise<string> {
  const zip = new JSZip();
  const series = THEME_CONFIGS[themeId];
  const enabledIds = getEnabledProductIds(selection);

  const mobileFolder = zip.folder('01_手機分享版');
  const printFolder = zip.folder('02_印刷廠交付用');
  const guideFolder = zip.folder('03_新人校稿與送印須知');

  if (!mobileFolder || !printFolder || !guideFolder) {
    throw new Error('無法建立交付包資料夾結構');
  }

  const canvasToPngBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
    new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('圖片轉換失敗'));
        },
        'image/png',
        0.95
      );
    });

  // 1. Mobile Sharing Assets (separated clearly from print shop files)
  const eInviteCanvas = await renderWeddingAssetCanvas({
    data,
    themeId,
    assetTab: 'e-invite',
    includeWatermark,
  });
  mobileFolder.file(
    '手機電子喜帖_9比16_手機分享版.png',
    await canvasToPngBlob(eInviteCanvas)
  );

  const lineTrafficCanvas = await renderWeddingAssetCanvas({
    data,
    themeId,
    assetTab: 'line-traffic',
    includeWatermark,
  });
  mobileFolder.file(
    'LINE賓客交通提醒卡_手機分享版.png',
    await canvasToPngBlob(lineTrafficCanvas)
  );

  // 2. Print Shop Delivery Folder
  const specPdfBlob = await generatePrintSpecSheetPdfBlob(
    selection,
    data,
    themeId,
    preflightItems,
    photoMetrics
  );
  printFolder.file('00_印刷需求規格單_請連同檔案提供印刷廠.pdf', specPdfBlob);

  const targetsToExport: PrintableProductId[] =
    enabledIds.length > 0 ? enabledIds : ['welcome-poster', 'table-card'];

  for (let i = 0; i < targetsToExport.length; i++) {
    const productId = targetsToExport[i];
    const product = PRINT_PRODUCT_OPTIONS[productId];
    const indexPrefix = String(i + 1).padStart(2, '0');

    // Millimeter-accurate RGB PDF with bleed & crop marks
    const pdfResult = await generatePrintableAssetPdfBlob(
      productId,
      selection,
      data,
      themeId,
      includeWatermark
    );
    printFolder.file(`${indexPrefix}_${pdfResult.filename}`, pdfResult.blob);

    // Visual reference PNG (clean preview for print shop operator to check layout)
    const refCanvas = await renderWeddingAssetCanvas({
      data,
      themeId,
      assetTab: product.sourceAssetTab,
      includeWatermark,
    });
    printFolder.file(
      `${indexPrefix}_${product.shortNameZh}_成品視覺參考圖.png`,
      await canvasToPngBlob(refCanvas)
    );
  }

  // 3. Couple Proofreading & Precautions Folder
  guideFolder.file(
    '新人校稿確認單.txt',
    buildProofreadingText(selection, data, themeId, preflightItems)
  );
  guideFolder.file(
    '送印注意事項與特殊加工限制說明.txt',
    buildPrintPrecautionsText(selection)
  );
  guideFolder.file(
    'LINE印刷詢價訊息_可直接複製貼上.txt',
    buildLineInquiryMessage(selection, data, themeId)
  );

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const dateTag = data.weddingDateIso || '2026';
  const seriesSeg = sanitizeFileSegment(series.nameZh, '婚禮視覺');
  const filename = `LifeTale_婚禮印製交付包_${seriesSeg}_${dateTag}.zip`;
  triggerBlobDownload(zipBlob, filename);
  return filename;
}
