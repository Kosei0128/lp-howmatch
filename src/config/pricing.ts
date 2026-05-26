/**
 * 料金設定 — 数字を変更する場合はこのファイルのみ編集してください。
 *
 * Phase 1（2026-05）: 市場調査 Pattern A 寄り — オプション・公開・写真を圧縮。
 * ベース料金は実績作り期間のため現行維持。知人割 45% / 10% 維持。
 */

export type SiteType = "lp" | "small" | "corporate";

export type DesignQuality = "template" | "original" | "premium";

export type PhotoMaterialMode = "client" | "stock";

export type MaintenancePlan = "none" | "light" | "standard" | "full";

export type DomainTld = "co.jp" | "com";

export type OptionKey =
  | "contactForm"
  | "faq"
  | "news"
  | "english"
  | "seo"
  | "cms"
  | "multiStore"
  | "copySupport"
  | "copyPremium";

export type PricingConfig = {
  base: { corporate: number; lp: number; small: number };
  perPage: { fixed: number; business: number };
  designMultiplier: { template: number; original: number; premium: number };
  seniorDiscount: {
    /** 制作費・オプションの割引率（45 = 45% OFF → 通常の55%で請求） */
    productionPercentOff: number;
    /** 公開・保守の割引率（10 = 10% OFF） */
    launchMaintenancePercentOff: number;
    productionPercentOffRange: { min: number; max: number };
    launchMaintenancePercentOffRange: { min: number; max: number };
  };
  photos: {
    heroPerImage: number;
    contentPerImage: number;
    toneAdjust: number;
  };
  options: Record<OptionKey, number>;
  launch: {
    domainProxy: number;
    vercelSetup: number;
    launchBundle: number;
    domainActual: { "co.jp": number; com: number };
  };
  maintenance: { none: 0; light: number; standard: number; full: number };
};

export const pricing: PricingConfig = {
  base: {
    lp: 40000,
    small: 50000,
    corporate: 60000,
  },
  perPage: {
    fixed: 10000,
    business: 13000,
  },
  designMultiplier: {
    template: 0.6,
    original: 1.0,
    premium: 1.35,
  },
  seniorDiscount: {
    productionPercentOff: 45,
    launchMaintenancePercentOff: 10,
    productionPercentOffRange: { min: 0, max: 70 },
    launchMaintenancePercentOffRange: { min: 0, max: 30 },
  },
  photos: {
    heroPerImage: 3000,
    contentPerImage: 2000,
    toneAdjust: 3000,
  },
  options: {
    contactForm: 12000,
    faq: 5000,
    news: 25000,
    english: 50000,
    seo: 10000,
    cms: 35000,
    multiStore: 35000,
    copySupport: 15000,
    copyPremium: 30000,
  },
  launch: {
    domainProxy: 4000,
    vercelSetup: 12000,
    launchBundle: 15000,
    domainActual: { "co.jp": 5000, com: 2000 },
  },
  maintenance: {
    none: 0,
    light: 3000,
    standard: 7000,
    full: 12000,
  },
};

/** 割引率（% OFF）→ 請求倍率（45% OFF → 0.55） */
export function percentOffToMultiplier(percentOff: number): number {
  const clamped = Math.max(0, Math.min(100, percentOff));
  return 1 - clamped / 100;
}

export {
  designQualityLabels,
  maintenanceLabels,
  optionLabels,
  siteTypeLabels,
} from "@/config/estimateGuide";
