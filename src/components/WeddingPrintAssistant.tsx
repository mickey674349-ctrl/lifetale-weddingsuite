import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  FileText,
  Copy,
  Package,
  ExternalLink,
  ShieldCheck,
  Calendar,
  RefreshCw,
  Info,
  FolderOpen,
  Wrench,
} from 'lucide-react';
import {
  FINISHING_PREFERENCES,
  PAPER_PREFERENCES,
  PRINT_PRODUCT_OPTIONS,
  PRINT_PRODUCT_ORDER,
  PRINT_VENDOR_ORDER,
  PRINT_VENDOR_PRESETS,
  createDefaultPrintSelection,
  getProductSpecForVendor,
} from '../data/printPresets';
import {
  PhotoResolutionMetrics,
  PrintAssistantSelection,
  PrintableProductId,
} from '../types/printAssistant';
import { THEME_CONFIGS, ThemeId, WeddingData } from '../types/wedding';
import {
  computePhotoResolutionMetrics,
  getEnabledProductIds,
  measurePhotoNaturalDimensions,
  runHonestPreflightChecks,
} from '../utils/printPreflight';
import {
  buildAfterSalesFixMessage,
  buildLineInquiryMessage,
  downloadPrintDeliveryZip,
  downloadPrintSpecSheetPdf,
} from '../utils/printDeliverables';
import { AtelierBotanicalDivider } from './ThemeDecorations';

interface WeddingPrintAssistantProps {
  themeId: ThemeId;
  data: WeddingData;
  onNotify: (msg: string) => void;
  onJumpToStep: (step: 1 | 2 | 3 | 4) => void;
}

