import { pricing, type PricingConfig } from "@/config/pricing";

const STORAGE_KEY = "estimate-pricing-config";

export function clonePricingConfig(config: PricingConfig = pricing): PricingConfig {
  return structuredClone(config);
}

export function loadPricingConfig(): PricingConfig {
  const base = clonePricingConfig();
  if (typeof window === "undefined") {
    return base;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Partial<PricingConfig>;
    return {
      ...base,
      ...saved,
      base: { ...base.base, ...saved.base },
      perPage: { ...base.perPage, ...saved.perPage },
      designMultiplier: { ...base.designMultiplier, ...saved.designMultiplier },
      seniorDiscount: { ...base.seniorDiscount, ...saved.seniorDiscount },
      photos: { ...base.photos, ...saved.photos },
      options: { ...base.options, ...saved.options },
      launch: {
        ...base.launch,
        ...saved.launch,
        domainActual: {
          ...base.launch.domainActual,
          ...saved.launch?.domainActual,
        },
      },
      maintenance: { ...base.maintenance, ...saved.maintenance },
    };
  } catch {
    return base;
  }
}

export function savePricingConfig(config: PricingConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearPricingConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
}
