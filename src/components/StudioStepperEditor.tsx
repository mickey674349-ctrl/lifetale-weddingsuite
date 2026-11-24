import React, { useRef } from 'react';
import {
  ImagePlus,
  RotateCcw,
  SlidersHorizontal,
  Check,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  Download,
  Lock,
  Film,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Printer,
} from 'lucide-react';
import {
  ASSET_META,
  DEFAULT_WEDDING_DATA,
  DEFAULT_WEDDING_PHOTO,
  PreviewAssetTab,
  StudioStep,
  THEME_CONFIGS,
  THEME_ORDER,
  ThemeId,
  WeddingData,
} from '../types/wedding';

interface StudioStepperEditorProps {
  currentStep: StudioStep;
  onChangeStep: (step: StudioStep) => void;
  themeId: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
  activeTab: PreviewAssetTab;
  onChangeTab: (tab: PreviewAssetTab) => void;
  data: WeddingData;
  onChangeData: (patch: Partial<WeddingData>) => void;
  onResetAll: () => void;
  onClearTextFields: () => void;
  validationErrorField: string | null;
  // Export & cooldown props for STEP 04
  isExporting: boolean;
  cooldownSeconds: number;
  validationHint: string | null;
  exportErrorMessage: string | null;
  shakeTrigger: boolean;
  onTriggerExport: () => void;
  onOpenOrderModal: (initialView?: 'pricing' | 'film') => void;
  onOpenPrintAssistant?: () => void;
  onNotify: (message: string) => void;
}

const STEPS: { step: StudioStep; code: string; label: string; shortLabel: string }[] = [
  { step: 1, code: 'STEP 01', label: '選擇婚禮美學', shortLabel: '選美學' },
  { step: 2, code: 'STEP 02', label: '上傳婚紗照片', shortLabel: '傳照片' },
  { step: 3, code: 'STEP 03', label: '填寫新人及婚宴資訊', shortLabel: '填資訊' },
  { step: 4, code: 'STEP 04', label: '預覽與下載完整套組', shortLabel: '下載套組' },
];

