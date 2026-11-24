import React from 'react';
import { ThemeId } from '../types/wedding';

interface ThemeFrameProps {
  themeId: ThemeId;
  borderColor: string;
  accentColor: string;
}

/** Delicate garden-rose botanical corner engraving for Royal Rose Garden */
const RoseCornerEngraving: React.FC<{
  className: string;
  gold: string;
  rose: string;
}> = ({ className, gold, rose }) => (
  <svg
    className={`h-14 w-14 ${className}`}
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
  >
    {/* Fine champagne gold stem curves */}
    <path
      d="M6 56C6 34 11 18 23 11C31 6.5 42 6 56 6"
      stroke={gold}
      strokeWidth="0.95"
      strokeLinecap="round"
      opacity="0.88"
    />
    {/* Delicate garden rose blossom */}
    <circle cx="15" cy="15" r="5.5" stroke={gold} strokeWidth="0.9" fill={rose} fillOpacity="0.22" />
    <path
      d="M12.5 15C12.5 13.4 13.8 12.4 15.2 12.6C16.7 12.8 17.6 14.2 17 15.8C16.4 17.3 14.4 17.7 13.2 16.8"
      stroke={gold}
      strokeWidth="0.85"
      strokeLinecap="round"
    />
    {/* Small rosebuds & fine botanical leaves */}
    <path
      d="M24 10.5C27 7 31 6.5 34.5 9.2C30.8 11.4 26.8 12.1 24 10.5Z"
      stroke={gold}
      strokeWidth="0.8"
      fill={rose}
      fillOpacity="0.14"
    />
    <path
      d="M10.5 24C7 27 6.5 31 9.2 34.5C11.4 30.8 12.1 26.8 10.5 24Z"
      stroke={gold}
      strokeWidth="0.8"
      fill={rose}
      fillOpacity="0.14"
    />
    <circle cx="42" cy="7.5" r="1.5" fill={gold} opacity="0.65" />
    <circle cx="7.5" cy="42" r="1.5" fill={gold} opacity="0.65" />
  </svg>
);

