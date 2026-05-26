import {
  pricing,
  type DesignQuality,
  type DomainTld,
  type MaintenancePlan,
  type OptionKey,
  type PhotoMaterialMode,
  type SiteType,
  optionLabels,
} from "@/config/pricing";

export type ClientType = "normal" | "senior";

export type EstimateInput = {
  clientType: ClientType;
  siteType: SiteType;
  pageCount: number;
  businessPageCount: number;
  designQuality: DesignQuality;
  photoMode: PhotoMaterialMode;
  heroImageCount: number;
  contentImageCount: number;
  toneAdjust: boolean;
  options: Record<OptionKey, boolean>;
  domainProxy: boolean;
  vercelSetup: boolean;
  launchBundle: boolean;
  domainTld: DomainTld;
  maintenancePlan: MaintenancePlan;
  maintenanceMonths: number;
};

export type EstimateLine = {
  label: string;
  unit: number;
  qty: number;
  subtotal: number;
  category: "production" | "photos" | "options" | "launch" | "maintenance" | "domainActual";
};

export type EstimateBreakdown = {
  lines: EstimateLine[];
  subtotalProduction: number;
  subtotalPhotos: number;
  subtotalOptions: number;
  subtotalLaunch: number;
  domainActual: number;
  subtotalMaintenance: number;
  total: number;
  totalWithSeniorDiscount: number;
  seniorDiscountAmount: number;
};

function getBasePrice(siteType: SiteType): number {
  return pricing.base[siteType];
}

function applySeniorToProduction(amount: number, clientType: ClientType): number {
  if (clientType === "senior") {
    return Math.round(amount * pricing.seniorDiscount);
  }
  return amount;
}

function applySeniorToLaunchMaintenance(
  amount: number,
  clientType: ClientType,
): number {
  if (clientType === "senior" && pricing.seniorDiscountLaunchMaintenance < 1) {
    return Math.round(amount * pricing.seniorDiscountLaunchMaintenance);
  }
  return amount;
}

export function calculateEstimate(input: EstimateInput): EstimateBreakdown {
  const lines: EstimateLine[] = [];

  const base = getBasePrice(input.siteType);
  const designMultiplier = pricing.designMultiplier[input.designQuality];

  const fixedPages = Math.max(0, input.pageCount - 1);
  const businessPages = input.businessPageCount;

  const productionBeforeDesign =
    base + fixedPages * pricing.perPage.fixed + businessPages * pricing.perPage.business;

  const productionAfterDesign = Math.round(productionBeforeDesign * designMultiplier);

  lines.push({
    label: `ベース（${input.siteType === "lp" ? "LP" : input.siteType === "small" ? "小規模" : "中規模"}）`,
    unit: base,
    qty: 1,
    subtotal: base,
    category: "production",
  });

  if (fixedPages > 0) {
    lines.push({
      label: "固定ページ",
      unit: pricing.perPage.fixed,
      qty: fixedPages,
      subtotal: fixedPages * pricing.perPage.fixed,
      category: "production",
    });
  }

  if (businessPages > 0) {
    lines.push({
      label: "事業詳細ページ",
      unit: pricing.perPage.business,
      qty: businessPages,
      subtotal: businessPages * pricing.perPage.business,
      category: "production",
    });
  }

  if (designMultiplier !== 1) {
    const designAdjust = productionAfterDesign - productionBeforeDesign;
    const pct = Math.round((designMultiplier - 1) * 100);
    lines.push({
      label:
        designMultiplier < 1
          ? `テンプレベース割引（${Math.abs(pct)}%）`
          : `高品質デザイン加算（+${pct}%）`,
      unit: designAdjust,
      qty: 1,
      subtotal: designAdjust,
      category: "production",
    });
  }

  const subtotalProduction = productionAfterDesign;

  let subtotalPhotos = 0;
  if (input.photoMode === "stock") {
    if (input.heroImageCount > 0) {
      const sub = input.heroImageCount * pricing.photos.heroPerImage;
      lines.push({
        label: "背景・ヒーロー画像（ストック選定代行）",
        unit: pricing.photos.heroPerImage,
        qty: input.heroImageCount,
        subtotal: sub,
        category: "photos",
      });
      subtotalPhotos += sub;
    }
    if (input.contentImageCount > 0) {
      const sub = input.contentImageCount * pricing.photos.contentPerImage;
      lines.push({
        label: "事業・コンテンツ画像（ストック選定代行）",
        unit: pricing.photos.contentPerImage,
        qty: input.contentImageCount,
        subtotal: sub,
        category: "photos",
      });
      subtotalPhotos += sub;
    }
    if (input.toneAdjust) {
      lines.push({
        label: "加工・トーン合わせ",
        unit: pricing.photos.toneAdjust,
        qty: 1,
        subtotal: pricing.photos.toneAdjust,
        category: "photos",
      });
      subtotalPhotos += pricing.photos.toneAdjust;
    }
  }

  let subtotalOptions = 0;
  (Object.keys(input.options) as OptionKey[]).forEach((key) => {
    if (input.options[key]) {
      const unit = pricing.options[key];
      lines.push({
        label: optionLabels[key],
        unit,
        qty: 1,
        subtotal: unit,
        category: "options",
      });
      subtotalOptions += unit;
    }
  });

  let subtotalLaunch = 0;
  let domainActual = 0;

  if (input.launchBundle) {
    lines.push({
      label: "公開セット（ドメイン代行＋Vercel設定）",
      unit: pricing.launch.launchBundle,
      qty: 1,
      subtotal: pricing.launch.launchBundle,
      category: "launch",
    });
    subtotalLaunch = pricing.launch.launchBundle;
    domainActual = pricing.launch.domainActual[input.domainTld];
    lines.push({
      label: `ドメイン実費（.${input.domainTld} / 年）`,
      unit: domainActual,
      qty: 1,
      subtotal: domainActual,
      category: "domainActual",
    });
  } else {
    if (input.domainProxy) {
      lines.push({
        label: "ドメイン取得代行",
        unit: pricing.launch.domainProxy,
        qty: 1,
        subtotal: pricing.launch.domainProxy,
        category: "launch",
      });
      subtotalLaunch += pricing.launch.domainProxy;
      domainActual = pricing.launch.domainActual[input.domainTld];
      lines.push({
        label: `ドメイン実費（.${input.domainTld} / 年）`,
        unit: domainActual,
        qty: 1,
        subtotal: domainActual,
        category: "domainActual",
      });
    }
    if (input.vercelSetup) {
      lines.push({
        label: "Vercel公開・DNS・SSL設定",
        unit: pricing.launch.vercelSetup,
        qty: 1,
        subtotal: pricing.launch.vercelSetup,
        category: "launch",
      });
      subtotalLaunch += pricing.launch.vercelSetup;
    }
  }

  let subtotalMaintenance = 0;
  if (input.maintenancePlan !== "none") {
    const monthly = pricing.maintenance[input.maintenancePlan];
    subtotalMaintenance = monthly * input.maintenanceMonths;
    lines.push({
      label: `保守（${input.maintenancePlan === "light" ? "ライト" : input.maintenancePlan === "standard" ? "標準" : "フル"}）`,
      unit: monthly,
      qty: input.maintenanceMonths,
      subtotal: subtotalMaintenance,
      category: "maintenance",
    });
  }

  const productionDiscounted = applySeniorToProduction(subtotalProduction, input.clientType);
  const launchDiscounted = applySeniorToLaunchMaintenance(subtotalLaunch, input.clientType);
  const maintenanceDiscounted = applySeniorToLaunchMaintenance(
    subtotalMaintenance,
    input.clientType,
  );

  const total =
    subtotalProduction +
    subtotalPhotos +
    subtotalOptions +
    subtotalLaunch +
    domainActual +
    subtotalMaintenance;

  const totalWithSeniorDiscount =
    productionDiscounted +
    subtotalPhotos +
    subtotalOptions +
    launchDiscounted +
    domainActual +
    maintenanceDiscounted;

  const seniorDiscountAmount = total - totalWithSeniorDiscount;

  return {
    lines,
    subtotalProduction,
    subtotalPhotos,
    subtotalOptions,
    subtotalLaunch,
    domainActual,
    subtotalMaintenance,
    total,
    totalWithSeniorDiscount,
    seniorDiscountAmount,
  };
}

