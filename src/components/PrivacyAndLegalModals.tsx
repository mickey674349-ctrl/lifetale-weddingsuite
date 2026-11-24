import React from 'react';
import { ShieldCheck, Lock, Sparkles, X, AlertCircle } from 'lucide-react';
import { THEME_CONFIGS, ThemeId } from '../types/wedding';

interface PrivacyConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  themeId: ThemeId;
}

export const PrivacyConsentModal: React.FC<PrivacyConsentModalProps> = ({
  isOpen,
  onAccept,
  themeId,
}) => {
  if (!isOpen) return null;
  const theme = THEME_CONFIGS[themeId];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-consent-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl border p-6 sm:p-8 shadow-2xl space-y-5"
        style={{
          backgroundColor: theme.colors.canvasBg,
          borderColor: theme.colors.border,
          color: theme.colors.inkPrimary,
        }}
      >
        <div className="space-y-2">
          <div
            className="inline-flex items-center gap-2 text-xs font-medium"
            style={{ color: theme.colors.primaryAccent }}
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>安全使用與隱私保護說明</span>
          </div>
          <h2
            id="privacy-consent-title"
            className={`text-xl sm:text-2xl font-semibold leading-snug ${theme.typography.displayClass}`}
          >
            歡迎使用 LifeTale WeddingSuite
          </h2>
          <p
            className="text-xs sm:text-sm leading-relaxed"
            style={{ color: theme.colors.inkSecondary }}
          >
            開始設計屬於你們的婚禮視覺前，請先確認以下安心使用須知：
          </p>
        </div>

        <div
          className="rounded-xl border p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm leading-relaxed"
          style={{
            backgroundColor: theme.colors.surfaceBg,
            borderColor: theme.colors.secondaryBorder,
            color: theme.colors.inkSecondary,
          }}
        >
          <div className="flex items-start gap-2.5">
            <Sparkles
              className="h-4 w-4 shrink-0 mt-0.5"
              style={{ color: theme.colors.primaryAccent }}
            />
            <p>
              <strong style={{ color: theme.colors.inkPrimary }}>
                AI 輔助設計與參考聲明：
              </strong>
              本工具由生成式 AI 輔助產出，僅供日常溝通靈感、生活紀錄與視覺設計參考，不構成任何專業醫療、心理諮商或法律建議。
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <Lock
              className="h-4 w-4 shrink-0 mt-0.5"
              style={{ color: theme.colors.primaryAccent }}
            />
            <p>
              <strong style={{ color: theme.colors.inkPrimary }}>
                敏感個資防呆與零儲存保護：
              </strong>
              輸入文字時，請勿填入身分證字號、真實全名或銀行帳號等敏感個資；系統不會在伺服器儲存任何私人對話或婚紗照片，所有影像均於您的裝置本機即時處理。
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <AlertCircle
              className="h-4 w-4 shrink-0 mt-0.5"
              style={{ color: theme.colors.primaryAccent }}
            />
            <p>
              <strong style={{ color: theme.colors.inkPrimary }}>
                免費預覽與本機輸出說明：
              </strong>
              您可自由調整排版並反覆下載含浮水印預覽圖確認細節；為避免重複誤觸，每次匯出後設有短暫操作冷卻。
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAccept}
          className="w-full min-h-[48px] rounded-xl px-5 py-3 text-sm sm:text-base font-semibold transition-transform active:scale-[0.99] shadow-sm"
          style={{
            backgroundColor: theme.colors.primaryAccent,
            color: theme.colors.primaryAccentText,
          }}
        >
          我已了解並開始使用
        </button>
      </div>
    </div>
  );
};

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeId: ThemeId;
}

