import React from 'react';
import {
  Download,
  Lock,
  MapPin,
  ClipboardCheck,
  Car,
  Clock,
  Copy,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import {
  ASSET_META,
  PreviewAssetTab,
  THEME_CONFIGS,
  ThemeId,
  WeddingData,
  getCoupleMonogram,
  getDaysUntilWedding,
} from '../types/wedding';
import {
  ThemeDividerMotif,
  ThemeFrameDecoration,
  WaxSealBadge,
} from './ThemeDecorations';

interface PreviewCanvasProps {
  themeId: ThemeId;
  activeTab: PreviewAssetTab;
  onChangeTab: (tab: PreviewAssetTab) => void;
  data: WeddingData;
  isExporting: boolean;
  cooldownSeconds: number;
  validationHint: string | null;
  exportErrorMessage: string | null;
  shakeTrigger: boolean;
  onTriggerExport: () => void;
  onOpenOrderModal: (initialView?: 'pricing' | 'film') => void;
  onOpenMapSim: () => void;
  onOpenRsvpSim: () => void;
  onNotify: (msg: string) => void;
  compactFooter?: boolean;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  themeId,
  activeTab,
  onChangeTab,
  data,
  isExporting,
  cooldownSeconds,
  validationHint,
  exportErrorMessage,
  shakeTrigger,
  onTriggerExport,
  onOpenOrderModal,
  onOpenMapSim,
  onOpenRsvpSim,
  onNotify,
  compactFooter = false,
}) => {
  const theme = THEME_CONFIGS[themeId];
  const daysLeft = getDaysUntilWedding(data.weddingDateIso);
  const monogram = getCoupleMonogram(data.coupleNamesEn);
  const isKorean = themeId === 'korean-minimalist';
  const isRoyalRose = themeId === 'royal-rose';
  const isFrenchManor = themeId === 'french-manor';

  const handleCopyLineInfo = async () => {
    const summary = `【${data.coupleNamesZh || '新人'} 婚宴交通提醒】\n日期：${data.dateTimeLabel}\n時程：${data.timelineNote}\n地點：${data.venueName}\n地址：${data.venueAddress}\n交通停車：${data.trafficNote}`;
    try {
      await navigator.clipboard.writeText(summary);
      onNotify('已複製賓客 LINE 群組交通提醒文字');
    } catch {
      onNotify('已準備好賓客 LINE 群組交通提醒資訊');
    }
  };

  const photoImageElement = (
    <img
      src={data.photoUrl}
      alt={`${data.coupleNamesZh || '新人'} 婚紗主視覺`}
      referrerPolicy="no-referrer"
      className="h-full w-full object-cover transition-all duration-200"
      style={{
        objectPosition: `${data.photoPosX}% ${data.photoPosY}%`,
        transform: `scale(${data.photoScale})`,
      }}
    />
  );

  const portraitShapeClass =
    isRoyalRose || isFrenchManor
      ? 'rounded-t-[999px] rounded-b-md'
      : isKorean
      ? 'rounded-lg'
      : 'rounded-none';

  return (
    <div id="preview-canvas" className="space-y-4">
      {/* 4-Piece Finished Suite Switcher */}
      <div
        className="rounded-2xl border border-[#E3D7CA] bg-[#FBF8F4] p-1.5 grid grid-cols-2 sm:grid-cols-4 gap-1.5"
        role="tablist"
        aria-label="婚禮成品四件組切換"
      >
        {ASSET_META.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChangeTab(tab.id)}
              className={`min-h-[44px] rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-150 flex items-center justify-center gap-1 whitespace-nowrap shrink-0 truncate ${
                isActive
                  ? 'bg-[#655047] text-[#F5F0E9] shadow-sm'
                  : 'text-[#846E65] hover:bg-[#F5F0E9]'
              }`}
            >
              <span className="truncate">{tab.shortLabel}</span>
              <span
                className={`text-[10px] ${
                  isActive ? 'text-[#E6CBC3]' : 'text-[#AD8980]'
                }`}
              >
                {tab.ratio}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pearl Marble Live Stationery Stage */}
      <div className="atelier-marble-stage rounded-3xl border border-[#E3D7CA] p-5 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Quiet Series Context Caption */}
        <div className="w-full flex items-center justify-between text-[11px] text-[#846E65] mb-4 px-1">
          <span className="font-editorial-serif tracking-wide">
            {theme.seriesNumber} · {theme.nameZh} {theme.nameEn}
          </span>
          <span className="text-[#AD8980]">
            {ASSET_META.find((a) => a.id === activeTab)?.label}
          </span>
        </div>

        {/* Piece 1: 9:16 Mobile E-Invite */}
        {activeTab === 'e-invite' && (
          <div
            className="atelier-paper-texture stationery-shadow relative w-full max-w-[356px] aspect-[9/16] overflow-hidden transition-all duration-200 flex flex-col justify-between p-6 sm:p-7"
            style={{
              backgroundColor: theme.colors.canvasBg,
              borderRadius: isKorean ? '14px' : '8px',
            }}
          >
            <ThemeFrameDecoration
              themeId={themeId}
              borderColor={theme.colors.border}
              accentColor={theme.colors.primaryAccent}
            />

            {/* Distinct Top Typography per Series */}
            <div
              className={`relative z-20 pt-1 ${
                isKorean ? 'text-left px-1' : 'text-center'
              }`}
            >
              <p
                className={
                  isRoyalRose || isFrenchManor
                    ? 'font-script text-3xl leading-none'
                    : themeId === 'modern-oriental'
                    ? 'font-oriental-serif text-xs tracking-[0.26em] font-semibold'
                    : 'font-editorial-sans text-[10px] tracking-[0.3em] uppercase font-medium'
                }
                style={{
                  color: isRoyalRose
                    ? theme.colors.foilAccent
                    : theme.colors.primaryAccent,
                }}
              >
                {theme.typography.scriptOrSealLabel}
              </p>
              <p
                className="mt-1.5 text-[11px] tabular-nums"
                style={{ color: theme.colors.inkMuted }}
              >
                {data.weddingDateIso} · 距離婚禮還有 {daysLeft} 天
              </p>
            </div>

            {/* Center Bridal Portrait with Wax Seal for Royal Rose */}
            <div className="relative z-20 my-2.5 flex-1 min-h-0 flex items-center justify-center">
              <div className="relative h-full w-full max-h-[246px] flex items-center justify-center">
                <div
                  className={`relative h-full w-full overflow-hidden border ${portraitShapeClass}`}
                  style={{ borderColor: theme.colors.border }}
                >
                  {photoImageElement}
                </div>
                {isRoyalRose && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30">
                    <WaxSealBadge monogram={monogram} size="sm" tone="gold" />
                  </div>
                )}
              </div>
            </div>

            {/* Couple, Banquet Info & Interactive Simulation Controls */}
            <div
              className={`relative z-20 space-y-2 pb-0.5 ${
                isRoyalRose ? 'pt-2.5' : ''
              } ${isKorean ? 'text-left px-1' : 'text-center'}`}
            >
              <div>
                <h3
                  className={`text-2xl font-semibold tracking-wide ${theme.typography.displayClass}`}
                  style={{ color: theme.colors.inkPrimary }}
                >
                  {data.coupleNamesZh.trim() || '陳宥廷 & 林語希'}
                </h3>
                <p
                  className={`text-sm italic mt-0.5 ${theme.typography.displayClass}`}
                  style={{ color: theme.colors.inkSecondary }}
                >
                  {data.coupleNamesEn.trim() || 'Ethan & Chloe'}
                </p>
              </div>

              {!isKorean && (
                <ThemeDividerMotif
                  themeId={themeId}
                  borderColor={theme.colors.border}
                  accentColor={theme.colors.primaryAccent}
                />
              )}

              <div className="space-y-0.5 text-xs leading-snug">
                <p
                  className="font-medium tabular-nums"
                  style={{ color: theme.colors.inkPrimary }}
                >
                  {data.dateTimeLabel}
                </p>
                <p
                  className="font-medium"
                  style={{ color: theme.colors.inkSecondary }}
                >
                  {data.venueName}
                </p>
                <p
                  className="text-[11px] line-clamp-1"
                  style={{ color: theme.colors.inkMuted }}
                >
                  {data.venueAddress}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1.5">
                <button
                  type="button"
                  onClick={onOpenMapSim}
                  className="min-h-[38px] rounded-lg border px-2 py-1.5 text-[11px] font-medium inline-flex items-center justify-center gap-1 transition-transform active:scale-[0.98]"
                  style={{
                    borderColor: theme.colors.border,
                    color: theme.colors.inkPrimary,
                    backgroundColor: theme.colors.surfaceBg,
                  }}
                >
                  <MapPin
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: theme.colors.primaryAccent }}
                  />
                  <span className="truncate">Google 地圖導航</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenRsvpSim}
                  className="min-h-[38px] rounded-lg px-2 py-1.5 text-[11px] font-medium inline-flex items-center justify-center gap-1 transition-transform active:scale-[0.98]"
                  style={{
                    backgroundColor: theme.colors.primaryAccent,
                    color: theme.colors.primaryAccentText,
                  }}
                >
                  <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">填寫出席表單</span>
                </button>
              </div>

              <p
                className="pt-1 text-center text-[10px] tracking-wider"
                style={{ color: theme.colors.inkMuted, opacity: 0.78 }}
              >
                Designed with LifeTale WeddingSuite
              </p>
            </div>
          </div>
        )}

        {/* Piece 2: A1 Welcome Poster */}
        {activeTab === 'welcome-poster' && (
          <div
            className="atelier-paper-texture stationery-shadow relative w-full max-w-[400px] aspect-[594/841] overflow-hidden transition-all duration-200 flex flex-col justify-between p-7 sm:p-8"
            style={{
              backgroundColor: theme.colors.canvasBg,
              borderRadius: '6px',
            }}
          >
            <ThemeFrameDecoration
              themeId={themeId}
              borderColor={theme.colors.border}
              accentColor={theme.colors.primaryAccent}
            />

            <div className="relative z-20 text-center pt-1.5">
              <p
                className={
                  isRoyalRose || isFrenchManor
                    ? 'font-script text-3xl sm:text-4xl leading-none'
                    : 'text-[11px] tracking-[0.26em] uppercase font-medium'
                }
                style={{
                  color: isRoyalRose
                    ? theme.colors.foilAccent
                    : theme.colors.primaryAccent,
                }}
              >
                {theme.typography.welcomeSubtitle}
              </p>
              <h3
                className={`mt-1.5 text-base sm:text-lg font-medium tracking-wider ${theme.typography.displayClass}`}
                style={{ color: theme.colors.inkPrimary }}
              >
                誠摯歡迎蒞臨我們的大喜之日
              </h3>
            </div>

            <div className="relative z-20 my-3 flex-1 min-h-0 flex items-center justify-center">
              <div className="relative h-full w-full flex items-center justify-center">
                <div
                  className={`relative h-full w-full overflow-hidden border ${portraitShapeClass}`}
                  style={{ borderColor: theme.colors.border }}
                >
                  {photoImageElement}
                </div>
                {isRoyalRose && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30">
                    <WaxSealBadge monogram={monogram} size="md" tone="gold" />
                  </div>
                )}
              </div>
            </div>

            <div
              className={`relative z-20 text-center space-y-1.5 pb-0.5 ${
                isRoyalRose ? 'pt-3' : ''
              }`}
            >
              <h4
                className={`text-2xl sm:text-3xl font-semibold tracking-wide ${theme.typography.displayClass}`}
                style={{ color: theme.colors.inkPrimary }}
              >
                {data.coupleNamesZh.trim() || '陳宥廷 & 林語希'}
              </h4>
              <p
                className={`text-sm sm:text-base italic ${theme.typography.displayClass}`}
                style={{ color: theme.colors.inkSecondary }}
              >
                {data.coupleNamesEn.trim() || 'Ethan & Chloe'}
              </p>

              <ThemeDividerMotif
                themeId={themeId}
                borderColor={theme.colors.border}
                accentColor={theme.colors.primaryAccent}
              />

              <p
                className="text-xs font-medium tabular-nums"
                style={{ color: theme.colors.inkPrimary }}
              >
                {data.dateTimeLabel}
              </p>
              <p
                className="text-xs font-semibold"
                style={{ color: theme.colors.primaryAccent }}
              >
                {data.venueName}
              </p>

              <p
                className="pt-1.5 text-[10px] tracking-wider"
                style={{ color: theme.colors.inkMuted, opacity: 0.78 }}
              >
                Designed with LifeTale WeddingSuite
              </p>
            </div>
          </div>
        )}

        {/* Piece 3: Dedicated Banquet Guest Table Card (3:4) */}
        {activeTab === 'table-card' && (
          <div
            className="atelier-paper-texture stationery-shadow relative w-full max-w-[376px] aspect-[3/4] overflow-hidden transition-all duration-200 flex flex-col justify-between p-7 sm:p-8"
            style={{
              backgroundColor: theme.colors.canvasBg,
              borderRadius: '10px',
            }}
          >
            <ThemeFrameDecoration
              themeId={themeId}
              borderColor={theme.colors.border}
              accentColor={theme.colors.primaryAccent}
            />

            <div className="relative z-20 text-center pt-1.5 space-y-1">
              <p
                className="text-[10px] tracking-[0.26em] font-medium"
                style={{ color: theme.colors.foilAccent }}
              >
                BANQUET TABLE CARD · 婚宴賓客桌卡
              </p>
              <h3
                className={`text-2xl sm:text-[28px] font-semibold ${theme.typography.displayClass}`}
                style={{ color: theme.colors.inkPrimary }}
              >
                {data.tableLabel.trim() || '摯友席 · Table 06'}
              </h3>
            </div>

            {/* Centered Miniature Portrait + Wax Seal */}
            <div className="relative z-20 flex flex-col items-center justify-center my-2">
              <div className="relative">
                <div
                  className={`h-36 w-32 overflow-hidden border ${portraitShapeClass}`}
                  style={{ borderColor: theme.colors.border }}
                >
                  {photoImageElement}
                </div>
                {isRoyalRose && (
                  <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-30">
                    <WaxSealBadge monogram={monogram} size="sm" tone="rose" />
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-20 text-center space-y-2 pb-0.5 pt-2">
              <div>
                <p
                  className={`text-lg font-semibold ${theme.typography.displayClass}`}
                  style={{ color: theme.colors.inkPrimary }}
                >
                  {data.coupleNamesZh.trim() || '陳宥廷 & 林語希'}
                </p>
                <p
                  className={`text-xs italic ${theme.typography.displayClass}`}
                  style={{ color: theme.colors.inkSecondary }}
                >
                  {data.coupleNamesEn.trim() || 'Ethan & Chloe'}
                </p>
              </div>

              <ThemeDividerMotif
                themeId={themeId}
                borderColor={theme.colors.border}
                accentColor={theme.colors.primaryAccent}
              />

              <p
                className="text-xs leading-relaxed px-2"
                style={{ color: theme.colors.inkSecondary }}
              >
                {data.welcomeQuote}
              </p>

              <div
                className="rounded-lg border px-3 py-2 text-[11px] tabular-nums"
                style={{
                  backgroundColor: theme.colors.surfaceBg,
                  borderColor: theme.colors.secondaryBorder,
                  color: theme.colors.inkPrimary,
                }}
              >
                {data.timelineNote}
              </div>

              <p
                className="pt-1 text-[10px] tracking-wider"
                style={{ color: theme.colors.inkMuted, opacity: 0.78 }}
              >
                Designed with LifeTale WeddingSuite
              </p>
            </div>
          </div>
        )}

        {/* Piece 4: Dedicated LINE Traffic & Parking Reminder Card (4:5) */}
        {activeTab === 'line-traffic' && (
          <div
            className="atelier-paper-texture stationery-shadow relative w-full max-w-[392px] aspect-[4/5] overflow-hidden transition-all duration-200 flex flex-col justify-between p-6 sm:p-8"
            style={{
              backgroundColor: theme.colors.canvasBg,
              borderRadius: '12px',
            }}
          >
            <ThemeFrameDecoration
              themeId={themeId}
              borderColor={theme.colors.border}
              accentColor={theme.colors.primaryAccent}
            />

            <div className="relative z-20 text-center pt-1 space-y-1">
              <p
                className="text-[11px] tracking-[0.22em] font-medium"
                style={{ color: theme.colors.primaryAccent }}
              >
                LINE 賓客交通與入席提醒卡
              </p>
              <div className="flex items-center justify-center gap-2.5 pt-0.5">
                {isRoyalRose && (
                  <WaxSealBadge monogram={monogram} size="sm" tone="gold" />
                )}
                <div className="text-left">
                  <h3
                    className={`text-xl font-semibold leading-tight ${theme.typography.displayClass}`}
                    style={{ color: theme.colors.inkPrimary }}
                  >
                    {data.coupleNamesZh.trim() || '陳宥廷 & 林語希'}
                  </h3>
                  <p
                    className={`text-xs italic ${theme.typography.displayClass}`}
                    style={{ color: theme.colors.inkSecondary }}
                  >
                    {data.coupleNamesEn.trim() || 'Ethan & Chloe'}
                  </p>
                </div>
              </div>
            </div>

            {/* Structured Banquet & Transit Details */}
            <div
              className="relative z-20 rounded-xl border p-4 space-y-3 text-left my-2"
              style={{
                backgroundColor: theme.colors.surfaceBg,
                borderColor: theme.colors.secondaryBorder,
              }}
            >
              <div className="flex items-start gap-2.5">
                <Clock
                  className="h-4 w-4 shrink-0 mt-0.5"
                  style={{ color: theme.colors.primaryAccent }}
                />
                <div className="text-xs leading-relaxed">
                  <p
                    className="font-semibold tabular-nums"
                    style={{ color: theme.colors.inkPrimary }}
                  >
                    {data.dateTimeLabel}
                  </p>
                  <p
                    className="mt-0.5 tabular-nums"
                    style={{ color: theme.colors.inkSecondary }}
                  >
                    {data.timelineNote}
                  </p>
                </div>
              </div>

              <div
                className="h-px w-full"
                style={{ backgroundColor: theme.colors.secondaryBorder }}
              />

              <div className="flex items-start gap-2.5">
                <Car
                  className="h-4 w-4 shrink-0 mt-0.5"
                  style={{ color: theme.colors.primaryAccent }}
                />
                <div className="text-xs leading-relaxed">
                  <p
                    className="font-semibold"
                    style={{ color: theme.colors.inkPrimary }}
                  >
                    {data.venueName}
                  </p>
                  <p
                    className="mt-0.5"
                    style={{ color: theme.colors.inkSecondary }}
                  >
                    {data.venueAddress}
                  </p>
                  <p
                    className="mt-1 text-[11px]"
                    style={{ color: theme.colors.inkMuted }}
                  >
                    {data.trafficNote}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-20 space-y-2 text-center">
              <button
                type="button"
                onClick={handleCopyLineInfo}
                className="w-full min-h-[40px] rounded-lg border px-3 py-1.5 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-transform active:scale-[0.99]"
                style={{
                  borderColor: theme.colors.border,
                  color: theme.colors.inkPrimary,
                  backgroundColor: theme.colors.canvasBg,
                }}
              >
                <Copy
                  className="h-3.5 w-3.5"
                  style={{ color: theme.colors.primaryAccent }}
                />
                <span>複製 LINE 群組交通提醒文字</span>
              </button>

              <p
                className="text-[10px] tracking-wider"
                style={{ color: theme.colors.inkMuted, opacity: 0.78 }}
              >
                Designed with LifeTale WeddingSuite
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Download & Purchase Bar under Stage (shown on Desktop or Preview Drawer) */}
      {!compactFooter && (
        <div className="space-y-3">
          {validationHint && (
            <div
              role="alert"
              className="animate-gentle-shake rounded-xl border border-[#AD8980] bg-[#FBF8F4] px-4 py-3 text-xs sm:text-sm text-[#655047] flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-[#AD8980]" />
              <span>{validationHint}</span>
            </div>
          )}

          {exportErrorMessage && (
            <div
              role="alert"
              className="rounded-xl border border-[#AD8980] bg-[#FBF8F4] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isExporting || cooldownSeconds > 0}
              onClick={onTriggerExport}
              className={`min-h-[48px] rounded-lg border border-[#C8AA7B] bg-[#FFFDFB] hover:bg-[#F5EAE4] px-4 py-3 text-sm font-medium text-[#70534C] inline-flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                shakeTrigger ? 'animate-gentle-shake' : ''
              }`}
            >
              <Download className="h-4 w-4 shrink-0 text-[#B58B83]" />
              <span className="truncate tabular-nums">
                {isExporting
                  ? '正在生成預覽圖...'
                  : cooldownSeconds > 0
                  ? `請稍候 ${cooldownSeconds}s...`
                  : '免費下載預覽圖（含浮水印）'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onOpenOrderModal('pricing')}
              className="min-h-[48px] rounded-lg bg-[#C29B92] hover:bg-[#B58B83] px-4 py-3 text-sm font-medium text-[#FAF3EF] inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Lock className="h-4 w-4 shrink-0 text-[#FAF3EF]" />
              <span className="truncate">訂購無浮水印高解析全套</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#9E827A] px-1">
            <span>含浮水印預覽圖可自由反覆下載校對排版</span>
            <span>數位香檳金僅為視覺效果，非實體紙本燙金</span>
          </div>
        </div>
      )}
    </div>
  );
};
