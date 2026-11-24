import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Film,
  ArrowLeft,
  Copy,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Info,
} from 'lucide-react';
import {
  FILM_SHOWCASE_ORIENTAL,
  FILM_SHOWCASE_ROSE_ATELIER,
  THEME_CONFIGS,
  ThemeId,
  WeddingData,
} from '../types/wedding';

interface UnlockPricingModalProps {
  isOpen: boolean;
  initialView?: 'pricing' | 'film';
  onClose: () => void;
  themeId: ThemeId;
  data: WeddingData;
  onNotify: (msg: string) => void;
}

export const UnlockPricingModal: React.FC<UnlockPricingModalProps> = ({
  isOpen,
  initialView = 'pricing',
  onClose,
  themeId,
  data,
  onNotify,
}) => {
  const [view, setView] = useState<'pricing' | 'film'>(initialView);
  const [selectedPlan, setSelectedPlan] = useState<'lite' | 'full'>('full');
  const [orderName, setOrderName] = useState('');
  const [orderContact, setOrderContact] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderShake, setOrderShake] = useState(false);

  const [bookingName, setBookingName] = useState('');
  const [bookingContact, setBookingContact] = useState('');
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingShake, setBookingShake] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setOrderSubmitted(false);
      setOrderError(null);
      setBookingSubmitted(false);
      setBookingError(null);
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;
  const series = THEME_CONFIGS[themeId];

  const handleCopyLineId = async () => {
    try {
      await navigator.clipboard.writeText('@lifetale.studio');
      onNotify('已複製 LifeTale 官方 LINE ID：@lifetale.studio');
    } catch {
      onNotify('官方 LINE ID：@lifetale.studio');
    }
  };

  const handleCopyOrderBrief = async () => {
    const planLabel =
      selectedPlan === 'full'
        ? '全套婚禮視覺大全配（NT$ 890）'
        : '輕量電子喜帖包（NT$ 390）';
    const text = `您好，我想訂購 LifeTale WeddingSuite 方案：\n方案：${planLabel}\n美學系列：${series.nameZh}（${series.nameEn}）\n新人姓名：${data.coupleNamesZh || '未填寫'} / ${data.coupleNamesEn || '未填寫'}\n婚宴日期：${data.dateTimeLabel}\n地點：${data.venueName}`;
    try {
      await navigator.clipboard.writeText(text);
      onNotify('已複製訂購摘要，可直接貼至 LINE @lifetale.studio 洽詢');
    } catch {
      onNotify('請加入官方 LINE @lifetale.studio 傳送您的系列名稱');
    }
  };

  const handleSubmitOrderInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderName.trim() || !orderContact.trim()) {
      setOrderError('請先輸入聯絡人稱呼與 LINE ID 或手機號碼再送出喔');
      setOrderShake(false);
      window.requestAnimationFrame(() => setOrderShake(true));
      window.setTimeout(() => setOrderShake(false), 450);
      return;
    }
    setOrderError(null);
    setOrderSubmitted(true);
    onNotify('已建立訂購預約意向（尚未扣款），歡迎透過 LINE 完成確認');
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingContact.trim()) {
      setBookingError('請先輸入新人稱呼與聯絡方式再送出喔');
      setBookingShake(false);
      window.requestAnimationFrame(() => setBookingShake(true));
      window.setTimeout(() => setBookingShake(false), 450);
      return;
    }
    setBookingError(null);
    setBookingSubmitted(true);
    onNotify('已收到您的微電影諮詢意向，顧問將於 24 小時內聯繫您');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#3C2F2A]/55 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlock-modal-title"
    >
      <div className="w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl border border-[#C5AA7C] bg-[#F5F0E9] text-[#655047] shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#E3D7CA] bg-[#F5F0E9]/95 backdrop-blur-md px-5 sm:px-7 py-4">
          <div className="flex items-center gap-3 min-w-0">
            {view === 'film' && (
              <button
                type="button"
                onClick={() => setView('pricing')}
                className="min-h-[44px] min-w-[44px] -ml-2 inline-flex items-center justify-center rounded-full hover:bg-[#EFE7DF] transition-colors"
                aria-label="返回婚禮套組方案"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-wide text-[#AD8980] truncate">
                {view === 'pricing'
                  ? 'LifeTale WeddingSuite · 精品婚禮視覺訂購方案'
                  : 'LifeTale Studio · VIP 客製動態影音服務'}
              </p>
              <h2
                id="unlock-modal-title"
                className="font-editorial-serif text-lg sm:text-xl font-semibold text-[#655047] truncate"
              >
                {view === 'pricing'
                  ? '無浮水印高解析婚禮套組方案'
                  : 'AI 婚紗動態微電影開場片｜作品集與預約'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-[#DFD2C4] text-[#846E65] shrink-0 hover:bg-[#EFE7DF] transition-colors"
            aria-label="關閉方案視窗"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 sm:p-7 space-y-6">
          {view === 'pricing' ? (
            <>
              {/* Current Selected Series Summary */}
              <div className="rounded-xl border border-[#E3D7CA] bg-[#FBF8F4] px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[#846E65]">
                  您目前設計的系列：
                  <strong className="text-[#655047]">
                    {series.seriesNumber} {series.nameZh}（{series.nameEn}）
                  </strong>
                </span>
                <span className="text-[#AD8980]">
                  數位高解析檔案交付 · 無訂閱制
                </span>
              </div>

              {/* 2 Transparent Boutique Plans */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedPlan('lite')}
                  className={`text-left rounded-2xl border p-5 transition-all flex flex-col justify-between gap-4 ${
                    selectedPlan === 'lite'
                      ? 'border-[#AD8980] bg-[#FBF8F4] shadow-sm'
                      : 'border-[#E3D7CA] bg-[#FBF8F4]/55 hover:border-[#C5AA7C]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#9B877E]">單項精選</span>
                      <span className="text-[#846E65]">一次性買斷</span>
                    </div>
                    <h3 className="font-editorial-serif text-lg font-semibold mt-1 text-[#655047]">
                      輕量電子喜帖包
                    </h3>
                    <p className="text-2xl font-bold mt-2 tabular-nums text-[#655047]">
                      NT$ 390
                    </p>
                    <ul className="mt-4 space-y-2 text-xs sm:text-sm text-[#846E65]">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 shrink-0 mt-0.5 text-[#AD8980]" />
                        <span>9:16 手機電子喜帖（無浮水印高解析檔）</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 shrink-0 mt-0.5 text-[#AD8980]" />
                        <span>任選 1 款精品系列完稿微調</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 shrink-0 mt-0.5 text-[#AD8980]" />
                        <span>LINE 傳送最佳化比例輸出</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[#E7DDD1] text-xs font-medium text-[#AD8980]">
                    {selectedPlan === 'lite' ? '✓ 已選擇此方案' : '點擊選擇此方案'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlan('full')}
                  className={`text-left rounded-2xl border-2 p-5 transition-all flex flex-col justify-between gap-4 ${
                    selectedPlan === 'full'
                      ? 'border-[#655047] bg-[#FBF8F4] shadow-sm'
                      : 'border-[#C5AA7C] bg-[#FBF8F4]/60 hover:border-[#AD8980]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#AD8980]">
                        新人最推薦 · 完整四件組
                      </span>
                      <span className="text-[#846E65]">一次性買斷</span>
                    </div>
                    <h3 className="font-editorial-serif text-lg font-semibold mt-1 text-[#655047]">
                      全套婚禮視覺大全配
                    </h3>
                    <p className="text-2xl font-bold mt-2 tabular-nums text-[#655047]">
                      NT$ 890
                    </p>
                    <ul className="mt-4 space-y-2 text-xs sm:text-sm text-[#846E65]">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 shrink-0 mt-0.5 text-[#AD8980]" />
                        <span>9:16 電子喜帖 + A1 迎賓海報 + 賓客桌卡 + LINE 交通提醒卡</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 shrink-0 mt-0.5 text-[#AD8980]" />
                        <span>全系列四款美學風格皆可無浮水印高解析交付</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 shrink-0 mt-0.5 text-[#AD8980]" />
                        <span>提供 300 DPI 高解析數位完稿（適用自行送印）</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[#E7DDD1] text-xs font-semibold text-[#655047]">
                    {selectedPlan === 'full' ? '✓ 已選擇全套大全配' : '點擊選擇大全配'}
                  </div>
                </button>
              </div>

              {/* Honest Payment Notice & Concierge Reservation Flow */}
              <div className="rounded-2xl border border-[#DFD2C4] bg-[#FBF8F4] p-5 space-y-4">
                <div className="flex items-start gap-2.5 text-xs leading-relaxed text-[#846E65]">
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-[#C5AA7C]" />
                  <p>
                    <strong className="text-[#655047]">訂購與付款說明：</strong>
                    線上自動金流串接籌備中，本頁不會自動扣款，亦不會顯示為已完成付款。請複製設計摘要加入官方 LINE（@lifetale.studio）或填寫下方訂購預約，由專屬婚禮顧問核對並確認付款後，交付完整無浮水印高解析檔案。
                  </p>
                </div>

                {orderSubmitted ? (
                  <div className="rounded-xl border border-[#E3D7CA] bg-[#F5F0E9] p-4 text-center space-y-2">
                    <CheckCircle2 className="h-8 w-8 mx-auto text-[#AD8980]" />
                    <p className="text-sm font-semibold text-[#655047]">
                      已記錄您的訂購預約意向（待顧問聯繫確認付款）
                    </p>
                    <p className="text-xs text-[#846E65] leading-relaxed">
                      感謝 {orderName}！您選擇的是「
                      {selectedPlan === 'full'
                        ? '全套婚禮視覺大全配 NT$ 890'
                        : '輕量電子喜帖包 NT$ 390'}
                      （{series.nameZh}）」。請加入官方 LINE @lifetale.studio，顧問將協助後續匯款確認與高解析檔案交付。
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitOrderInquiry} noValidate className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={orderName}
                        onChange={(e) => {
                          setOrderName(e.target.value);
                          if (orderError) setOrderError(null);
                        }}
                        placeholder="您的稱呼（如：語希 / Chloe）"
                        className={`rounded-xl border bg-[#F5F0E9] px-3.5 py-2.5 min-h-[44px] text-sm text-[#655047] placeholder:text-[#B3A198] focus:outline-none focus:border-[#AD8980] ${
                          orderShake ? 'animate-gentle-shake' : ''
                        } ${
                          orderError && !orderName.trim()
                            ? 'border-[#AD8980]'
                            : 'border-[#DFD2C4]'
                        }`}
                      />
                      <input
                        type="text"
                        value={orderContact}
                        onChange={(e) => {
                          setOrderContact(e.target.value);
                          if (orderError) setOrderError(null);
                        }}
                        placeholder="您的 LINE ID 或聯絡方式"
                        className={`rounded-xl border bg-[#F5F0E9] px-3.5 py-2.5 min-h-[44px] text-sm text-[#655047] placeholder:text-[#B3A198] focus:outline-none focus:border-[#AD8980] ${
                          orderShake ? 'animate-gentle-shake' : ''
                        } ${
                          orderError && !orderContact.trim()
                            ? 'border-[#AD8980]'
                            : 'border-[#DFD2C4]'
                        }`}
                      />
                    </div>
                    {orderError && (
                      <p className="text-xs text-[#AD8980]">{orderError}</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={handleCopyOrderBrief}
                        className="min-h-[46px] rounded-xl border border-[#C5AA7C] bg-[#F5F0E9] hover:bg-[#EFE7DF] px-4 py-2.5 text-xs sm:text-sm font-medium text-[#655047] inline-flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Copy className="h-4 w-4 text-[#AD8980]" />
                        <span>複製方案摘要至 LINE 訂購</span>
                      </button>

                      <button
                        type="submit"
                        className="min-h-[46px] rounded-xl bg-[#655047] hover:bg-[#534038] px-4 py-2.5 text-xs sm:text-sm font-medium text-[#F5F0E9] inline-flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 text-[#E6CBC3]" />
                        <span>提交套組訂購預約</span>
                      </button>
                    </div>
                  </form>
                )}

                <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#9B877E]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#C5AA7C]" />
                  畫面中之香檳燙金為數位視覺效果，非實體紙本燙金加工
                </p>
              </div>

              {/* VIP Concierge Upsell Card */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setView('film')}
                  className="w-full text-left rounded-2xl border border-[#C5AA7C] bg-[#FBF8F4] hover:bg-[#EFE7DF]/70 p-5 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-medium text-[#AD8980]">
                        <Film className="h-4 w-4" />
                        <span>VIP 尊榮客製服務 · LifeTale 工作室</span>
                      </div>
                      <h4 className="font-editorial-serif text-base sm:text-lg font-semibold leading-snug text-[#655047]">
                        想要讓婚紗照動起來？預約 LifeTale 工作室客製《AI 婚紗動態微電影開場片》（NT$ 2,980 起）
                      </h4>
                      <p className="text-xs leading-relaxed text-[#846E65]">
                        將靜態婚紗照轉化為深情回眸、微風拂紗的電影級動態進場影片，搭配專屬配樂與愛情故事字幕。
                      </p>
                    </div>
                    <span className="inline-flex items-center justify-center rounded-xl border border-[#AD8980] bg-[#F5F0E9] px-4 py-2.5 min-h-[44px] text-xs font-medium text-[#655047] whitespace-nowrap shrink-0">
                      查看作品集與預約 →
                    </span>
                  </div>
                </button>
              </div>
            </>
          ) : (
            /* VIP AI Wedding Microfilm Portfolio & LINE Booking View */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-2xl border border-[#E3D7CA] bg-[#FBF8F4]">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={FILM_SHOWCASE_ROSE_ATELIER}
                      alt="玫瑰花園婚紗動態微電影作品截圖"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-3.5">
                    <p className="font-editorial-serif text-sm font-semibold text-[#655047]">
                      皇家玫瑰花園慢鏡 · 30秒進場版
                    </p>
                    <p className="text-xs mt-1 text-[#846E65]">
                      輕紗隨風飄動 · 膠片暖調配樂剪輯
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#E3D7CA] bg-[#FBF8F4]">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={FILM_SHOWCASE_ORIENTAL}
                      alt="新中式庭院婚紗動態微電影作品截圖"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-3.5">
                    <p className="font-editorial-serif text-sm font-semibold text-[#655047]">
                      新中式庭院光影流動 · 60秒故事版
                    </p>
                    <p className="text-xs mt-1 text-[#846E65]">
                      暖燈光影流動 · 雙人相視動態重現
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E3D7CA] bg-[#FBF8F4] p-4 sm:p-5 space-y-2.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-editorial-serif text-base font-semibold text-[#655047]">
                    《AI 婚紗動態微電影開場片》服務內容
                  </h3>
                  <span className="text-sm font-bold tabular-nums text-[#AD8980]">
                    NT$ 2,980 起
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-[#846E65]">
                  <div className="flex items-start gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#C5AA7C]" />
                    <span>精選 8–15 張婚紗照動態化</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#C5AA7C]" />
                    <span>客製新人姓名片頭與配樂</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#C5AA7C]" />
                    <span>4K 宴會廳大螢幕格式 3 日交件</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#C5AA7C] bg-[#FBF8F4] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7DDD1]">
                  <div>
                    <p className="text-xs font-medium text-[#AD8980]">
                      LINE 專人一對一諮詢預約
                    </p>
                    <p className="text-base font-semibold mt-0.5 text-[#655047]">
                      官方 LINE ID：<span className="tabular-nums">@lifetale.studio</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLineId}
                    className="min-h-[44px] rounded-xl border border-[#C5AA7C] px-4 py-2 text-xs sm:text-sm font-medium text-[#655047] hover:bg-[#EFE7DF] inline-flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-[#AD8980]" />
                    <span>複製 LINE ID 預約</span>
                  </button>
                </div>

                {bookingSubmitted ? (
                  <div className="text-center py-4 space-y-2">
                    <CheckCircle2 className="h-9 w-9 mx-auto text-[#AD8980]" />
                    <p className="text-sm font-semibold text-[#655047]">
                      預約諮詢已送出！
                    </p>
                    <p className="text-xs text-[#846E65] leading-relaxed">
                      感謝 {bookingName || data.coupleNamesZh}，LifeTale 工作室導演團隊將透過 {bookingContact} 與您聯繫，也可直接加入 LINE @lifetale.studio 洽詢檔期。
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitBooking} noValidate className="space-y-3">
                    <p className="text-xs font-medium text-[#846E65]">
                      或留下資料，由婚禮影像顧問優先為您保留檔期（請勿填入身分證字號等敏感個資）：
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={bookingName}
                        onChange={(e) => {
                          setBookingName(e.target.value);
                          if (bookingError) setBookingError(null);
                        }}
                        placeholder={`新人稱呼（預設：${data.coupleNamesZh}）`}
                        className={`rounded-xl border bg-[#F5F0E9] px-3.5 py-2.5 min-h-[44px] text-sm text-[#655047] placeholder:text-[#B3A198] ${
                          bookingShake ? 'animate-gentle-shake' : ''
                        } ${
                          bookingError && !bookingName.trim()
                            ? 'border-[#AD8980]'
                            : 'border-[#DFD2C4]'
                        }`}
                      />
                      <input
                        type="text"
                        value={bookingContact}
                        onChange={(e) => {
                          setBookingContact(e.target.value);
                          if (bookingError) setBookingError(null);
                        }}
                        placeholder="您的 LINE ID 或手機號碼"
                        className={`rounded-xl border bg-[#F5F0E9] px-3.5 py-2.5 min-h-[44px] text-sm text-[#655047] placeholder:text-[#B3A198] ${
                          bookingShake ? 'animate-gentle-shake' : ''
                        } ${
                          bookingError && !bookingContact.trim()
                            ? 'border-[#AD8980]'
                            : 'border-[#DFD2C4]'
                        }`}
                      />
                    </div>
                    {bookingError && (
                      <p className="text-xs text-[#AD8980]">{bookingError}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full min-h-[48px] rounded-xl bg-[#655047] hover:bg-[#534038] px-4 py-3 text-sm font-medium text-[#F5F0E9] inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 text-[#E6CBC3]" />
                      <span>送出 VIP 微電影諮詢預約</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