export const LegalDisclaimerModal: React.FC<LegalDisclaimerModalProps> = ({
  isOpen,
  onClose,
  themeId,
}) => {
  if (!isOpen) return null;
  const theme = THEME_CONFIGS[themeId];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div
        className="w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl border shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: theme.colors.canvasBg,
          borderColor: theme.colors.border,
          color: theme.colors.inkPrimary,
        }}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-5 sm:px-7 py-4 backdrop-blur-md"
          style={{
            backgroundColor: `${theme.colors.canvasBg}EB`,
            borderColor: theme.colors.secondaryBorder,
          }}
        >
          <div>
            <p
              className="text-xs font-medium"
              style={{ color: theme.colors.primaryAccent }}
            >
              LifeTale Studio · 官方政策說明
            </p>
            <h2
              id="legal-modal-title"
              className={`text-lg sm:text-xl font-semibold ${theme.typography.displayClass}`}
            >
              服務條款、隱私保護與 AI 免責聲明
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border shrink-0 transition-colors hover:bg-black/5"
            style={{
              borderColor: theme.colors.secondaryBorder,
              color: theme.colors.inkSecondary,
            }}
            aria-label="關閉條款說明"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className="p-5 sm:p-7 space-y-5 text-xs sm:text-sm leading-relaxed"
          style={{ color: theme.colors.inkSecondary }}
        >
          <section className="space-y-1.5">
            <h3
              className={`text-base font-semibold ${theme.typography.displayClass}`}
              style={{ color: theme.colors.inkPrimary }}
            >
              01. 生成式 AI 輔助與免責聲明
            </h3>
            <p>
              本應用程式（LifeTale 婚禮視覺套版師｜WeddingSuite）部分文案與影像視覺係結合生成式 AI 與自動化版型引擎產出，僅供日常溝通靈感、生活紀錄與婚禮視覺設計參考。本服務內容不構成任何專業醫療、心理諮商、財務或法律建議；實際印刷或公開發佈前，請自行校對婚宴日期、時間、地點及文字正確性。
            </p>
          </section>

          <section className="space-y-1.5">
            <h3
              className={`text-base font-semibold ${theme.typography.displayClass}`}
              style={{ color: theme.colors.inkPrimary }}
            >
              02. 隱私權與敏感個資保護原則
            </h3>
            <p>
              您於本工具上傳的婚紗照與輸入之婚禮資訊，均僅在您的瀏覽器本機端即時合成預覽與產生圖檔，本工作室伺服器不會儲存、蒐集或留存您的任何私人照片或對話紀錄。為保護自身權益，請勿於任何文字欄位填入身分證字號、護照號碼、銀行帳號或信用卡號等敏感個資。
            </p>
          </section>

          <section className="space-y-1.5">
            <h3
              className={`text-base font-semibold ${theme.typography.displayClass}`}
              style={{ color: theme.colors.inkPrimary }}
            >
              03. 合理使用與匯出保護規範
            </h3>
            <p>
              本服務於瀏覽器本機提供免費試排與含浮水印預覽圖下載，並於每次匯出後提供短暫操作冷卻，以維持流暢穩定的設計體驗。禁止以自動化腳本或惡意高頻請求干擾服務運作。
            </p>
          </section>

          <section className="space-y-1.5">
            <h3
              className={`text-base font-semibold ${theme.typography.displayClass}`}
              style={{ color: theme.colors.inkPrimary }}
            >
              04. 智慧財產權、數位視覺與授權範圍
            </h3>
            <p>
              免費下載之預覽圖檔包含 LifeTale WeddingSuite 品牌浮水印，僅供個人非商業試看與評估使用；經專屬顧問確認訂購後所交付之無浮水印高解析圖檔，授權新人用於個人婚禮電子喜帖發送、現場迎賓海報、桌卡與交通提醒卡使用。畫面呈現之香檳燙金與火漆印章皆為數位螢幕與數位印刷視覺效果，不代表成品具備實體紙本燙金加工工藝。
            </p>
          </section>

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[44px] rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
              style={{
                backgroundColor: theme.colors.surfaceBg,
                borderColor: theme.colors.border,
                color: theme.colors.inkPrimary,
              }}
            >
              我已閱讀並關閉視窗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
