import React, { useState } from 'react';
import { X, MapPin, Navigation, Copy, CheckCircle2, Users } from 'lucide-react';
import { THEME_CONFIGS, ThemeId, WeddingData } from '../types/wedding';

interface MapSimModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeId: ThemeId;
  data: WeddingData;
  onNotify: (msg: string) => void;
}

export const MapSimulationModal: React.FC<MapSimModalProps> = ({
  isOpen,
  onClose,
  themeId,
  data,
  onNotify,
}) => {
  if (!isOpen) return null;
  const theme = THEME_CONFIGS[themeId];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${data.venueName} ${data.venueAddress}`
  )}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${data.venueName}（${data.venueAddress}）`);
      onNotify('已複製婚宴會館地址');
    } catch {
      onNotify('已選取會館地址');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-sim-title"
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border p-6 space-y-4 shadow-2xl"
        style={{
          backgroundColor: theme.colors.canvasBg,
          borderColor: theme.colors.border,
          color: theme.colors.inkPrimary,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-xs font-medium"
              style={{ color: theme.colors.primaryAccent }}
            >
              電子喜帖互動預覽 · 地圖導航
            </p>
            <h3
              id="map-sim-title"
              className={`text-xl font-semibold mt-1 ${theme.typography.displayClass}`}
            >
              {data.venueName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border transition-colors"
            style={{
              borderColor: theme.colors.secondaryBorder,
              color: theme.colors.inkSecondary,
            }}
            aria-label="關閉地圖預覽"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Clean architectural map schematic card */}
        <div
          className="rounded-xl border p-4 space-y-3"
          style={{
            backgroundColor: theme.colors.surfaceBg,
            borderColor: theme.colors.secondaryBorder,
          }}
        >
          <div className="flex items-start gap-2.5 text-sm">
            <MapPin
              className="h-4 w-4 shrink-0 mt-1"
              style={{ color: theme.colors.primaryAccent }}
            />
            <div>
              <p className="font-medium">{data.venueAddress}</p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: theme.colors.inkSecondary }}>
                {data.trafficNote}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleCopyAddress}
            className="min-h-[44px] rounded-xl border px-3 py-2.5 text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5"
            style={{
              borderColor: theme.colors.border,
              color: theme.colors.inkPrimary,
            }}
          >
            <Copy className="h-4 w-4" />
            複製地址
          </button>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5"
            style={{
              backgroundColor: theme.colors.primaryAccent,
              color: theme.colors.primaryAccentText,
            }}
          >
            <Navigation className="h-4 w-4" />
            開啟 Google 地圖
          </a>
        </div>
      </div>
    </div>
  );
};

interface RsvpSimModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeId: ThemeId;
  data: WeddingData;
}