export const StudioStepperEditor: React.FC<StudioStepperEditorProps> = ({
  currentStep,
  onChangeStep,
  themeId,
  onSelectTheme,
  activeTab,
  onChangeTab,
  data,
  onChangeData,
  onResetAll,
  onClearTextFields,
  validationErrorField,
  isExporting,
  cooldownSeconds,
  validationHint,
  exportErrorMessage,
  shakeTrigger,
  onTriggerExport,
  onOpenOrderModal,
  onOpenPrintAssistant,
  onNotify,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedSeries = THEME_CONFIGS[themeId];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onNotify('請選擇 JPG、PNG 或 WebP 格式的婚紗照檔案');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChangeData({
          photoUrl: reader.result,
          isDefaultPhoto: false,
          photoScale: 1,
          photoPosX: 50,
          photoPosY: 28,
        });
        onNotify('已套用您的婚紗照，可微調焦點與構圖比例');
      }
    };
    reader.onerror = () => {
      onNotify('讀取照片時遇到一點狀況，請換一張照片或重新嘗試');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetPhoto = () => {
    onChangeData({
      photoUrl: DEFAULT_WEDDING_PHOTO,
      isDefaultPhoto: true,
      photoScale: 1,
      photoPosX: 50,
      photoPosY: 28,
    });
    onNotify('已恢復東亞新人精選示範婚紗照');
  };

  const inputBaseClass =
    'w-full rounded-xl border border-[#DFD2C4] bg-[#FBF8F4] px-3.5 py-2.5 min-h-[44px] text-sm text-[#655047] placeholder:text-[#B3A198] transition-colors focus:outline-none focus:border-[#AD8980] focus:ring-2 focus:ring-[#D1ADA2]/35';

  return (
    <div className="space-y-6">
      {/* 4-Step Boutique Atelier Stepper Bar */}
      <nav
        aria-label="婚禮設計四步驟導覽"
        className="rounded-2xl border border-[#E3D7CA] bg-[#FBF8F4] p-2 grid grid-cols-4 gap-1.5"
      >
        {STEPS.map((item) => {
          const isCurrent = currentStep === item.step;
          const isCompleted = currentStep > item.step;
          return (
            <button
              key={item.step}
              type="button"
              onClick={() => onChangeStep(item.step)}
              aria-current={isCurrent ? 'step' : undefined}
              className={`min-h-[54px] rounded-xl px-2 py-2 text-left transition-all duration-150 flex flex-col justify-center items-center sm:items-start ${
                isCurrent
                  ? 'bg-[#655047] text-[#F5F0E9] shadow-sm'
                  : 'bg-transparent text-[#846E65] hover:bg-[#F5F0E9]'
              }`}
            >
              <span
                className={`text-[10px] tracking-[0.14em] font-medium whitespace-nowrap ${
                  isCurrent
                    ? 'text-[#E6CBC3]'
                    : isCompleted
                    ? 'text-[#C5AA7C]'
                    : 'text-[#AD8980]'
                }`}
              >
                {item.code}
              </span>
              <span className="text-xs font-medium mt-0.5 truncate max-w-full">
                <span className="sm:hidden">{item.shortLabel}</span>
                <span className="hidden sm:inline">{item.label.replace('新人及', '')}</span>
              </span>
            </button>
          );
        })}
      </nav>

      {/* Active Step Workspace Card */}
      <div className="rounded-2xl border border-[#E3D7CA] bg-[#FBF8F4] p-5 sm:p-7 space-y-6">
        {/* STEP 01: Choose Wedding Aesthetic */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <p className="text-xs tracking-[0.18em] text-[#AD8980] font-medium">
                STEP 01 · AESTHETIC COLLECTION
              </p>
              <h3 className="font-editorial-serif text-xl sm:text-2xl font-semibold text-[#655047]">
                選擇婚禮美學系列
              </h3>
              <p className="text-xs sm:text-sm text-[#846E65] leading-relaxed">
                點選即可即時套用整套紙藝字體、花卉線條、火漆徽章與色彩美學。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {THEME_ORDER.map((id) => {
                const series = THEME_CONFIGS[id];
                const isSelected = themeId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSelectTheme(id)}
                    aria-pressed={isSelected}
                    className={`w-full text-left rounded-xl border p-3.5 transition-all duration-200 flex items-center gap-4 ${
                      isSelected
                        ? 'border-[#AD8980] bg-[#F5F0E9] shadow-sm'
                        : 'border-[#E7DDD1] bg-white/70 hover:border-[#C5AA7C]'
                    }`}
                  >
                    {/* Miniature Real Stationery Photography */}
                    <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-[#E3D7CA] bg-[#EFE7DF]">
                      <img
                        src={series.previewImage}
                        alt={`${series.nameZh} 風格預覽`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="tracking-[0.14em] text-[#AD8980] font-medium truncate">
                          {series.seriesNumber} · {series.nameEn}
                        </span>
                        {series.featured && (
                          <span className="text-[#C5AA7C] font-medium whitespace-nowrap shrink-0">
                            主打系列
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-base font-semibold text-[#655047] ${series.typography.displayClass}`}
                      >
                        {series.nameZh}
                      </p>
                      <p className="text-xs text-[#846E65] line-clamp-1">
                        {series.tagline}
                      </p>
                      <div className="flex items-center gap-1.5 pt-1" aria-hidden="true">
                        {series.swatches.map((hex, idx) => (
                          <span
                            key={idx}
                            className="h-3 w-3 rounded-full border border-black/10"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>

                    <span
                      className={`h-6 w-6 rounded-full border shrink-0 inline-flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#655047] border-[#655047] text-[#F5F0E9]'
                          : 'border-[#D7C9BA] bg-transparent'
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 02: Upload Wedding Portrait & Framing */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs tracking-[0.18em] text-[#AD8980] font-medium">
                  STEP 02 · BRIDAL PORTRAIT
                </p>
                <h3 className="font-editorial-serif text-xl sm:text-2xl font-semibold text-[#655047]">
                  上傳婚紗照片與構圖微調
                </h3>
                <p className="text-xs sm:text-sm text-[#846E65] leading-relaxed">
                  照片僅於您的瀏覽器本機即時合成，不經過伺服器上傳，安心保護私人影像。
                </p>
              </div>
              {!data.isDefaultPhoto && (
                <button
                  type="button"
                  onClick={handleResetPhoto}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#AD8980] hover:text-[#655047] underline-offset-4 hover:underline whitespace-nowrap shrink-0 min-h-[44px]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  恢復示範照
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              aria-label="上傳婚紗照片"
            />

            <div className="rounded-2xl border border-dashed border-[#C5AA7C] bg-[#F5F0E9]/70 p-5 flex flex-col sm:flex-row items-center gap-5">
              <div className="h-36 w-28 shrink-0 overflow-hidden rounded-t-full rounded-b-lg border border-[#C5AA7C] bg-[#EFE7DF] shadow-sm">
                <img
                  src={data.photoUrl}
                  alt="目前婚紗主視覺縮圖"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-150"
                  style={{
                    objectPosition: `${data.photoPosX}% ${data.photoPosY}%`,
                    transform: `scale(${data.photoScale})`,
                  }}
                />
              </div>

              <div className="flex-1 w-full space-y-3 text-center sm:text-left">
                <p className="text-sm font-medium text-[#655047]">
                  {data.isDefaultPhoto
                    ? '目前使用精選示範婚紗照，歡迎替換為你們的專屬照片'
                    : '已套用您的婚紗照片，右側與成品套組將同步更新'}
                </p>
                <p className="text-xs text-[#9B877E]">
                  建議使用直式高畫質婚紗照（JPG / PNG / WebP），臉部留白處可於下方細調。
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto min-h-[46px] rounded-full px-6 py-2.5 text-sm font-medium bg-[#655047] text-[#F5F0E9] hover:bg-[#534038] transition-colors inline-flex items-center justify-center gap-2"
                >
                  <ImagePlus className="h-4 w-4 text-[#E6CBC3]" />
                  <span>{data.isDefaultPhoto ? '選擇手機 / 電腦婚紗照' : '更換另一張婚紗照'}</span>
                </button>
              </div>
            </div>

            {/* Precision Framing Controls */}
            <div className="rounded-xl border border-[#E7DDD1] bg-[#F5F0E9]/55 p-4 space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium text-[#655047]">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#AD8980]" />
                <span>人像構圖裁切微調</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#846E65]">
                  <span>上下焦點位置</span>
                  <span className="tabular-nums">{data.photoPosY}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={data.photoPosY}
                  onChange={(e) => onChangeData({ photoPosY: Number(e.target.value) })}
                  className="w-full h-2 rounded-lg cursor-pointer accent-[#AD8980]"
                  aria-label="調整婚紗照上下焦點位置"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#846E65]">
                  <span>左右焦點位置</span>
                  <span className="tabular-nums">{data.photoPosX}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={data.photoPosX}
                  onChange={(e) => onChangeData({ photoPosX: Number(e.target.value) })}
                  className="w-full h-2 rounded-lg cursor-pointer accent-[#AD8980]"
                  aria-label="調整婚紗照左右焦點位置"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#846E65]">
                  <span>畫面縮放比例</span>
                  <span className="tabular-nums">{Math.round(data.photoScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={160}
                  step={5}
                  value={Math.round(data.photoScale * 100)}
                  onChange={(e) =>
                    onChangeData({ photoScale: Number(e.target.value) / 100 })
                  }
                  className="w-full h-2 rounded-lg cursor-pointer accent-[#AD8980]"
                  aria-label="調整婚紗照縮放比例"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 03: Couple & Banquet Details */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs tracking-[0.18em] text-[#AD8980] font-medium">
                  STEP 03 · WEDDING DETAILS
                </p>
                <h3 className="font-editorial-serif text-xl sm:text-2xl font-semibold text-[#655047]">
                  填寫新人及婚宴資訊
                </h3>
                <p className="text-xs text-[#846E65] leading-relaxed">
                  即時同步至四件組成品 · 請勿填入身分證字號或銀行帳號等敏感個資
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClearTextFields}
                  className="min-h-[44px] text-xs text-[#9B877E] hover:text-[#655047] underline-offset-4 hover:underline"
                >
                  清空欄位
                </button>
                <button
                  type="button"
                  onClick={onResetAll}
                  className="min-h-[44px] inline-flex items-center gap-1 text-xs font-medium text-[#AD8980] hover:text-[#655047] underline-offset-4 hover:underline"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  重設範例
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="couple-zh"
                    className="block text-xs font-medium text-[#846E65] mb-1.5"
                  >
                    新人中文姓名
                  </label>
                  <input
                    id="couple-zh"
                    type="text"
                    value={data.coupleNamesZh}
                    onChange={(e) => onChangeData({ coupleNamesZh: e.target.value })}
                    placeholder={DEFAULT_WEDDING_DATA.coupleNamesZh}
                    className={`${inputBaseClass} ${
                      validationErrorField === 'coupleNamesZh'
                        ? 'animate-gentle-shake border-[#AD8980]'
                        : ''
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="couple-en"
                    className="block text-xs font-medium text-[#846E65] mb-1.5"
                  >
                    新人英文姓名（同步用於火漆印章縮寫）
                  </label>
                  <input
                    id="couple-en"
                    type="text"
                    value={data.coupleNamesEn}
                    onChange={(e) => onChangeData({ coupleNamesEn: e.target.value })}
                    placeholder={DEFAULT_WEDDING_DATA.coupleNamesEn}
                    className={inputBaseClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="wedding-date-iso"
                    className="flex items-center gap-1.5 text-xs font-medium text-[#846E65] mb-1.5"
                  >
                    <Calendar className="h-3.5 w-3.5 text-[#AD8980]" />
                    倒數計算日期
                  </label>
                  <input
                    id="wedding-date-iso"
                    type="date"
                    value={data.weddingDateIso}
                    onChange={(e) => onChangeData({ weddingDateIso: e.target.value })}
                    className={`${inputBaseClass} tabular-nums`}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="date-label"
                    className="block text-xs font-medium text-[#846E65] mb-1.5"
                  >
                    婚宴日期與入席時間
                  </label>
                  <input
                    id="date-label"
                    type="text"
                    value={data.dateTimeLabel}
                    onChange={(e) => onChangeData({ dateTimeLabel: e.target.value })}
                    placeholder={DEFAULT_WEDDING_DATA.dateTimeLabel}
                    className={inputBaseClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="venue-name"
                    className="flex items-center gap-1.5 text-xs font-medium text-[#846E65] mb-1.5"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#AD8980]" />
                    婚宴場地與廳別
                  </label>
                  <input
                    id="venue-name"
                    type="text"
                    value={data.venueName}
                    onChange={(e) => onChangeData({ venueName: e.target.value })}
                    placeholder={DEFAULT_WEDDING_DATA.venueName}
                    className={`${inputBaseClass} ${
                      validationErrorField === 'venueName'
                        ? 'animate-gentle-shake border-[#AD8980]'
                        : ''
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="venue-address"
                    className="block text-xs font-medium text-[#846E65] mb-1.5"
                  >
                    婚宴詳細地址
                  </label>
                  <input
                    id="venue-address"
                    type="text"
                    value={data.venueAddress}
                    onChange={(e) => onChangeData({ venueAddress: e.target.value })}
                    placeholder={DEFAULT_WEDDING_DATA.venueAddress}
                    className={inputBaseClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="traffic-note"
                  className="block text-xs font-medium text-[#846E65] mb-1.5"
                >
                  交通 / 停車小叮嚀（同步顯示於 LINE 交通提醒卡）
                </label>
                <textarea
                  id="traffic-note"
                  rows={2}
                  value={data.trafficNote}
                  onChange={(e) => onChangeData({ trafficNote: e.target.value })}
                  placeholder={DEFAULT_WEDDING_DATA.trafficNote}
                  className={`${inputBaseClass} resize-none leading-relaxed`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="table-label"
                    className="flex items-center gap-1.5 text-xs font-medium text-[#846E65] mb-1.5"
                  >
                    <Users className="h-3.5 w-3.5 text-[#AD8980]" />
                    賓客桌次名稱（桌卡預覽用）
                  </label>
                  <input
                    id="table-label"
                    type="text"
                    value={data.tableLabel}
                    onChange={(e) => onChangeData({ tableLabel: e.target.value })}
                    placeholder={DEFAULT_WEDDING_DATA.tableLabel}
                    className={inputBaseClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="timeline-note"
                    className="block text-xs font-medium text-[#846E65] mb-1.5"
                  >
                    婚宴當日時程
                  </label>
                  <input
                    id="timeline-note"
                    type="text"
                    value={data.timelineNote}
                    onChange={(e) => onChangeData({ timelineNote: e.target.value })}
                    placeholder={DEFAULT_WEDDING_DATA.timelineNote}
                    className={inputBaseClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="welcome-quote"
                  className="flex items-center gap-1.5 text-xs font-medium text-[#846E65] mb-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#C5AA7C]" />
                  迎賓引言短句
                </label>
                <input
                  id="welcome-quote"
                  type="text"
                  value={data.welcomeQuote}
                  onChange={(e) => onChangeData({ welcomeQuote: e.target.value })}
                  placeholder={DEFAULT_WEDDING_DATA.welcomeQuote}
                  className={inputBaseClass}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 04: Preview & Download Full Wedding Suite */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <p className="text-xs tracking-[0.18em] text-[#AD8980] font-medium">
                STEP 04 · COMPLETE STATIONERY SUITE
              </p>
              <h3 className="font-editorial-serif text-xl sm:text-2xl font-semibold text-[#655047]">
                預覽與下載完整婚禮套組
              </h3>
              <p className="text-xs sm:text-sm text-[#846E65] leading-relaxed">
                目前系列：<strong className="text-[#655047]">{selectedSeries.nameZh}（{selectedSeries.nameEn}）</strong> · 點擊下方品項可切換檢視並輸出高解析 PNG 成品。
              </p>
            </div>

            {/* Suite Deliverables Checklist Switcher */}
            <div className="rounded-xl border border-[#E7DDD1] bg-[#F5F0E9]/65 divide-y divide-[#E7DDD1]">
              {ASSET_META.map((asset) => {
                const isCurrent = activeTab === asset.id;
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => onChangeTab(asset.id)}
                    className={`w-full text-left px-4 py-3 min-h-[56px] flex items-center justify-between gap-3 transition-colors ${
                      isCurrent ? 'bg-[#EFE7DF]' : 'hover:bg-[#FBF8F4]'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#655047] flex items-center gap-2">
                        <span>{asset.label}</span>
                        <span className="text-[11px] font-normal text-[#AD8980]">
                          {asset.ratio}
                        </span>
                      </p>
                      <p className="text-xs text-[#846E65] mt-0.5 truncate">
                        {asset.spec}
                      </p>
                    </div>
                    <span
                      className={`text-xs whitespace-nowrap shrink-0 font-medium ${
                        isCurrent ? 'text-[#655047]' : 'text-[#AD8980]'
                      }`}
                    >
                      {isCurrent ? '檢視中' : '切換預覽 →'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Validation / Error Recovery Notices */}
            {validationHint && (
              <div
                role="alert"
                className="animate-gentle-shake rounded-xl border border-[#AD8980] bg-[#F5F0E9] px-4 py-3 text-xs sm:text-sm text-[#655047] flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-[#AD8980]" />
                <span>{validationHint}</span>
              </div>
            )}

            {exportErrorMessage && (
              <div
                role="alert"
                className="rounded-xl border border-[#AD8980] bg-[#F5F0E9] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-2 text-xs sm:text-sm text-[#655047]">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-[#AD8980]" />
                  <span>{exportErrorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={onTriggerExport}
                  className="min-h-[44px] rounded-lg px-4 py-2 text-xs font-medium bg-[#655047] text-[#F5F0E9] inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  重新嘗試
                </button>
              </div>
            )}

            {/* Primary Export & Boutique Order Entry */}
            <div className="space-y-3">
              <button
                type="button"
                disabled={isExporting || cooldownSeconds > 0}
                onClick={onTriggerExport}
                className={`w-full min-h-[48px] rounded-lg border border-[#C8AA7B] bg-[#FFFDFB] hover:bg-[#F5EAE4] px-4 py-3 text-sm font-medium text-[#70534C] inline-flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                  shakeTrigger ? 'animate-gentle-shake' : ''
                }`}
              >
                <Download className="h-4 w-4 shrink-0 text-[#B58B83]" />
                <span className="tabular-nums">
                  {isExporting
                    ? '正在生成高解析預覽圖...'
                    : cooldownSeconds > 0
                    ? `請稍候 ${cooldownSeconds}s...`
                    : `生成並下載「${ASSET_META.find((a) => a.id === activeTab)?.label}」預覽圖（含浮水印）`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onOpenOrderModal('pricing')}
                className="w-full min-h-[48px] rounded-lg bg-[#C29B92] hover:bg-[#B58B83] px-4 py-3 text-sm font-medium text-[#FAF3EF] inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Lock className="h-4 w-4 shrink-0 text-[#FAF3EF]" />
                <span>訂購無浮水印高解析全套（NT$ 390 / NT$ 890 方案說明）</span>
              </button>

              {/* Quiet Unboxed Preview Note */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#9E827A] px-0.5">
                <span>含浮水印預覽圖可不限次數下載校對排版，無每日次數限制</span>
                {cooldownSeconds > 0 && (
                  <span className="tabular-nums text-[#B58B83]">
                    冷卻倒數 {cooldownSeconds}s
                  </span>
                )}
              </div>
            </div>

            {/* Print Assistant Handoff, VIP Concierge Film Banner & Extensible Stationery Roadmap */}
            <div className="pt-3 border-t border-[#E7DDD1] space-y-3">
              {onOpenPrintAssistant && (
                <button
                  type="button"
                  onClick={onOpenPrintAssistant}
                  className="w-full rounded-xl border border-[#C5AA7C] bg-[#F5F0E9] hover:bg-[#EFE7DF] px-4 py-3 min-h-[44px] text-left flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Printer className="h-4 w-4 shrink-0 text-[#AD8980]" />
                    <div className="min-w-0">
                      <span className="block text-xs sm:text-sm font-medium text-[#655047] truncate">
                        需要委託印刷廠印製？開啟「婚禮印製交付助手」
                      </span>
                      <span className="block text-[11px] text-[#846E65] truncate">
                        自動印前檢查、產生規格單 PDF、LINE 詢價文與分類交付包
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#AD8980] whitespace-nowrap shrink-0">
                    前往整理 →
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenOrderModal('film')}
                className="w-full rounded-xl border border-[#E3D7CA] bg-[#F5F0E9]/80 hover:border-[#C5AA7C] px-4 py-3 min-h-[44px] text-left flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Film className="h-4 w-4 shrink-0 text-[#AD8980]" />
                  <span className="text-xs sm:text-sm font-medium text-[#655047] truncate">
                    預約客製《AI 婚紗動態微電影開場片》
                  </span>
                </div>
                <span className="text-xs font-medium text-[#AD8980] whitespace-nowrap shrink-0">
                  NT$ 2,980 起 →
                </span>
              </button>

              <p className="text-[11px] text-[#9B877E] leading-relaxed">
                香檳燙金為數位螢幕與印刷視覺效果，非實體紙本燙金加工。未來將陸續開放同系列延伸紙藝：紙本喜帖內頁、婚禮菜單卡與謝卡。
              </p>
            </div>
          </div>
        )}

        {/* Desktop Step Navigation Controls */}
        <div className="hidden lg:flex items-center justify-between gap-4 pt-4 border-t border-[#E7DDD1]">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => onChangeStep((currentStep - 1) as StudioStep)}
            className="min-h-[44px] rounded-full border border-[#DFD2C4] px-5 py-2 text-xs sm:text-sm font-medium text-[#655047] hover:bg-[#F5F0E9] inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>上一步</span>
          </button>

          <span className="text-xs text-[#9B877E] tabular-nums">
            步驟 {currentStep} / 4
          </span>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => onChangeStep((currentStep + 1) as StudioStep)}
              className="min-h-[44px] rounded-full bg-[#655047] hover:bg-[#534038] px-6 py-2 text-xs sm:text-sm font-medium text-[#F5F0E9] inline-flex items-center gap-1.5 transition-colors"
            >
              <span>下一步：{STEPS[currentStep].label}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onChangeStep(1)}
              className="min-h-[44px] rounded-full border border-[#C5AA7C] px-5 py-2 text-xs sm:text-sm font-medium text-[#655047] hover:bg-[#F5F0E9] transition-colors"
            >
              重新切換其他風格
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
