import {
  baseSiteLabel,
  designAdjustLabel,
  domainActualBreakdownLabel,
  estimateCopy,
  maintenanceBreakdownLabel,
  seniorDiscountSummary,
  siteTypeLabels,
} from "@/config/estimateGuide";
import {
  percentOffToMultiplier,
  pricing,
  type DesignQuality,
  type DomainTld,
  type MaintenancePlan,
  type OptionKey,
  type PhotoMaterialMode,
  type PricingConfig,
  type SiteType,
  optionLabels,
} from "@/config/pricing";

export type ClientType = "normal" | "senior";

export type EstimateInput = {
  clientType: ClientType;
  /** 制作費・オプションの割引率（% OFF）。先輩割選択時のみ有効 */
  seniorProductionPercentOff: number;
  /** 公開・保守の割引率（% OFF）。先輩割選択時のみ有効 */
  seniorLaunchMaintenancePercentOff: number;
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

function getBasePrice(siteType: SiteType, config: PricingConfig): number {
  return config.base[siteType];
}

function applySeniorToProduction(amount: number, input: EstimateInput): number {
  if (input.clientType === "senior") {
    return Math.round(
      amount * percentOffToMultiplier(input.seniorProductionPercentOff),
    );
  }
  return amount;
}

/** 制作費と同率でオプションにも先輩割を適用 */
function applySeniorToOptions(amount: number, input: EstimateInput): number {
  return applySeniorToProduction(amount, input);
}

function applySeniorToLaunchMaintenance(
  amount: number,
  input: EstimateInput,
): number {
  if (input.clientType === "senior") {
    const multiplier = percentOffToMultiplier(
      input.seniorLaunchMaintenancePercentOff,
    );
    if (multiplier < 1) {
      return Math.round(amount * multiplier);
    }
  }
  return amount;
}

export function calculateEstimate(
  input: EstimateInput,
  config: PricingConfig = pricing,
): EstimateBreakdown {
  const lines: EstimateLine[] = [];

  const base = getBasePrice(input.siteType, config);
  const designMultiplier = config.designMultiplier[input.designQuality];

  const fixedPages = Math.max(0, input.pageCount - 1);
  const businessPages = input.businessPageCount;

  const productionBeforeDesign =
    base + fixedPages * config.perPage.fixed + businessPages * config.perPage.business;

  const productionAfterDesign = Math.round(productionBeforeDesign * designMultiplier);

  lines.push({
    label: baseSiteLabel(input.siteType),
    unit: base,
    qty: 1,
    subtotal: base,
    category: "production",
  });

  if (fixedPages > 0) {
    lines.push({
      label: estimateCopy.breakdown.fixedPage,
      unit: config.perPage.fixed,
      qty: fixedPages,
      subtotal: fixedPages * config.perPage.fixed,
      category: "production",
    });
  }

  if (businessPages > 0) {
    lines.push({
      label: estimateCopy.breakdown.businessPage,
      unit: config.perPage.business,
      qty: businessPages,
      subtotal: businessPages * config.perPage.business,
      category: "production",
    });
  }

  if (designMultiplier !== 1) {
    const designAdjust = productionAfterDesign - productionBeforeDesign;
    lines.push({
      label: designAdjustLabel(designMultiplier),
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
      const sub = input.heroImageCount * config.photos.heroPerImage;
      lines.push({
        label: estimateCopy.breakdown.heroStock,
        unit: config.photos.heroPerImage,
        qty: input.heroImageCount,
        subtotal: sub,
        category: "photos",
      });
      subtotalPhotos += sub;
    }
    if (input.contentImageCount > 0) {
      const sub = input.contentImageCount * config.photos.contentPerImage;
      lines.push({
        label: estimateCopy.breakdown.contentStock,
        unit: config.photos.contentPerImage,
        qty: input.contentImageCount,
        subtotal: sub,
        category: "photos",
      });
      subtotalPhotos += sub;
    }
    if (input.toneAdjust) {
      lines.push({
        label: estimateCopy.breakdown.toneAdjust,
        unit: config.photos.toneAdjust,
        qty: 1,
        subtotal: config.photos.toneAdjust,
        category: "photos",
      });
      subtotalPhotos += config.photos.toneAdjust;
    }
  }

  let subtotalOptions = 0;
  (Object.keys(input.options) as OptionKey[]).forEach((key) => {
    if (input.options[key]) {
      const unit = config.options[key];
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
      label: estimateCopy.breakdown.launchBundle,
      unit: config.launch.launchBundle,
      qty: 1,
      subtotal: config.launch.launchBundle,
      category: "launch",
    });
    subtotalLaunch = config.launch.launchBundle;
    domainActual = config.launch.domainActual[input.domainTld];
    lines.push({
      label: domainActualBreakdownLabel(input.domainTld),
      unit: domainActual,
      qty: 1,
      subtotal: domainActual,
      category: "domainActual",
    });
  } else {
    if (input.domainProxy) {
      lines.push({
        label: estimateCopy.breakdown.domainProxy,
        unit: config.launch.domainProxy,
        qty: 1,
        subtotal: config.launch.domainProxy,
        category: "launch",
      });
      subtotalLaunch += config.launch.domainProxy;
      domainActual = config.launch.domainActual[input.domainTld];
      lines.push({
        label: domainActualBreakdownLabel(input.domainTld),
        unit: domainActual,
        qty: 1,
        subtotal: domainActual,
        category: "domainActual",
      });
    }
    if (input.vercelSetup) {
      lines.push({
        label: estimateCopy.breakdown.vercelSetup,
        unit: config.launch.vercelSetup,
        qty: 1,
        subtotal: config.launch.vercelSetup,
        category: "launch",
      });
      subtotalLaunch += config.launch.vercelSetup;
    }
  }

  let subtotalMaintenance = 0;
  if (input.maintenancePlan !== "none") {
    const monthly = config.maintenance[input.maintenancePlan];
    subtotalMaintenance = monthly * input.maintenanceMonths;
    lines.push({
      label: maintenanceBreakdownLabel(input.maintenancePlan),
      unit: monthly,
      qty: input.maintenanceMonths,
      subtotal: subtotalMaintenance,
      category: "maintenance",
    });
  }

  const productionDiscounted = applySeniorToProduction(subtotalProduction, input);
  const optionsDiscounted = applySeniorToOptions(subtotalOptions, input);
  const launchDiscounted = applySeniorToLaunchMaintenance(subtotalLaunch, input);
  const maintenanceDiscounted = applySeniorToLaunchMaintenance(
    subtotalMaintenance,
    input,
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
    optionsDiscounted +
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

export function createDefaultEstimateInput(
  config: PricingConfig = pricing,
): EstimateInput {
  return {
    clientType: "normal",
    seniorProductionPercentOff: config.seniorDiscount.productionPercentOff,
    seniorLaunchMaintenancePercentOff:
      config.seniorDiscount.launchMaintenancePercentOff,
    siteType: "small",
    pageCount: 5,
    businessPageCount: 2,
    designQuality: "original",
    photoMode: "stock",
    heroImageCount: 2,
    contentImageCount: 4,
    toneAdjust: false,
    options: {
      contactForm: true,
      faq: false,
      news: false,
      english: false,
      seo: true,
      cms: false,
      multiStore: false,
    },
    domainProxy: false,
    vercelSetup: false,
    launchBundle: false,
    domainTld: "jp",
    maintenancePlan: "none",
    maintenanceMonths: 12,
  };
}

export function createLuxeHoldingsPreset(
  config: PricingConfig = pricing,
): EstimateInput {
  return {
    ...createDefaultEstimateInput(config),
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
}

export const defaultEstimateInput = createDefaultEstimateInput();
export const luxeHoldingsPreset = createLuxeHoldingsPreset();

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
    estimateCopy.memo.title,
    "",
    `クライアント種別: ${isSenior ? estimateCopy.memo.clientSenior : estimateCopy.memo.clientNormal}`,
  ];

  if (isSenior) {
    lines.push(
      `先輩割: ${seniorDiscountSummary(input.seniorProductionPercentOff, input.seniorLaunchMaintenancePercentOff)}`,
    );
  }

  lines.push(
    `サイト種別: ${siteTypeLabels[input.siteType]}`,
    `ページ数: ${input.pageCount} / 事業詳細: ${input.businessPageCount}`,
    `デザイン: ${input.designQuality}`,
    "",
    estimateCopy.memo.sections.breakdown,
    `${estimateCopy.summary.rows.production}: ${formatYen(breakdown.subtotalProduction)}`,
    `${estimateCopy.summary.rows.photos}: ${formatYen(breakdown.subtotalPhotos)}`,
    `${estimateCopy.summary.rows.options}: ${formatYen(breakdown.subtotalOptions)}`,
    `${estimateCopy.summary.rows.launch}: ${formatYen(breakdown.subtotalLaunch)}`,
  );

  if (breakdown.domainActual > 0) {
    lines.push(
      `${estimateCopy.summary.rows.domainActual}: ${formatYen(breakdown.domainActual)}`,
    );
  }

  lines.push(
    `${estimateCopy.summary.rows.maintenance}: ${formatYen(breakdown.subtotalMaintenance)}`,
  );
  lines.push("");

  if (isSenior) {
    lines.push(`${estimateCopy.summary.totalBeforeDiscount}: ${formatYen(breakdown.total)}`);
    lines.push(`${estimateCopy.memo.seniorApplied}: ${formatYen(displayTotal)}`);
  } else {
    lines.push(`${estimateCopy.summary.totalNormal}: ${formatYen(displayTotal)}`);
  }

  lines.push("");
  lines.push(estimateCopy.memo.disclaimer);

  return lines.join("\n");
}
