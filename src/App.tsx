import { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Eye, X } from 'lucide-react';
import {
  DEFAULT_WEDDING_DATA,
  PreviewAssetTab,
  StudioStep,
  THEME_CONFIGS,
  ThemeId,
  WeddingData,
} from './types/wedding';
import { AtelierHomepage } from './components/AtelierHomepage';
import { StudioStepperEditor } from './components/StudioStepperEditor';
import { PreviewCanvas } from './components/PreviewCanvas';
import { WeddingPrintAssistant } from './components/WeddingPrintAssistant';
import { AtelierBotanicalDivider } from './components/ThemeDecorations';
import {
  MapSimulationModal,
  RsvpSimulationModal,
} from './components/InteractiveSimModals';
import { UnlockPricingModal } from './components/UnlockPricingModal';
import {
  PrivacyConsentModal,
  LegalDisclaimerModal,
} from './components/PrivacyAndLegalModals';
import { useUsageGuard } from './hooks/useUsageGuard';
import { exportWeddingAsset } from './utils/canvasExporter';

export default function App() {
  // Default flagship series: 01. Royal Rose Garden
  const [themeId, setThemeId] = useState<ThemeId>('royal-rose');
  const [currentStep, setCurrentStep] = useState<StudioStep>(1);
  const [activeTab, setActiveTab] = useState<PreviewAssetTab>('e-invite');
  const [weddingData, setWeddingData] =
    useState<WeddingData>(DEFAULT_WEDDING_DATA);

  const [orderModalState, setOrderModalState] = useState<{
    open: boolean;
    view: 'pricing' | 'film';
  }>({ open: false, view: 'pricing' });

  const [isMapSimOpen, setIsMapSimOpen] = useState(false);
  const [isRsvpSimOpen, setIsRsvpSimOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [hasEnteredStudio, setHasEnteredStudio] = useState(false);
  const [isStudioVisible, setIsStudioVisible] = useState(false);
  const studioSectionRef = useRef<HTMLElement | null>(null);

  // Export, validation & error recovery states
  const [isExporting, setIsExporting] = useState(false);
  const [validationErrorField, setValidationErrorField] = useState<string | null>(
    null
  );
  const [validationHint, setValidationHint] = useState<string | null>(null);
  const [exportErrorMessage, setExportErrorMessage] = useState<string | null>(
    null
  );
  const [shakeTrigger, setShakeTrigger] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const {
    hasAcceptedConsent,
    acceptConsent,
    cooldownSeconds,
    recordGenerationRequest,
  } = useUsageGuard();

  // Only show the mobile fixed bottom step bar once user enters Design Studio and is viewing it
  useEffect(() => {
    const el = studioSectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsStudioVisible(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  const scrollToElement = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleStartCreating = useCallback(() => {
    setHasEnteredStudio(true);
    setCurrentStep(1);
    scrollToElement('atelier-studio');
  }, [scrollToElement]);

  const handleExploreSeries = useCallback(() => {
    scrollToElement('series-gallery');
  }, [scrollToElement]);

  const handlePickSeriesAndEnterStudio = useCallback(
    (id: ThemeId) => {
      setHasEnteredStudio(true);
      setThemeId(id);
      setCurrentStep(2);
      const next = THEME_CONFIGS[id];
      showToast(`已選擇「${next.nameZh}」，請上傳婚紗照或檢視即時成品`);
      scrollToElement('atelier-studio');
    },
    [scrollToElement, showToast]
  );

  const handleSelectTheme = useCallback(
    (id: ThemeId) => {
      setThemeId(id);
      const next = THEME_CONFIGS[id];
      showToast(`已套用「${next.nameZh}」精品紙藝美學`);
    },
    [showToast]
  );

  const handleChangeData = useCallback((patch: Partial<WeddingData>) => {
    setWeddingData((prev) => ({ ...prev, ...patch }));
    setValidationErrorField(null);
    setValidationHint(null);
  }, []);

  const handleResetAll = useCallback(() => {
    setWeddingData(DEFAULT_WEDDING_DATA);
    setValidationErrorField(null);
    setValidationHint(null);
    showToast('已恢復預設婚禮示範資訊');
  }, [showToast]);

  const handleClearTextFields = useCallback(() => {
    setWeddingData((prev) => ({
      ...prev,
      coupleNamesZh: '',
      coupleNamesEn: '',
      venueName: '',
      venueAddress: '',
      trafficNote: '',
      tableLabel: '',
      welcomeQuote: '',
    }));
    setValidationErrorField(null);
    showToast('已清空文字欄位，可重新填入您的婚禮資訊');
  }, [showToast]);

  const triggerGentleShake = useCallback((message: string) => {
    setValidationHint(message);
    setShakeTrigger(false);
    window.requestAnimationFrame(() => {
      setShakeTrigger(true);
    });
    window.setTimeout(() => setShakeTrigger(false), 450);
  }, []);

  const validateBeforeGenerate = useCallback((): boolean => {
    if (!weddingData.coupleNamesZh.trim() && !weddingData.coupleNamesEn.trim()) {
      setValidationErrorField('coupleNamesZh');
      setCurrentStep(3);
      window.setTimeout(() => {
        document.getElementById('couple-zh')?.focus();
      }, 60);
      return false;
    }
    if (!weddingData.venueName.trim()) {
      setValidationErrorField('venueName');
      setCurrentStep(3);
      window.setTimeout(() => {
        document.getElementById('venue-name')?.focus();
      }, 60);
      return false;
    }
    setValidationErrorField(null);
    return true;
  }, [weddingData]);

  const handleTriggerExport = useCallback(async () => {
    setExportErrorMessage(null);
    setValidationHint(null);

    if (!validateBeforeGenerate()) {
      triggerGentleShake('請先輸入內容再開始喔（請確認新人姓名與婚宴場地已填寫）');
      return;
    }

    if (cooldownSeconds > 0) {
      return;
    }

    setIsExporting(true);
    try {
      const filename = await exportWeddingAsset({
        data: weddingData,
        themeId,
        assetTab: activeTab,
        includeWatermark: true,
      });
      recordGenerationRequest();
      showToast(`已生成並下載預覽圖：${filename}`);
    } catch {
      setExportErrorMessage(
        '目前網路連線較不穩定，或系統忙碌中，請稍候片刻再試一次。'
      );
    } finally {
      setIsExporting(false);
    }
  }, [
    activeTab,
    cooldownSeconds,
    recordGenerationRequest,
    showToast,
    themeId,
    triggerGentleShake,
    validateBeforeGenerate,
    weddingData,
  ]);

  const handleMobileStepChange = (nextStep: StudioStep) => {
    setCurrentStep(nextStep);
    scrollToElement('atelier-studio');
  };

  const showMobileStudioBar = hasEnteredStudio && isStudioVisible;

  return (
    <div
      className={`min-h-screen bg-[#FAF3EF] text-[#70534C] ${
        showMobileStudioBar ? 'pb-20 lg:pb-0' : ''
      }`}
    >
      {/* Top Bar Contract: 3 clean single-line zones */}
      <header className="sticky top-0 z-30 border-b border-[#E8DCD3] bg-[#FAF3EF]/92 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 h-14 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="font-editorial-serif text-lg sm:text-xl font-semibold tracking-tight text-[#70534C] whitespace-nowrap shrink-0"
          >
            LifeTale WeddingSuite
          </a>

          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#8A6D65]"
            aria-label="主導覽列"
          >
            <a
              href="#series-gallery"
              className="hover:text-[#70534C] hover:underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
            >
              精品系列
            </a>
            <button
              type="button"
              onClick={() => {
                setHasEnteredStudio(true);
                scrollToElement('atelier-studio');
              }}
              className="hover:text-[#70534C] hover:underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
            >
              設計工作室
            </button>
            <button
              type="button"
              onClick={() => {
                setHasEnteredStudio(true);
                setCurrentStep(4);
                scrollToElement('atelier-studio');
              }}
              className="hover:text-[#70534C] hover:underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
            >
              成品套組
            </button>
            <a
              href="#print-assistant"
              className="hover:text-[#70534C] hover:underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
            >
              印製交付
            </a>
            <button
              type="button"
              onClick={() => setOrderModalState({ open: true, view: 'pricing' })}
              className="hover:text-[#70534C] hover:underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
            >
              方案說明
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleStartCreating}
              className="min-h-[38px] rounded-lg bg-[#C29B92] hover:bg-[#B58B83] px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-medium text-[#FAF3EF] shadow-[0_6px_16px_-6px_rgba(181,139,131,0.55)] whitespace-nowrap shrink-0 transition-colors"
            >
              免費打造我的婚禮
            </button>
          </div>
        </div>
      </header>

      {/* Editorial Homepage Hero & 4 Real-Photography Wedding Series Showcase */}
      <AtelierHomepage
        selectedThemeId={themeId}
        onStartCreating={handleStartCreating}
        onExploreSeries={handleExploreSeries}
        onPickSeriesAndEnterStudio={handlePickSeriesAndEnterStudio}
      />

      {/* Bespoke Online Bridal Atelier Studio Section */}
      <section
        id="atelier-studio"
        ref={studioSectionRef}
        className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 py-12 sm:py-16 scroll-mt-14"
      >
        <div className="max-w-2xl mx-auto text-center space-y-2.5 mb-8 sm:mb-12">
          <p className="text-xs tracking-[0.22em] text-[#AD8980] font-medium">
            BESPOKE ONLINE ATELIER
          </p>
          <h2 className="font-editorial-serif text-2xl sm:text-3xl font-semibold text-[#655047]">
            四步驟打造專屬婚禮視覺套組
          </h2>
          <AtelierBotanicalDivider />
          <p className="text-xs sm:text-sm text-[#846E65]">
            右側即時呈現金緻紙藝成品效果；手機版可隨時點選底部「預覽成品」按鈕檢視最新畫面。
          </p>
        </div>

        {/* Desktop 2-Column Atelier Split / Mobile Guided Step Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: 4-Step Guided Editor */}
          <div className="lg:col-span-5 space-y-6">
            {/* On mobile Step 4, display live Preview right above download controls */}
            {currentStep === 4 && (
              <div className="lg:hidden">
                <PreviewCanvas
                  themeId={themeId}
                  activeTab={activeTab}
                  onChangeTab={setActiveTab}
                  data={weddingData}
                  isExporting={isExporting}
                  cooldownSeconds={cooldownSeconds}
                  validationHint={validationHint}
                  exportErrorMessage={exportErrorMessage}
                  shakeTrigger={shakeTrigger}
                  onTriggerExport={handleTriggerExport}
                  onOpenOrderModal={(view = 'pricing') =>
                    setOrderModalState({ open: true, view })
                  }
                  onOpenMapSim={() => setIsMapSimOpen(true)}
                  onOpenRsvpSim={() => setIsRsvpSimOpen(true)}
                  onNotify={showToast}
                  compactFooter
                />
              </div>
            )}

            <StudioStepperEditor
              currentStep={currentStep}
              onChangeStep={(step) => {
                setHasEnteredStudio(true);
                setCurrentStep(step);
              }}
              themeId={themeId}
              onSelectTheme={handleSelectTheme}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              data={weddingData}
              onChangeData={handleChangeData}
              onResetAll={handleResetAll}
              onClearTextFields={handleClearTextFields}
              validationErrorField={validationErrorField}
              isExporting={isExporting}
              cooldownSeconds={cooldownSeconds}
              validationHint={validationHint}
              exportErrorMessage={exportErrorMessage}
              shakeTrigger={shakeTrigger}
              onTriggerExport={handleTriggerExport}
              onOpenOrderModal={(view = 'pricing') =>
                setOrderModalState({ open: true, view })
              }
              onOpenPrintAssistant={() => scrollToElement('print-assistant')}
              onNotify={showToast}
            />
          </div>

          {/* Right Column (Desktop Sticky Live Pearl-Marble Stationery Stage) */}
          <div className="hidden lg:block lg:col-span-7 lg:sticky lg:top-20">
            <PreviewCanvas
              themeId={themeId}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              data={weddingData}
              isExporting={isExporting}
              cooldownSeconds={cooldownSeconds}
              validationHint={validationHint}
              exportErrorMessage={exportErrorMessage}
              shakeTrigger={shakeTrigger}
              onTriggerExport={handleTriggerExport}
              onOpenOrderModal={(view = 'pricing') =>
                setOrderModalState({ open: true, view })
              }
              onOpenMapSim={() => setIsMapSimOpen(true)}
              onOpenRsvpSim={() => setIsRsvpSimOpen(true)}
              onNotify={showToast}
            />
          </div>
        </div>
      </section>

      {/* Wedding Print Assistant: Prepress Spec, Honest Preflight & Delivery Package */}
      <WeddingPrintAssistant
        themeId={themeId}
        data={weddingData}
        onNotify={showToast}
        onJumpToStep={(step) => {
          setHasEnteredStudio(true);
          setCurrentStep(step);
          scrollToElement('atelier-studio');
        }}
      />

      {/* Quiet Editorial Footer with Permanent Legal & Disclaimer Link */}
      <footer className="border-t border-[#E3D7CA] bg-[#FBF8F4]/70 py-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9B877E]">
          <button
            type="button"
            onClick={() => setIsLegalModalOpen(true)}
            className="min-h-[44px] inline-flex items-center hover:text-[#655047] hover:underline underline-offset-4 transition-colors"
          >
            © LifeTale Studio · 服務條款與 AI 免責聲明
          </button>
          <button
            type="button"
            onClick={() => setOrderModalState({ open: true, view: 'film' })}
            className="min-h-[44px] inline-flex items-center font-medium text-[#846E65] hover:text-[#655047] hover:underline underline-offset-4 transition-colors"
          >
            預約客製《AI 婚紗動態微電影開場片》· LINE @lifetale.studio
          </button>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Step Bar — Hidden on Homepage, shown only after entering Design Studio */}
      {showMobileStudioBar && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[#E8DCD3] bg-[#FAF3EF]/95 backdrop-blur-md px-3 py-2">
          <div className="mx-auto max-w-md grid grid-cols-3 gap-2 items-center">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => handleMobileStepChange((currentStep - 1) as StudioStep)}
              className="min-h-[44px] rounded-lg border border-[#DFD2C4] bg-[#FFFDFB] px-2.5 text-xs font-medium text-[#70534C] inline-flex items-center justify-center gap-1 disabled:opacity-40"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>上一步</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMobilePreviewOpen(true)}
              className="min-h-[44px] rounded-lg border border-[#C8AA7B] bg-[#F4E9E3] px-2.5 text-xs font-medium text-[#70534C] inline-flex items-center justify-center gap-1.5"
            >
              <Eye className="h-3.5 w-3.5 text-[#B58B83]" />
              <span>預覽成品</span>
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => handleMobileStepChange((currentStep + 1) as StudioStep)}
                className="min-h-[44px] rounded-lg bg-[#C29B92] hover:bg-[#B58B83] px-2.5 text-xs font-medium text-[#FAF3EF] inline-flex items-center justify-center gap-1"
              >
                <span>下一步</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setOrderModalState({ open: true, view: 'pricing' })}
                className="min-h-[44px] rounded-lg bg-[#C29B92] hover:bg-[#B58B83] px-2.5 text-xs font-medium text-[#FAF3EF] inline-flex items-center justify-center"
              >
                <span>套組方案</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Instant Preview Sheet */}
      {isMobilePreviewOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-[#3C2F2A]/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="即時成品預覽"
        >
          <div className="w-full max-h-[92vh] overflow-y-auto rounded-t-3xl border-t border-[#C8AA7B] bg-[#FAF3EF] p-4 pb-8 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <p className="text-[11px] tracking-[0.16em] text-[#B58B83]">
                  LIVE PREVIEW
                </p>
                <h3 className="font-editorial-serif text-lg font-semibold text-[#70534C]">
                  即時婚禮成品預覽
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobilePreviewOpen(false)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-[#DFD2C4] text-[#70534C]"
                aria-label="關閉即時預覽"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <PreviewCanvas
              themeId={themeId}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              data={weddingData}
              isExporting={isExporting}
              cooldownSeconds={cooldownSeconds}
              validationHint={validationHint}
              exportErrorMessage={exportErrorMessage}
              shakeTrigger={shakeTrigger}
              onTriggerExport={handleTriggerExport}
              onOpenOrderModal={(view = 'pricing') => {
                setIsMobilePreviewOpen(false);
                setOrderModalState({ open: true, view });
              }}
              onOpenMapSim={() => setIsMapSimOpen(true)}
              onOpenRsvpSim={() => setIsRsvpSimOpen(true)}
              onNotify={showToast}
            />
          </div>
        </div>
      )}

      {/* First-Visit Security & Privacy Consent Modal */}
      <PrivacyConsentModal
        isOpen={!hasAcceptedConsent}
        onAccept={acceptConsent}
        themeId={themeId}
      />

      {/* Permanent Legal & AI Disclaimer Modal */}
      <LegalDisclaimerModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        themeId={themeId}
      />

      {/* Interactive E-Invite Simulation Modals */}
      <MapSimulationModal
        isOpen={isMapSimOpen}
        onClose={() => setIsMapSimOpen(false)}
        themeId={themeId}
        data={weddingData}
        onNotify={showToast}
      />

      <RsvpSimulationModal
        isOpen={isRsvpSimOpen}
        onClose={() => setIsRsvpSimOpen(false)}
        themeId={themeId}
        data={weddingData}
      />

      {/* Honest Boutique Order & VIP Microfilm Modal */}
      <UnlockPricingModal
        isOpen={orderModalState.open}
        initialView={orderModalState.view}
        onClose={() => setOrderModalState((s) => ({ ...s, open: false }))}
        themeId={themeId}
        data={weddingData}
        onNotify={showToast}
      />

      {/* Non-intrusive Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] rounded-xl border border-[#C5AA7C] bg-[#655047] px-4 py-2.5 text-xs sm:text-sm font-medium text-[#F5F0E9] shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
