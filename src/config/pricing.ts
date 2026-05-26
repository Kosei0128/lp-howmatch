/**
 * 料金設定 — 数字を変更する場合はこのファイルのみ編集してください。
 *
 * カスタマイズ例:
 * - base: サイト種別ごとのベース制作費（トップ＋共通ヘッダ/footer）
 * - perPage: 固定ページ・事業詳細ページの単価
 * - designMultiplier: デザイン品質による制作費倍率
 * - seniorDiscount.productionPercentOff: 制作費・オプションの割引率（45 = 45% OFF）
 * - seniorDiscount.launchMaintenancePercentOff: 公開・保守の割引率（10 = 10% OFF）
 * - photos / options / launch / maintenance: 各オプション単価
 */

export type SiteType = "lp" | "small" | "corporate";

export type DesignQuality = "template" | "original" | "premium";

export type PhotoMaterialMode = "client" | "stock";

export type MaintenancePlan = "none" | "light" | "standard" | "full";

export type DomainTld = "jp" | "com";

export type OptionKey =
  | "contactForm"
  | "faq"
  | "news"
  | "english"
  | "seo"
  | "cms"
  | "multiStore";

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
    domainActual: { jp: number; com: number };
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
    business: 12000,
  },
  designMultiplier: {
    template: 0.6,
    original: 1.0,
    premium: 1.3,
  },
  seniorDiscount: {
    productionPercentOff: 45,
    launchMaintenancePercentOff: 10,
    productionPercentOffRange: { min: 0, max: 70 },
    launchMaintenancePercentOffRange: { min: 0, max: 30 },
  },
  photos: {
    heroPerImage: 5000,
    contentPerImage: 3000,
    toneAdjust: 5000,
  },
  options: {
    contactForm: 20000,
    faq: 15000,
    news: 30000,
    english: 80000,
    seo: 15000,
    cms: 50000,
    multiStore: 80000,
  },
  launch: {
    domainProxy: 8000,
    vercelSetup: 15000,
    launchBundle: 20000,
    domainActual: { jp: 3500, com: 2000 },
  },
  maintenance: {
    none: 0,
    light: 3000,
    standard: 8000,
    full: 12000,
  },
};

export const optionLabels: Record<OptionKey, string> = {
  contactForm: "お問い合わせフォーム",
  faq: "FAQ",
  news: "ニュース / お知らせ",
  english: "英語版",
  seo: "SEO基本設定",
  cms: "管理画面（簡易CMS）",
  multiStore: "サブドメイン / 多店舗",
};

export const siteTypeLabels: Record<SiteType, string> = {
  lp: "シンプルLP",
  small: "小規模コーポレート",
  corporate: "中規模コーポレート",
};

export const designQualityLabels: Record<DesignQuality, string> = {
  template: "テンプレベース",
  original: "オリジナル",
  premium: "高品質",
};

export const maintenanceLabels: Record<Exclude<MaintenancePlan, "none">, string> =
  {
    light: "ライト",
    standard: "標準",
    full: "フル",
  };

/** 割引率（% OFF）→ 請求倍率（45% OFF → 0.55） */
export function percentOffToMultiplier(percentOff: number): number {
  const clamped = Math.max(0, Math.min(100, percentOff));
  return 1 - clamped / 100;
}