export const WeddingPrintAssistant: React.FC<WeddingPrintAssistantProps> = ({
  themeId,
  data,
  onNotify,
  onJumpToStep,
}) => {
  const [selection, setSelection] = useState<PrintAssistantSelection>(() =>
    createDefaultPrintSelection(data.weddingDateIso)
  );
  const [naturalPhotoSize, setNaturalPhotoSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isGeneratingSpecPdf, setIsGeneratingSpecPdf] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [actionError, setActionError] = useState<{
    message: string;
    retryAction: 'spec' | 'zip';
  } | null>(null);
  const [emptyProductShake, setEmptyProductShake] = useState(false);

  const activeSeries = THEME_CONFIGS[themeId];
  const selectedVendor = PRINT_VENDOR_PRESETS[selection.vendorId];
  const enabledIds = useMemo(() => getEnabledProductIds(selection), [selection]);

  // Measure real natural pixel dimensions whenever the user uploads or changes photo
  useEffect(() => {
    let active = true;
    measurePhotoNaturalDimensions(data.photoUrl).then((dims) => {
      if (active) setNaturalPhotoSize(dims);
    });
    return () => {
      active = false;
    };
  }, [data.photoUrl]);

  // If couple edits names/date/venue after checking proofread, require re-confirmation
  useEffect(() => {
    setSelection((prev) =>
      prev.proofreadConfirmed ? { ...prev, proofreadConfirmed: false } : prev
    );
  }, [
    data.coupleNamesZh,
    data.coupleNamesEn,
    data.dateTimeLabel,
    data.venueName,
    data.venueAddress,
  ]);

  const photoMetrics: PhotoResolutionMetrics = useMemo(
    () => computePhotoResolutionMetrics(naturalPhotoSize, selection, data),
    [naturalPhotoSize, selection, data]
  );

  const preflightItems = useMemo(
    () => runHonestPreflightChecks(selection, data, photoMetrics),
    [selection, data, photoMetrics]
  );

  const lineInquiryText = useMemo(
    () => buildLineInquiryMessage(selection, data, themeId),
    [selection, data, themeId]
  );

  const toggleProduct = (productId: PrintableProductId) => {
    setSelection((prev) => ({
      ...prev,
      products: {
        ...prev.products,
        [productId]: {
          ...prev.products[productId],
          enabled: !prev.products[productId].enabled,
        },
      },
    }));
  };

  const updateProductField = (
    productId: PrintableProductId,
    patch: { sizeId?: string; quantity?: number }
  ) => {
    setSelection((prev) => ({
      ...prev,
      products: {
        ...prev.products,
        [productId]: {
          ...prev.products[productId],
          ...patch,
        },
      },
    }));
  };

  const triggerEmptyProductWarning = () => {
    setEmptyProductShake(false);
    window.requestAnimationFrame(() => setEmptyProductShake(true));
    window.setTimeout(() => setEmptyProductShake(false), 450);
    onNotify('請先勾選至少一項欲印製的婚禮用品喔');
  };

  const handleCopyInquiry = async () => {
    if (enabledIds.length === 0) {
      triggerEmptyProductWarning();
      return;
    }
    try {
      await navigator.clipboard.writeText(lineInquiryText);
      onNotify('已複製 LINE 印刷詢價訊息，可直接貼給印刷廠客服');
    } catch {
      onNotify('已準備好詢價內容，請選取下方文字框複製');
    }
  };

  const handleDownloadSpecPdf = async () => {
    if (enabledIds.length === 0) {
      triggerEmptyProductWarning();
      return;
    }
    setActionError(null);
    setIsGeneratingSpecPdf(true);
    try {
      const filename = await downloadPrintSpecSheetPdf(
        selection,
        data,
        themeId,
        preflightItems,
        photoMetrics
      );
      onNotify(`已生成印刷廠專用需求規格單：${filename}`);
    } catch {
      setActionError({
        message: '產生印刷需求規格單 PDF 時發生暫時性狀況，請稍候再重新嘗試。',
        retryAction: 'spec',
      });
    } finally {
      setIsGeneratingSpecPdf(false);
    }
  };

  const handleDownloadZipPackage = async () => {
    if (enabledIds.length === 0) {
      triggerEmptyProductWarning();
      return;
    }
    setActionError(null);
    setIsGeneratingZip(true);
    try {
      const filename = await downloadPrintDeliveryZip(
        selection,
        data,
        themeId,
        preflightItems,
        photoMetrics,
        true
      );
      onNotify(`已打包並下載完整印製交付包：${filename}`);
    } catch {
      setActionError({
        message: '打包完整印製交付包時發生暫時性狀況，請確認網路或瀏覽器記憶體後再試一次。',
        retryAction: 'zip',
      });
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const handleCopyAfterSalesTemplate = async () => {
    const msg = buildAfterSalesFixMessage(data, themeId, selection);
    try {
      await navigator.clipboard.writeText(msg);
      onNotify('已複製檔案修正回報範本，請貼至官方 LINE @lifetale.studio');
    } catch {
      onNotify('請聯繫官方 LINE @lifetale.studio 並告知設計系列與檔案問題');
    }
  };

  const passCount = preflightItems.filter((i) => i.status === 'pass').length;

  return (
    <section
      id="print-assistant"
      className="border-t border-[#E3D7CA] bg-[#FBF8F4]/75 scroll-mt-14"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 py-14 sm:py-20 space-y-10">
        {/* Section Editorial Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <p className="text-xs tracking-[0.24em] text-[#AD8980] font-medium">
            WEDDING PRINT ASSISTANT · 婚禮印製交付助手
          </p>
          <h2 className="font-editorial-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#655047] text-balance">
            不懂印刷術語，也能安心交給印刷廠
          </h2>
          <AtelierBotanicalDivider />
          <p className="text-sm text-[#846E65] leading-relaxed">
            專為準新人設計的印前整理與溝通輔助工具。本平台維持純數位設計交付，不承接實體印刷、不代收印刷費亦不處理物流，協助您一次整理真實尺寸規格單、印前檢查與 LINE 詢價訊息。
          </p>
          <div className="pt-1 text-xs text-[#9B877E]">
            <span>目前套用系列：{activeSeries.nameZh}（{activeSeries.nameEn}）</span>
            <span aria-hidden="true"> · </span>
            <span>全程瀏覽器本機處理</span>
            <span aria-hidden="true"> · </span>
            <span>手機分享版與印刷廠用檔分開打包</span>
          </div>
        </div>

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (7 cols): Friendly Selection Flow */}
          <div className="lg:col-span-7 space-y-8">
            {/* Block 01: Printable Products, Size, Quantity, Sides & Target Date */}
            <div
              className={`rounded-2xl border border-[#E3D7CA] bg-[#F5F0E9]/85 p-5 sm:p-7 space-y-6 ${
                emptyProductShake ? 'animate-gentle-shake border-[#AD8980]' : ''
              }`}
            >
              <div className="space-y-1">
                <p className="text-xs tracking-[0.16em] text-[#AD8980] font-medium">
                  01 · 選擇欲印製的婚禮用品、尺寸與數量
                </p>
                <h3 className="font-editorial-serif text-xl font-semibold text-[#655047]">
                  勾選您打算送印的品項
                </h3>
                <p className="text-xs text-[#846E65]">
                  不同品項獨立套用各自尺寸與出血基準，絕不混用；僅需手機分享的電子喜帖會自動歸類至交付包的「手機分享版」資料夾。
                </p>
              </div>

              <div className="space-y-3.5">
                {PRINT_PRODUCT_ORDER.map((productId) => {
                  const product = PRINT_PRODUCT_OPTIONS[productId];
                  const cfg = selection.products[productId];
                  const spec = getProductSpecForVendor(
                    selection.vendorId,
                    productId,
                    cfg.sizeId
                  );

                  return (
                    <div
                      key={productId}
                      className={`rounded-xl border p-4 transition-colors ${
                        cfg.enabled
                          ? 'border-[#AD8980] bg-[#FBF8F4]'
                          : 'border-[#E5D9CC] bg-[#FBF8F4]/55'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => toggleProduct(productId)}
                          aria-pressed={cfg.enabled}
                          className="flex items-start gap-3 text-left flex-1 min-h-[44px]"
                        >
                          <span
                            className={`mt-0.5 h-5 w-5 rounded-md border shrink-0 inline-flex items-center justify-center transition-colors ${
                              cfg.enabled
                                ? 'bg-[#655047] border-[#655047] text-[#F5F0E9]'
                                : 'border-[#C9B9AA] bg-white'
                            }`}
                          >
                            {cfg.enabled && <Check className="h-3.5 w-3.5" />}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#655047]">
                              {product.nameZh}
                              <span className="ml-2 text-xs font-normal text-[#AD8980]">
                                {product.categoryLabel}
                              </span>
                            </p>
                            <p className="text-xs text-[#846E65] mt-0.5 leading-relaxed">
                              {product.description}
                            </p>
                          </div>
                        </button>
                      </div>

                      {cfg.enabled && (
                        <div className="mt-4 pt-4 border-t border-[#EAE0D5] grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                          {/* Size Selector */}
                          <div className="sm:col-span-7">
                            <label
                              htmlFor={`size-${productId}`}
                              className="block text-xs font-medium text-[#846E65] mb-1.5"
                            >
                              印製尺寸
                            </label>
                            <select
                              id={`size-${productId}`}
                              value={cfg.sizeId}
                              onChange={(e) =>
                                updateProductField(productId, {
                                  sizeId: e.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-[#DFD2C4] bg-[#F5F0E9] px-3 py-2.5 min-h-[44px] text-xs sm:text-sm text-[#655047] focus:outline-none focus:border-[#AD8980]"
                            >
                              {product.sizeOptions.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                            <p className="text-[11px] text-[#9B877E] mt-1 tabular-nums">
                              參考出血：四周各 {spec.bleedMm} mm · 安全邊界 {spec.safeMarginMm} mm
                            </p>
                          </div>

                          {/* Quantity Input + Presets */}
                          <div className="sm:col-span-5">
                            <label
                              htmlFor={`qty-${productId}`}
                              className="block text-xs font-medium text-[#846E65] mb-1.5"
                            >
                              印製數量（張）
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                id={`qty-${productId}`}
                                type="number"
                                min={1}
                                max={2000}
                                value={cfg.quantity}
                                onChange={(e) =>
                                  updateProductField(productId, {
                                    quantity: Math.max(
                                      1,
                                      Math.min(2000, Number(e.target.value) || 1)
                                    ),
                                  })
                                }
                                className="w-24 rounded-xl border border-[#DFD2C4] bg-[#F5F0E9] px-3 py-2 min-h-[44px] text-sm text-[#655047] tabular-nums focus:outline-none focus:border-[#AD8980]"
                              />
                              <div className="flex flex-wrap gap-1">
                                {product.quantityPresets.map((q) => (
                                  <button
                                    key={q}
                                    type="button"
                                    onClick={() =>
                                      updateProductField(productId, { quantity: q })
                                    }
                                    className={`min-h-[34px] px-2.5 rounded-lg text-xs tabular-nums border transition-colors ${
                                      cfg.quantity === q
                                        ? 'bg-[#655047] border-[#655047] text-[#F5F0E9]'
                                        : 'bg-[#F5F0E9] border-[#DFD2C4] text-[#846E65] hover:border-[#AD8980]'
                                    }`}
                                  >
                                    {q}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sides & Expected Receive Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E3D7CA]">
                <div>
                  <span className="block text-xs font-medium text-[#846E65] mb-2">
                    單面或雙面印刷
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelection((prev) => ({ ...prev, sides: 'single' }))
                      }
                      className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                        selection.sides === 'single'
                          ? 'bg-[#655047] border-[#655047] text-[#F5F0E9]'
                          : 'bg-[#FBF8F4] border-[#DFD2C4] text-[#655047] hover:border-[#AD8980]'
                      }`}
                    >
                      單面印刷
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelection((prev) => ({ ...prev, sides: 'double' }))
                      }
                      className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                        selection.sides === 'double'
                          ? 'bg-[#655047] border-[#655047] text-[#F5F0E9]'
                          : 'bg-[#FBF8F4] border-[#DFD2C4] text-[#655047] hover:border-[#AD8980]'
                      }`}
                    >
                      雙面印刷
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="expected-receive-date"
                    className="flex items-center gap-1.5 text-xs font-medium text-[#846E65] mb-2"
                  >
                    <Calendar className="h-3.5 w-3.5 text-[#AD8980]" />
                    預計希望收到成品日期
                  </label>
                  <input
                    id="expected-receive-date"
                    type="date"
                    value={selection.expectedReceiveDate}
                    onChange={(e) =>
                      setSelection((prev) => ({
                        ...prev,
                        expectedReceiveDate: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#DFD2C4] bg-[#FBF8F4] px-3.5 py-2.5 min-h-[44px] text-sm text-[#655047] tabular-nums focus:outline-none focus:border-[#AD8980]"
                  />
                  <p className="text-[11px] text-[#9B877E] mt-1">
                    建議至少預留婚宴前 7–14 天作為打樣與交件緩衝，實際交期請以印刷廠回覆為準。
                  </p>
                </div>
              </div>
            </div>

            {/* Block 02: Plain-Language Paper & Finishing Selection with Swatches */}
            <div className="rounded-2xl border border-[#E3D7CA] bg-[#F5F0E9]/85 p-5 sm:p-7 space-y-6">
              <div className="space-y-1">
                <p className="text-xs tracking-[0.16em] text-[#AD8980] font-medium">
                  02 · 紙材手感與加工偏好（免懂術語白話挑選）
                </p>
                <h3 className="font-editorial-serif text-xl font-semibold text-[#655047]">
                  選擇喜歡的紙張質感
                </h3>
                <p className="text-xs text-[#846E65]">
                  下方照片皆為材質效果示意，實際厚度與紙色請向印刷廠確認現場紙樣。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PAPER_PREFERENCES.map((paper) => {
                  const isSelected = selection.paperId === paper.id;
                  return (
                    <button
                      key={paper.id}
                      type="button"
                      onClick={() =>
                        setSelection((prev) => ({ ...prev, paperId: paper.id }))
                      }
                      aria-pressed={isSelected}
                      className={`text-left rounded-xl border overflow-hidden transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#655047] bg-[#FBF8F4] ring-1 ring-[#D1ADA2]/70'
                          : 'border-[#E3D7CA] bg-[#FBF8F4]/70 hover:border-[#C5AA7C]'
                      }`}
                    >
                      <div>
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFE7DF]">
                          <img
                            src={paper.swatchImage}
                            alt={`${paper.nameZh} 效果示意`}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 bg-[#3C2F2A]/75 text-[#F5F0E9] text-[10px] px-2 py-0.5 rounded">
                            效果示意
                          </span>
                        </div>
                        <div className="p-3.5 space-y-1.5">
                          <h4 className="text-sm font-semibold text-[#655047]">
                            {paper.nameZh}
                          </h4>
                          <p className="text-[11px] text-[#AD8980]">
                            {paper.commonVendorNames}
                          </p>
                          <p className="text-xs text-[#846E65] leading-relaxed">
                            {paper.plainDescription}
                          </p>
                        </div>
                      </div>
                      <div className="px-3.5 pb-3.5 pt-1 text-[11px] font-medium text-[#655047]">
                        {isSelected ? '✓ 已選擇此紙材偏好' : '點選參考此紙材'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Printing & Special Finishing Preferences */}
              <div className="pt-4 border-t border-[#E3D7CA] space-y-3.5">
                <div>
                  <h4 className="font-editorial-serif text-lg font-semibold text-[#655047]">
                    彩色印刷與特殊加工偏好
                  </h4>
                  <p className="text-xs text-[#846E65] mt-0.5">
                    重要說明：數位香檳金視覺不等於實體燙金；若需實體燙金、壓紋或打凸，需另與印刷廠確認獨立加工黑稿與開版費用。
                  </p>
                </div>

                <div className="space-y-3">
                  {FINISHING_PREFERENCES.map((finish) => {
                    const isSelected = selection.finishingId === finish.id;
                    return (
                      <button
                        key={finish.id}
                        type="button"
                        onClick={() =>
                          setSelection((prev) => ({
                            ...prev,
                            finishingId: finish.id,
                          }))
                        }
                        aria-pressed={isSelected}
                        className={`w-full text-left rounded-xl border p-4 transition-all flex flex-col sm:flex-row gap-4 items-start ${
                          isSelected
                            ? 'border-[#655047] bg-[#FBF8F4]'
                            : 'border-[#E3D7CA] bg-[#FBF8F4]/65 hover:border-[#C5AA7C]'
                        }`}
                      >
                        {finish.swatchImage && (
                          <div className="relative w-full sm:w-28 aspect-[4/3] shrink-0 overflow-hidden rounded-lg border border-[#E3D7CA]">
                            <img
                              src={finish.swatchImage}
                              alt={`${finish.nameZh} 效果示意`}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                            />
                            <span className="absolute bottom-1.5 left-1.5 bg-[#3C2F2A]/80 text-[#F5F0E9] text-[10px] px-1.5 py-0.5 rounded">
                              效果示意
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-[#655047]">
                              {finish.nameZh}
                            </p>
                            <span
                              className={`h-5 w-5 rounded-full border shrink-0 inline-flex items-center justify-center ${
                                isSelected
                                  ? 'bg-[#655047] border-[#655047] text-[#F5F0E9]'
                                  : 'border-[#C9B9AA]'
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </span>
                          </div>
                          <p className="text-xs text-[#846E65] leading-relaxed">
                            {finish.plainDescription}
                          </p>
                          <p className="text-[11px] text-[#AD8980] leading-relaxed pt-0.5">
                            {finish.honestLimitation}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Custom Remarks */}
              <div className="pt-2">
                <label
                  htmlFor="print-remarks"
                  className="block text-xs font-medium text-[#846E65] mb-1.5"
                >
                  給印刷廠的補充備註（選填，將同步寫入需求規格單與 LINE 詢價訊息）
                </label>
                <input
                  id="print-remarks"
                  type="text"
                  value={selection.customRemarks}
                  onChange={(e) =>
                    setSelection((prev) => ({
                      ...prev,
                      customRemarks: e.target.value,
                    }))
                  }
                  placeholder="例如：迎賓海報希望裱 5mm 珍珠板、桌卡希望加附壓克力立架詢價"
                  className="w-full rounded-xl border border-[#DFD2C4] bg-[#FBF8F4] px-3.5 py-2.5 min-h-[44px] text-sm text-[#655047] placeholder:text-[#B3A198] focus:outline-none focus:border-[#AD8980]"
                />
              </div>
            </div>

            {/* Block 03: Extensible Print Vendor Presets & Real Official Links */}
            <div className="rounded-2xl border border-[#E3D7CA] bg-[#F5F0E9]/85 p-5 sm:p-7 space-y-5">
              <div className="space-y-1">
                <p className="text-xs tracking-[0.16em] text-[#AD8980] font-medium">
                  03 · 印刷規格預設與印刷廠官方參考資訊
                </p>
                <h3 className="font-editorial-serif text-xl font-semibold text-[#655047]">
                  選擇參考規格或查看台灣常見印刷廠官網
                </h3>
                <p className="text-xs text-[#846E65] leading-relaxed">
                  尚未經過實際送印驗證之印刷廠參數皆標示為「待確認」；本平台與下列印刷廠無任何商業合作、抽成或代印關係，亦不虛構價格與交期。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRINT_VENDOR_ORDER.map((vendorId) => {
                  const vendor = PRINT_VENDOR_PRESETS[vendorId];
                  const isSelected = selection.vendorId === vendorId;
                  return (
                    <div
                      key={vendorId}
                      className={`rounded-xl border p-4 flex flex-col justify-between gap-3 transition-colors ${
                        isSelected
                          ? 'border-[#655047] bg-[#FBF8F4]'
                          : 'border-[#E3D7CA] bg-[#FBF8F4]/65'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setSelection((prev) => ({ ...prev, vendorId }))
                        }
                        aria-pressed={isSelected}
                        className="text-left space-y-1"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-semibold text-[#655047]">
                            {vendor.nameZh}
                          </span>
                          <span
                            className={`h-5 w-5 rounded-full border shrink-0 inline-flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#655047] border-[#655047] text-[#F5F0E9]'
                                : 'border-[#C9B9AA]'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-[#AD8980]">
                          {vendor.statusBadgeText}
                        </p>
                        <p className="text-xs text-[#846E65] leading-relaxed">
                          {vendor.inquiryHint}
                        </p>
                      </button>

                      {vendor.officialUrl && (
                        <div className="pt-2 border-t border-[#EAE0D5] flex flex-wrap items-center gap-3 text-xs">
                          <a
                            href={vendor.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-[#655047] hover:underline underline-offset-4"
                          >
                            <span>前往官網</span>
                            <ExternalLink className="h-3.5 w-3.5 text-[#AD8980]" />
                          </a>
                          {vendor.guidelinesUrl && (
                            <a
                              href={vendor.guidelinesUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#846E65] hover:text-[#655047] hover:underline underline-offset-4"
                            >
                              <span>完稿須知參考</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-[#DFD2C4] bg-[#FBF8F4] p-3.5 text-xs text-[#846E65] flex items-start gap-2.5 leading-relaxed">
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-[#C5AA7C]" />
                <span>{selectedVendor.disclaimer}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (5 cols): Honest Automatic Preflight + One-Click Delivery Actions */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            {/* Block 04: Honest Automatic Preflight Inspection */}
            <div className="rounded-2xl border border-[#C5AA7C] bg-[#F5F0E9] p-5 sm:p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs tracking-[0.16em] text-[#AD8980] font-medium">
                    04 · AUTOMATIC PREFLIGHT CHECK
                  </p>
                  <h3 className="font-editorial-serif text-xl font-semibold text-[#655047] mt-0.5">
                    自動印前檢查（真實量測）
                  </h3>
                </div>
                <span className="text-xs font-medium text-[#846E65] tabular-nums whitespace-nowrap shrink-0 pt-1">
                  已確認 {passCount} / {preflightItems.length} 項
                </span>
              </div>

              <div className="space-y-2.5">
                {preflightItems.map((item) => {
                  const isPass = item.status === 'pass';
                  const isWarning = item.status === 'warning';
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[#E3D7CA] bg-[#FBF8F4] p-3.5 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          {isPass ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-[#5D7C69]" />
                          ) : isWarning ? (
                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-[#B46E58]" />
                          ) : (
                            <ClipboardCheck className="h-4 w-4 shrink-0 mt-0.5 text-[#A58554]" />
                          )}
                          <span className="text-xs sm:text-sm font-semibold text-[#655047]">
                            {item.title}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-medium whitespace-nowrap shrink-0 ${
                            isPass
                              ? 'text-[#5D7C69]'
                              : isWarning
                              ? 'text-[#B46E58]'
                              : 'text-[#A58554]'
                          }`}
                        >
                          {item.statusLabel}
                        </span>
                      </div>
                      {item.measuredValue && (
                        <p className="text-[11px] font-medium text-[#AD8980] pl-6 tabular-nums">
                          實測數據：{item.measuredValue}
                        </p>
                      )}
                      <p className="text-xs text-[#846E65] leading-relaxed pl-6">
                        {item.detail}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Mandatory Couple Proofreading Checkbox */}
              <div className="rounded-xl border border-[#D1ADA2] bg-[#FBF8F4] p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#655047]">
                    新人送印前文字校稿確認
                  </span>
                  <button
                    type="button"
                    onClick={() => onJumpToStep(3)}
                    className="text-xs text-[#AD8980] hover:text-[#655047] underline underline-offset-4"
                  >
                    回 STEP 03 修改文字
                  </button>
                </div>
                <p className="text-xs text-[#846E65] leading-relaxed">
                  姓名：{data.coupleNamesZh || '（未填寫）'} / {data.coupleNamesEn || '（未填寫）'}
                  <br />
                  日期：{data.dateTimeLabel || '（未填寫）'}
                  <br />
                  地點：{data.venueName || '（未填寫）'}（{data.venueAddress || '（未填寫）'}）
                </p>
                <label className="flex items-start gap-2.5 pt-1 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={selection.proofreadConfirmed}
                    onChange={(e) =>
                      setSelection((prev) => ({
                        ...prev,
                        proofreadConfirmed: e.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4 rounded accent-[#655047] cursor-pointer"
                  />
                  <span className="text-xs font-medium text-[#655047] leading-relaxed">
                    我已逐字核對以上新人姓名、婚宴日期、星期時間與地址皆正確無誤，並了解送印前須由印刷廠最終確認檔案與打樣。
                  </span>
                </label>
              </div>
            </div>

            {/* Block 05: One-Click Spec PDF, LINE Inquiry & Complete ZIP Package */}
            <div className="rounded-2xl border border-[#E3D7CA] bg-[#F5F0E9] p-5 sm:p-6 space-y-5">
              <div className="space-y-1">
                <p className="text-xs tracking-[0.16em] text-[#AD8980] font-medium">
                  05 · 一鍵輸出與印刷廠溝通交付
                </p>
                <h3 className="font-editorial-serif text-xl font-semibold text-[#655047]">
                  產出規格單、詢價訊息與交付包
                </h3>
              </div>

              {actionError && (
                <div
                  role="alert"
                  className="rounded-xl border border-[#AD8980] bg-[#FBF8F4] p-3.5 flex items-center justify-between gap-3"
                >
                  <span className="text-xs text-[#655047]">{actionError.message}</span>
                  <button
                    type="button"
                    onClick={() =>
                      actionError.retryAction === 'spec'
                        ? handleDownloadSpecPdf()
                        : handleDownloadZipPackage()
                    }
                    className="min-h-[40px] rounded-lg bg-[#655047] px-3 py-1.5 text-xs font-medium text-[#F5F0E9] inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    重新嘗試
                  </button>
                </div>
              )}

              <div className="space-y-2.5">
                {/* 1. One-click Complete Print Delivery ZIP */}
                <button
                  type="button"
                  disabled={isGeneratingZip}
                  onClick={handleDownloadZipPackage}
                  className="w-full min-h-[50px] rounded-xl bg-[#655047] hover:bg-[#534038] px-4 py-3 text-sm font-medium text-[#F5F0E9] inline-flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-60"
                >
                  <Package className="h-4 w-4 text-[#E6CBC3] shrink-0" />
                  <span>
                    {isGeneratingZip
                      ? '正在分類打包完整交付 ZIP...'
                      : '一鍵下載完整印製交付包（ZIP）'}
                  </span>
                </button>

                {/* 2. One-click Print Spec Sheet PDF */}
                <button
                  type="button"
                  disabled={isGeneratingSpecPdf}
                  onClick={handleDownloadSpecPdf}
                  className="w-full min-h-[46px] rounded-xl border border-[#C5AA7C] bg-[#FBF8F4] hover:bg-[#EFE7DF] px-4 py-2.5 text-sm font-medium text-[#655047] inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                >
                  <FileText className="h-4 w-4 text-[#AD8980] shrink-0" />
                  <span>
                    {isGeneratingSpecPdf
                      ? '正在生成 PDF 需求規格單...'
                      : '一鍵下載印刷需求規格單（PDF）'}
                  </span>
                </button>

                {/* 3. One-click Copy LINE Inquiry Message */}
                <button
                  type="button"
                  onClick={handleCopyInquiry}
                  className="w-full min-h-[46px] rounded-xl border border-[#DFD2C4] bg-[#FBF8F4] hover:border-[#AD8980] px-4 py-2.5 text-sm font-medium text-[#655047] inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Copy className="h-4 w-4 text-[#AD8980] shrink-0" />
                  <span>一鍵複製 LINE 印刷詢價訊息</span>
                </button>
              </div>

              {/* Transparent ZIP Folder Structure Preview */}
              <div className="rounded-xl border border-[#E3D7CA] bg-[#FBF8F4] p-4 space-y-2 text-xs text-[#846E65]">
                <p className="font-semibold text-[#655047] flex items-center gap-1.5">
                  <FolderOpen className="h-3.5 w-3.5 text-[#C5AA7C]" />
                  <span>ZIP 交付包自動分類清單（含繁體中文清晰檔名）</span>
                </p>
                <ul className="space-y-1 pl-1 leading-relaxed">
                  <li>
                    <strong className="text-[#655047]">01_手機分享版／</strong>
                    手機電子喜帖 9:16、LINE 交通提醒卡（純手機轉傳）
                  </li>
                  <li>
                    <strong className="text-[#655047]">02_印刷廠交付用／</strong>
                    印刷需求規格單 PDF、各品項含出血 RGB PDF、成品視覺參考圖 PNG
                  </li>
                  <li>
                    <strong className="text-[#655047]">03_新人校稿與送印須知／</strong>
                    新人校稿確認單、特殊加工限制說明、LINE 詢價文字檔
                  </li>
                </ul>
                <p className="text-[11px] text-[#AD8980] pt-1">
                  ※ 免費體驗下載之檔案含低調預覽浮水印，供確認規格與向印刷廠詢價評估；無浮水印正式完稿檔請透過套組訂購方案由顧問交付。
                </p>
              </div>

              {/* Preview Box of LINE Inquiry Message */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#846E65]">
                  <span>LINE / Email 印刷詢價訊息預覽</span>
                  <button
                    type="button"
                    onClick={handleCopyInquiry}
                    className="text-[#AD8980] hover:text-[#655047] underline underline-offset-4"
                  >
                    複製全文
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={7}
                  value={lineInquiryText}
                  aria-label="LINE 印刷詢價訊息預覽"
                  className="w-full rounded-xl border border-[#E3D7CA] bg-[#FBF8F4] p-3 text-xs leading-relaxed text-[#655047] focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Operational Responsibility & After-Sales Digital Fix Guarantee */}
            <div className="rounded-2xl border border-[#E3D7CA] bg-[#FBF8F4] p-5 space-y-3 text-xs text-[#846E65] leading-relaxed">
              <p className="font-semibold text-[#655047] flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#C5AA7C]" />
                <span>營運責任邊界與數位檔案售後修正機制</span>
              </p>
              <p>
                LifeTale WeddingSuite 專注於數位婚禮設計與印前交付輔助，不承接實體印刷、不代收印刷費，亦不處理實體物流；實體紙張選擇、打樣、付款及取件交期均由新人與印刷服務商自行確認。
              </p>
              <p>
                若印刷廠回報數位完稿檔案本身存在尺寸設定、出血裁切線或輸出格式異常，我們提供合理的數位檔案售後修正協助。
              </p>
              <button
                type="button"
                onClick={handleCopyAfterSalesTemplate}
                className="min-h-[40px] rounded-xl border border-[#DFD2C4] bg-[#F5F0E9] hover:border-[#AD8980] px-3.5 py-2 text-xs font-medium text-[#655047] inline-flex items-center gap-1.5 transition-colors"
              >
                <Wrench className="h-3.5 w-3.5 text-[#AD8980]" />
                <span>複製數位檔案異常回報範本（LINE @lifetale.studio）</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
