import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import {
  BOTANICAL_ROSE_CORNER,
  HERO_STATIONERY_IMAGE,
  THEME_CONFIGS,
  THEME_ORDER,
  ThemeId,
} from '../types/wedding';
import { AtelierBotanicalDivider } from './ThemeDecorations';

interface AtelierHomepageProps {
  selectedThemeId: ThemeId;
  onStartCreating: () => void;
  onExploreSeries: () => void;
  onPickSeriesAndEnterStudio: (themeId: ThemeId) => void;
}

export const AtelierHomepage: React.FC<AtelierHomepageProps> = ({
  selectedThemeId,
  onStartCreating,
  onExploreSeries,
  onPickSeriesAndEnterStudio,
}) => {
  return (
    <div id="top">
      {/* Asymmetric 40% / 60% Haute Couture Editorial Magazine Hero (Above-the-Fold) */}
      <section className="relative overflow-hidden border-b border-[#E8DCD3] bg-[#FAF3EF]">
        {/* Whisper-light translucent botanical rose corner engraving */}
        <img
          src={BOTANICAL_ROSE_CORNER}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="pointer-events-none select-none absolute -top-6 -left-6 w-52 sm:w-64 lg:w-72 opacity-30 mix-blend-multiply"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-0 lg:min-h-[calc(100vh-56px)] flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-8 lg:gap-12 items-center">
            {/* Left ~40%: Editorial Brand Lockup, Script Tagline, Headline & Vintage Rose Actions */}
            <div className="space-y-6 lg:pr-2">
              <div className="space-y-3.5">
                <p className="text-xs tracking-[0.22em] text-[#B58B83] font-medium">
                  LifeTale WeddingSuite · 專屬婚禮美學設計室
                </p>

                <p className="font-script text-4xl sm:text-[42px] text-[#C8AA7B] leading-none pt-1">
                  Every Love Has a Story.
                </p>

                <h1 className="font-editorial-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-[1.24] tracking-tight text-[#70534C] text-balance">
                  讓一生一次的幸福，值得被精緻收藏。
                </h1>

                <p className="text-sm sm:text-[15px] leading-relaxed text-[#8A6D65] max-w-md pt-0.5">
                  以法式高級訂製紙藝與古典裸粉玫瑰為靈感，上傳你們的婚紗照，一次完成專屬於你們的精品婚禮視覺套組。
                </p>
              </div>

              {/* Primary (Vintage Dusty Rose #C29B92) & Secondary (Ivory + Champagne Gold) Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onStartCreating}
                  className="min-h-[48px] rounded-lg px-7 py-3 text-sm font-medium bg-[#C29B92] hover:bg-[#B58B83] text-[#FAF3EF] shadow-[0_8px_22px_-8px_rgba(181,139,131,0.65)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>免費打造我的婚禮</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={onExploreSeries}
                  className="min-h-[48px] rounded-lg px-6 py-3 text-sm font-medium border border-[#C8AA7B] bg-[#FFFDFB] hover:bg-[#F5EAE4] text-[#70534C] transition-colors duration-200 inline-flex items-center justify-center whitespace-nowrap shrink-0"
                >
                  探索精品婚禮系列
                </button>
              </div>

              {/* Quiet Unboxed Editorial Craft Deliverables Metadata */}
              <div className="pt-4 border-t border-[#E6D7CE] space-y-1.5">
                <p className="text-xs text-[#8A6D65] leading-relaxed">
                  9:16 手機電子喜帖 · A1 婚禮迎賓海報 · 婚宴賓客桌卡 · LINE 交通提醒卡
                </p>
                <p className="text-[11px] text-[#B58B83]">
                  照片與婚禮資料全程於瀏覽器本機處理 · 兼顧精品紙藝美學與隱私安心
                </p>
              </div>
            </div>

            {/* Right ~60%: Full-Presence Editorial Fine-Art Wedding Stationery Composition */}
            <div className="relative py-2 lg:py-6">
              <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
                {/* Offset delicate champagne-gold architectural frame */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2.5 -right-2.5 sm:-top-3.5 sm:-right-3.5 bottom-4 left-4 border border-[#C8AA7B]/70 rounded-t-[200px] sm:rounded-t-[260px] rounded-b-sm"
                />

                {/* Main Classical Arch Editorial Artwork Frame */}
                <div className="relative overflow-hidden rounded-t-[200px] sm:rounded-t-[260px] rounded-b-sm border border-[#E5D5CA] bg-[#F4E9E3] stationery-shadow">
                  <div className="aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-[min(74vh,620px)] w-full overflow-hidden">
                    <img
                      src={HERO_STATIONERY_IMAGE}
                      alt="LifeTale 精品法式裸玫瑰婚禮紙藝套組、香檳金火漆印章與手工棉紙喜帖實景攝影"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>

                {/* Subtle Editorial Caption Strip */}
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] sm:text-xs text-[#8A6D65]">
                  <span className="font-editorial-serif tracking-wide text-[#70534C]">
                    Signature Collection · 皇家玫瑰花園系列美學母版
                  </span>
                  <span className="text-[#B58B83]">
                    古典裸玫瑰 · 手工棉紙紋理 · 香檳金火漆視覺
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boutique Series Showcase — 4 Curated Photography Cards */}
      <section
        id="series-gallery"
        className="border-b border-[#E8DCD3] bg-[#FFFDFB]/80"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 py-14 sm:py-20">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-10 sm:mb-12">
            <p className="text-xs tracking-[0.24em] text-[#B58B83] font-medium">
              CURATED WEDDING COLLECTIONS
            </p>
            <h2 className="font-editorial-serif text-2xl sm:text-3xl font-semibold text-[#70534C] text-balance">
              四款精品婚禮紙藝系列
            </h2>
            <AtelierBotanicalDivider />
            <p className="text-sm text-[#8A6D65] leading-relaxed">
              每一系列皆具備專屬字體配置、花卉線條與構圖語言，讓喜帖、迎賓海報、桌卡與交通提醒維持一致的高級訂製氣韻。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {THEME_ORDER.map((id) => {
              const series = THEME_CONFIGS[id];
              const isSelected = selectedThemeId === id;

              return (
                <article
                  key={id}
                  className={`group rounded-2xl border bg-[#FAF3EF]/85 overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#C29B92] ring-1 ring-[#E8D0CA] shadow-md'
                      : 'border-[#E8DCD3] hover:border-[#C8AA7B] hover:-translate-y-0.5'
                  }`}
                >
                  <div>
                    {/* Real Stationery Flat-Lay Photography (4:3) */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2E7E1]">
                      <img
                        src={series.previewImage}
                        alt={`${series.nameZh} ${series.nameEn} 精品婚禮紙藝成品攝影`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>

                    {/* Curated Series Copy */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-editorial-serif tracking-[0.16em] text-[#B58B83] font-medium">
                          {series.seriesNumber} · {series.nameEn}
                        </span>
                        {series.featured && (
                          <span className="text-[11px] text-[#C8AA7B] font-medium whitespace-nowrap shrink-0">
                            品牌主打
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-lg font-semibold text-[#70534C] ${series.typography.displayClass}`}
                      >
                        {series.nameZh}
                      </h3>

                      <p className="text-xs leading-relaxed text-[#8A6D65]">
                        {series.description}
                      </p>

                      {/* Refined palette swatches */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5" aria-hidden="true">
                          {series.swatches.map((hex, idx) => (
                            <span
                              key={idx}
                              className="h-3.5 w-3.5 rounded-full border border-[#70534C]/15"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#9E827A] truncate max-w-[140px]">
                          {series.craftNote.split('·')[0].trim()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="px-5 pb-5 pt-1">
                    <button
                      type="button"
                      onClick={() => onPickSeriesAndEnterStudio(id)}
                      className={`w-full min-h-[44px] rounded-lg border px-4 py-2 text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-colors ${
                        isSelected
                          ? 'bg-[#C29B92] hover:bg-[#B58B83] border-[#C29B92] text-[#FAF3EF]'
                          : 'bg-[#FFFDFB] border-[#DFCFC3] text-[#70534C] hover:border-[#C29B92] hover:bg-[#F5EAE4]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>目前已套用 · 進入工作室</span>
                        </>
                      ) : (
                        <>
                          <span>選擇此系列開始設計</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