export const RsvpSimulationModal: React.FC<RsvpSimModalProps> = ({
  isOpen,
  onClose,
  themeId,
  data,
}) => {
  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guestCount, setGuestCount] = useState('2');
  const [dietary, setDietary] = useState('一般葷食');
  const [blessing, setBlessing] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  if (!isOpen) return null;
  const theme = THEME_CONFIGS[themeId];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setRsvpError('請先輸入貴賓姓名再送出喔');
      setShake(false);
      window.requestAnimationFrame(() => setShake(true));
      window.setTimeout(() => setShake(false), 450);
      return;
    }
    setRsvpError(null);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setRsvpError(null);
    setGuestName('');
    setBlessing('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-sim-title"
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: theme.colors.canvasBg,
          borderColor: theme.colors.border,
          color: theme.colors.inkPrimary,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-xs font-medium"
              style={{ color: theme.colors.primaryAccent }}
            >
              電子喜帖互動預覽 · 賓客出席回覆
            </p>
            <h3
              id="rsvp-sim-title"
              className={`text-xl font-semibold mt-1 ${theme.typography.displayClass}`}
            >
              {data.coupleNamesZh} 婚宴出席表單
            </h3>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border"
            style={{
              borderColor: theme.colors.secondaryBorder,
              color: theme.colors.inkSecondary,
            }}
            aria-label="關閉出席表單預覽"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div
            className="rounded-2xl border p-6 text-center space-y-3"
            style={{
              backgroundColor: theme.colors.surfaceBg,
              borderColor: theme.colors.secondaryBorder,
            }}
          >
            <CheckCircle2
              className="h-10 w-10 mx-auto"
              style={{ color: theme.colors.primaryAccent }}
            />
            <h4 className={`text-lg font-semibold ${theme.typography.displayClass}`}>
              已完成出席回覆預覽
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: theme.colors.inkSecondary }}>
              謝謝 {guestName || '親愛的貴賓'}！系統已模擬記錄您的回覆（
              {attending === 'yes' ? `預計 ${guestCount} 位出席 · ${dietary}` : '遠端獻上祝福'}
              ）。正式版電子喜帖可串接 Google 表單或名單匯出。
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full min-h-[44px] rounded-xl px-4 py-2.5 text-sm font-semibold mt-2"
              style={{
                backgroundColor: theme.colors.primaryAccent,
                color: theme.colors.primaryAccentText,
              }}
            >
              返回編輯畫面
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: theme.colors.inkSecondary }}>
                貴賓姓名
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  if (rsvpError) setRsvpError(null);
                }}
                placeholder="例如：林子軒"
                className={`w-full rounded-xl border px-3.5 py-2.5 min-h-[44px] text-sm ${
                  shake ? 'animate-gentle-shake' : ''
                }`}
                style={{
                  backgroundColor: theme.colors.surfaceBg,
                  borderColor: rsvpError
                    ? theme.colors.primaryAccent
                    : theme.colors.secondaryBorder,
                }}
              />
              {rsvpError && (
                <p className="mt-1.5 text-xs" style={{ color: theme.colors.primaryAccent }}>
                  {rsvpError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: theme.colors.inkSecondary }}>
                出席意願
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAttending('yes')}
                  className="min-h-[44px] rounded-xl border px-3 py-2 text-xs sm:text-sm font-medium"
                  style={{
                    backgroundColor:
                      attending === 'yes' ? theme.colors.primaryAccent : theme.colors.surfaceBg,
                    color:
                      attending === 'yes' ? theme.colors.primaryAccentText : theme.colors.inkPrimary,
                    borderColor:
                      attending === 'yes' ? theme.colors.primaryAccent : theme.colors.secondaryBorder,
                  }}
                >
                  準時赴宴祝賀
                </button>
                <button
                  type="button"
                  onClick={() => setAttending('no')}
                  className="min-h-[44px] rounded-xl border px-3 py-2 text-xs sm:text-sm font-medium"
                  style={{
                    backgroundColor:
                      attending === 'no' ? theme.colors.primaryAccent : theme.colors.surfaceBg,
                    color:
                      attending === 'no' ? theme.colors.primaryAccentText : theme.colors.inkPrimary,
                    borderColor:
                      attending === 'no' ? theme.colors.primaryAccent : theme.colors.secondaryBorder,
                  }}
                >
                  不克前往 · 獻上祝福
                </button>
              </div>
            </div>

            {attending === 'yes' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1 text-xs font-medium mb-1.5" style={{ color: theme.colors.inkSecondary }}>
                    <Users className="h-3.5 w-3.5" />
                    出席人數
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2.5 min-h-[44px] text-sm tabular-nums"
                    style={{
                      backgroundColor: theme.colors.surfaceBg,
                      borderColor: theme.colors.secondaryBorder,
                    }}
                  >
                    <option value="1">1 位</option>
                    <option value="2">2 位</option>
                    <option value="3">3 位</option>
                    <option value="4">4 位</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: theme.colors.inkSecondary }}>
                    飲食習慣
                  </label>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2.5 min-h-[44px] text-sm"
                    style={{
                      backgroundColor: theme.colors.surfaceBg,
                      borderColor: theme.colors.secondaryBorder,
                    }}
                  >
                    <option value="一般葷食">一般葷食</option>
                    <option value="蛋奶素">蛋奶素</option>
                    <option value="全素食">全素食</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: theme.colors.inkSecondary }}>
                給新人的祝福小語
              </label>
              <textarea
                rows={2}
                value={blessing}
                onChange={(e) => setBlessing(e.target.value)}
                placeholder="祝你們永浴愛河、白頭偕老！"
                className="w-full rounded-xl border px-3.5 py-2 text-sm resize-none"
                style={{
                  backgroundColor: theme.colors.surfaceBg,
                  borderColor: theme.colors.secondaryBorder,
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-xl px-4 py-3 text-sm font-semibold"
              style={{
                backgroundColor: theme.colors.primaryAccent,
                color: theme.colors.primaryAccentText,
              }}
            >
              送出出席回覆（預覽測試）
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
