import { PreviewAssetTab } from './wedding';

export type PrintableProductId =
  | 'welcome-poster'
  | 'table-card'
  | 'printed-invite'
  | 'line-card-print';

export type PrintSides = 'single' | 'double';

export type PaperPreferenceId =
  | 'matte-cotton'
  | 'linen-textured'
  | 'pearl-shimmer';

export type FinishingPreferenceId =
  | 'standard-color'
  | 'digital-champagne-visual'
  | 'inquire-foil-emboss';

export type PrintVendorPresetId =
  | 'generic-reference'
  | 'gainhow'
  | 'blueco'
  | 'cardhome';

export interface PrintSizeOption {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  note: string;
}

export interface PrintProductOption {
  id: PrintableProductId;
  sourceAssetTab: PreviewAssetTab;
  nameZh: string;
  shortNameZh: string;
  categoryLabel: string;
  description: string;
  sizeOptions: PrintSizeOption[];
  defaultSizeId: string;
  defaultQuantity: number;
  quantityPresets: number[];
  recommendedSides: PrintSides;
  minEffectiveDpi: number;
  recommendedDpi: number;
  /** Approximate fraction of card width occupied by portrait photo */
  photoWidthFraction: number;
}

export interface ProductPrintSpec {
  productId: PrintableProductId;
  vendorId: PrintVendorPresetId;
  finishedWidthMm: number;
  finishedHeightMm: number;
  bleedMm: number;
  safeMarginMm: number;
  minEffectiveDpi: number;
  recommendedDpi: number;
  colorModeLabel: string;
  pdfFormatLabel: string;
  specialFinishingRule: string;
  verificationStatus: 'generic' | 'pending_verification';
}

export interface PaperPreferenceOption {
  id: PaperPreferenceId;
  nameZh: string;
  commonVendorNames: string;
  plainDescription: string;
  bestFor: string;
  swatchImage: string;
  effectCaption: string;
}

export interface FinishingPreferenceOption {
  id: FinishingPreferenceId;
  nameZh: string;
  plainDescription: string;
  requiresSeparatePlate: boolean;
  honestLimitation: string;
  swatchImage?: string;
  effectCaption?: string;
}

export interface PrintVendorPreset {
  id: PrintVendorPresetId;
  nameZh: string;
  tagline: string;
  verificationStatus: 'generic' | 'pending_verification';
  statusBadgeText: string;
  officialUrl?: string;
  guidelinesUrl?: string;
  inquiryHint: string;
  defaultBleedByProduct: Record<PrintableProductId, number>;
  defaultSafeMarginByProduct: Record<PrintableProductId, number>;
  disclaimer: string;
}

export interface SelectedProductItemConfig {
  enabled: boolean;
  sizeId: string;
  quantity: number;
}

export interface PrintAssistantSelection {
  vendorId: PrintVendorPresetId;
  products: Record<PrintableProductId, SelectedProductItemConfig>;
  sides: PrintSides;
  paperId: PaperPreferenceId;
  finishingId: FinishingPreferenceId;
  expectedReceiveDate: string;
  customRemarks: string;
  proofreadConfirmed: boolean;
}

export type PreflightStatus = 'pass' | 'warning' | 'manual_required';

export interface PhotoResolutionMetrics {
  loaded: boolean;
  naturalWidth: number;
  naturalHeight: number;
  worstEffectiveDpi: number;
  worstProductName: string;
  recommendedDpiForWorst: number;
}

export interface PreflightCheckItem {
  id: string;
  title: string;
  status: PreflightStatus;
  statusLabel: string;
  detail: string;
  measuredValue?: string;
}
