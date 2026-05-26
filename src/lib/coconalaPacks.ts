import type { PricingConfig } from "@/config/pricing";
import { pricing } from "@/config/pricing";
import {
  createEmptyEstimateInput,
  type EstimateInput,
} from "@/lib/calculateEstimate";

export type CoconalaPackId =
  | "templateLp"
  | "hpLight"
  | "originalCorporate"
  | "cmsSite"
  | "premiumLp";

const allOptionsOff = {
  contactForm: false,
  faq: false,
  news: false,
  english: false,
  seo: false,
  cms: false,
  multiStore: false,
  copySupport: false,
  copyPremium: false,
} as const;

export function createCoconalaPackPreset(
  packId: CoconalaPackId,
  config: PricingConfig = pricing,
): EstimateInput {
  const base = createEmptyEstimateInput(config);

  switch (packId) {
    case "templateLp":
      return {
        ...base,
        siteType: "lp",
        pageCount: 1,
        businessPageCount: 0,
        designQuality: "template",
        photoMode: "client",
        options: { ...allOptionsOff, seo: true },
      };
    case "hpLight":
      return {
        ...base,
        siteType: "small",
        pageCount: 5,
        businessPageCount: 0,
        designQuality: "template",
        photoMode: "client",
        options: { ...allOptionsOff, contactForm: true, seo: true },
      };
    case "originalCorporate":
      return {
        ...base,
        siteType: "small",
        pageCount: 6,
        businessPageCount: 2,
        designQuality: "original",
        photoMode: "stock",
        heroImageCount: 2,
        contentImageCount: 2,
        options: { ...allOptionsOff, contactForm: true, seo: true },
      };
    case "cmsSite":
      return {
        ...base,
        siteType: "small",
        pageCount: 6,
        businessPageCount: 2,
        designQuality: "original",
        photoMode: "client",
        options: {
          ...allOptionsOff,
          contactForm: true,
          seo: true,
          cms: true,
        },
      };
    case "premiumLp":
      return {
        ...base,
        siteType: "lp",
        pageCount: 1,
        businessPageCount: 0,
        designQuality: "premium",
        photoMode: "stock",
        heroImageCount: 2,
        contentImageCount: 0,
        options: { ...allOptionsOff, contactForm: true, seo: true },
      };
  }
}

export const coconalaPackIds: CoconalaPackId[] = [
  "templateLp",
  "hpLight",
  "originalCorporate",
  "cmsSite",
  "premiumLp",
];