export const ThemeFrameDecoration: React.FC<ThemeFrameProps> = ({
  themeId,
  borderColor,
  accentColor,
}) => {
  if (themeId === 'royal-rose') {
    return (
      <div className="pointer-events-none absolute inset-2.5 z-10">
        {/* Outer fine champagne gold border + soft dusty-rose inner hairline */}
        <div
          className="h-full w-full border"
          style={{ borderColor, opacity: 0.78 }}
        />
        <div
          className="absolute inset-1.5 border"
          style={{ borderColor: accentColor, opacity: 0.35 }}
        />
        <RoseCornerEngraving
          className="absolute -top-0.5 -left-0.5"
          gold={borderColor}
          rose={accentColor}
        />
        <RoseCornerEngraving
          className="absolute -top-0.5 -right-0.5 -scale-x-100"
          gold={borderColor}
          rose={accentColor}
        />
        <RoseCornerEngraving
          className="absolute -bottom-0.5 -left-0.5 -scale-y-100"
          gold={borderColor}
          rose={accentColor}
        />
        <RoseCornerEngraving
          className="absolute -bottom-0.5 -right-0.5 -scale-x-100 -scale-y-100"
          gold={borderColor}
          rose={accentColor}
        />
      </div>
    );
  }

  if (themeId === 'french-manor') {
    const ManorCorner = ({ className }: { className: string }) => (
      <svg
        className={`h-9 w-9 ${className}`}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path d="M2 24V2H24" stroke={borderColor} strokeWidth="1.2" />
        <path
          d="M6 17C6 10 10 6 17 6"
          stroke={borderColor}
          strokeWidth="0.9"
          opacity="0.7"
        />
        <path
          d="M11 11L15 8.5M11 11L8.5 15"
          stroke={accentColor}
          strokeWidth="0.9"
          opacity="0.75"
        />
        <circle cx="11" cy="11" r="1.4" fill={accentColor} opacity="0.8" />
      </svg>
    );

    return (
      <div className="pointer-events-none absolute inset-3 z-10">
        <div
          className="h-full w-full border"
          style={{ borderColor, opacity: 0.7 }}
        />
        <ManorCorner className="absolute -top-0.5 -left-0.5" />
        <ManorCorner className="absolute -top-0.5 -right-0.5 -scale-x-100" />
        <ManorCorner className="absolute -bottom-0.5 -left-0.5 -scale-y-100" />
        <ManorCorner className="absolute -bottom-0.5 -right-0.5 -scale-x-100 -scale-y-100" />
      </div>
    );
  }

  if (themeId === 'modern-oriental') {
    const LatticeCorner = ({ className }: { className: string }) => (
      <svg
        className={`h-9 w-9 ${className}`}
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
      >
        <path d="M2 34V2H34" stroke={borderColor} strokeWidth="1.35" />
        <path d="M7 28V7H28" stroke={borderColor} strokeWidth="0.9" />
        <path
          d="M7 15H15V7"
          stroke={accentColor}
          strokeWidth="1.05"
          opacity="0.8"
        />
        <rect x="10" y="10" width="2.6" height="2.6" fill={accentColor} opacity="0.8" />
      </svg>
    );

    return (
      <div className="pointer-events-none absolute inset-2.5 z-10">
        <div
          className="h-full w-full border"
          style={{ borderColor, opacity: 0.85 }}
        />
        <div
          className="absolute inset-1.5 border"
          style={{ borderColor, opacity: 0.42 }}
        />
        <LatticeCorner className="absolute top-0 left-0" />
        <LatticeCorner className="absolute top-0 right-0 rotate-90" />
        <LatticeCorner className="absolute bottom-0 right-0 rotate-180" />
        <LatticeCorner className="absolute bottom-0 left-0 -rotate-90" />
      </div>
    );
  }

  // Korean Minimalist: gallery architectural inset rule with whisper-thin sage eucalyptus accent
  return (
    <div className="pointer-events-none absolute inset-3.5 z-10">
      <div
        className="h-full w-full border"
        style={{ borderColor, opacity: 0.85 }}
      />
      <svg
        className="absolute top-2.5 right-2.5 h-8 w-8 opacity-45"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M28 6C22 12 16 20 11 30"
          stroke={accentColor}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <ellipse
          cx="23"
          cy="14"
          rx="3.2"
          ry="1.8"
          transform="rotate(-32 23 14)"
          stroke={accentColor}
          strokeWidth="0.8"
        />
        <ellipse
          cx="17"
          cy="21"
          rx="3"
          ry="1.7"
          transform="rotate(-48 17 21)"
          stroke={accentColor}
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
};

/** Antique Champagne Gold Wax Seal Medallion (digital visual ornament) */
export const WaxSealBadge: React.FC<{
  monogram: string;
  size?: 'sm' | 'md';
  tone?: 'gold' | 'rose';
}> = ({ monogram, size = 'sm', tone = 'gold' }) => {
  const dim = size === 'md' ? 'h-11 w-11 text-[11px]' : 'h-9 w-9 text-[9px]';
  const outerBg =
    tone === 'gold'
      ? 'radial-gradient(circle at 35% 30%, #D9C39A 0%, #C5AA7C 58%, #A68A5B 100%)'
      : 'radial-gradient(circle at 35% 30%, #E0BFB5 0%, #C8A095 58%, #9D7970 100%)';

  return (
    <span
      className={`inline-flex ${dim} items-center justify-center rounded-full font-editorial-serif font-semibold tracking-wider text-[#FBF8F4] select-none shrink-0`}
      style={{
        background: outerBg,
        boxShadow:
          'inset 0 1px 2px rgba(255,255,255,0.45), inset 0 -2px 3px rgba(101,80,71,0.35), 0 4px 10px -2px rgba(101,80,71,0.28)',
        border: '1px solid rgba(251, 248, 244, 0.35)',
      }}
      aria-hidden="true"
    >
      <span className="inline-flex h-[78%] w-[78%] items-center justify-center rounded-full border border-white/35">
        {monogram}
      </span>
    </span>
  );
};

export const ThemeDividerMotif: React.FC<{
  themeId: ThemeId;
  borderColor: string;
  accentColor: string;
}> = ({ themeId, borderColor, accentColor }) => {
  if (themeId === 'royal-rose') {
    return (
      <div className="flex items-center justify-center gap-3 my-2" aria-hidden="true">
        <span className="h-px w-10" style={{ backgroundColor: borderColor, opacity: 0.7 }} />
        <svg width="20" height="14" viewBox="0 0 24 16" fill="none">
          <path
            d="M2 8C6 8 8 4 12 4C16 4 18 8 22 8C18 8 16 12 12 12C8 12 6 8 2 8Z"
            stroke={borderColor}
            strokeWidth="1"
            fill={accentColor}
            fillOpacity="0.2"
          />
          <circle cx="12" cy="8" r="2" fill={borderColor} />
        </svg>
        <span className="h-px w-10" style={{ backgroundColor: borderColor, opacity: 0.7 }} />
      </div>
    );
  }

  if (themeId === 'modern-oriental') {
    return (
      <div className="flex items-center justify-center gap-3 my-2" aria-hidden="true">
        <span className="h-px w-10" style={{ backgroundColor: borderColor }} />
        <span
          className="inline-flex h-4 w-4 items-center justify-center border text-[9px] font-oriental-serif leading-none"
          style={{
            borderColor: accentColor,
            color: accentColor,
          }}
        >
          囍
        </span>
        <span className="h-px w-10" style={{ backgroundColor: borderColor }} />
      </div>
    );
  }

  if (themeId === 'french-manor') {
    return (
      <div className="flex items-center justify-center gap-3 my-2" aria-hidden="true">
        <span className="h-px w-10" style={{ backgroundColor: borderColor, opacity: 0.65 }} />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 4C13.5 8 16 10.5 20 12C16 13.5 13.5 16 12 20C10.5 16 8 13.5 4 12C8 10.5 10.5 8 12 4Z"
            stroke={accentColor}
            strokeWidth="1.1"
            fill={borderColor}
            fillOpacity="0.18"
          />
        </svg>
        <span className="h-px w-10" style={{ backgroundColor: borderColor, opacity: 0.65 }} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2.5 my-2" aria-hidden="true">
      <span className="h-px w-8" style={{ backgroundColor: borderColor }} />
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
      <span className="h-px w-8" style={{ backgroundColor: borderColor }} />
    </div>
  );
};

/** Subtle Champagne Gold Botanical Divider for Atelier Homepage sections */
export const AtelierBotanicalDivider: React.FC = () => (
  <div className="flex items-center justify-center gap-4 my-2" aria-hidden="true">
    <span className="h-px w-14 sm:w-24 bg-[#C5AA7C]/45" />
    <svg width="26" height="14" viewBox="0 0 32 16" fill="none">
      <path
        d="M3 8C8 8 11 3 16 3C21 3 24 8 29 8C24 8 21 13 16 13C11 13 8 8 3 8Z"
        stroke="#C5AA7C"
        strokeWidth="0.9"
        fill="#E6CBC3"
        fillOpacity="0.3"
      />
      <circle cx="16" cy="8" r="2" fill="#C5AA7C" />
    </svg>
    <span className="h-px w-14 sm:w-24 bg-[#C5AA7C]/45" />
  </div>
);