export const defaultEstimateInput: EstimateInput = {
  clientType: "normal",
  siteType: "corporate",
  pageCount: 8,
  businessPageCount: 3,
  designQuality: "original",
  photoMode: "stock",
  heroImageCount: 2,
  contentImageCount: 6,
  toneAdjust: false,
  options: {
    contactForm: false,
    faq: false,
    news: false,
    english: false,
    seo: false,
    cms: false,
    multiStore: false,
  },
  domainProxy: false,
  vercelSetup: false,
  launchBundle: false,
  domainTld: "jp",
  maintenancePlan: "standard",
  maintenanceMonths: 12,
};

export const luxeHoldingsPreset: EstimateInput = {
  ...defaultEstimateInput,
  pageCount: 10,
  businessPageCount: 6,
  designQuality: "original",
  options: {
    contactForm: true,
    faq: false,
    news: false,
    english: false,
    seo: true,
    cms: true,
    multiStore: false,
  },
};

export function formatYen(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildEstimateMemo(
  input: EstimateInput,
  breakdown: EstimateBreakdown,
): string {
  const isSenior = input.clientType === "senior";
  const displayTotal = isSenior ? breakdown.totalWithSeniorDiscount : breakdown.total;

  const lines: string[] = [
    "【Web制作 見積メモ】",
    "",
    `クライアント種別: ${isSenior ? "先輩・知人割" : "通常"}`,
    `サイト種別: ${input.siteType}`,
    `ページ数: ${input.pageCount} / 事業詳細: ${input.businessPageCount}`,
    `デザイン: ${input.designQuality}`,
    "",
    "--- 内訳 ---",
    `制作費（初期）: ${formatYen(breakdown.subtotalProduction)}`,
    `写真・素材代行: ${formatYen(breakdown.subtotalPhotos)}`,
    `機能オプション: ${formatYen(breakdown.subtotalOptions)}`,
    `公開費用: ${formatYen(breakdown.subtotalLaunch)}`,
  ];

  if (breakdown.domainActual > 0) {
    lines.push(`ドメイン実費（年）: ${formatYen(breakdown.domainActual)}`);
  }

  lines.push(`保守: ${formatYen(breakdown.subtotalMaintenance)}`);
  lines.push("");

  if (isSenior) {
    lines.push(`合計（通常）: ${formatYen(breakdown.total)}`);
    lines.push(`先輩割適用後: ${formatYen(displayTotal)}`);
  } else {
    lines.push(`合計（税抜）: ${formatYen(displayTotal)}`);
  }

  lines.push("");
  lines.push("※ 表示価格は目安です。正式見積はヒアリング後に確定します。");

  return lines.join("\n");
}
