import { estimateCopy } from "@/config/estimateGuide";
import { percentOffToMultiplier } from "@/config/pricing";
import {
  formatYen,
  type EstimateBreakdown,
  type EstimateInput,
  type EstimateLine,
} from "@/lib/calculateEstimate";

export type BreakdownRowType =
  | "item"
  | "discount"
  | "subtotal"
  | "section-total";

export type BreakdownRow = {
  type: BreakdownRowType;
  label: string;
  unit?: number;
  qty?: number;
  amount: number;
  note?: string;
};

export type BreakdownSectionView = {
  id: string;
  title: string;
  rows: BreakdownRow[];
  total: number;
  discountAmount: number;
};

export type BreakdownView = {
  sections: BreakdownSectionView[];
  grandTotal: number;
  grandTotalBefore?: number;
  totalDiscount: number;
};

type SectionConfig = {
  id: string;
  title: string;
  categories: EstimateLine["category"][];
  seniorRate: "production" | "launch" | null;
};

function linesForCategories(
  lines: EstimateLine[],
  categories: EstimateLine["category"][],
): EstimateLine[] {
  return lines.filter((line) => categories.includes(line.category));
}

function lineToRow(line: EstimateLine): BreakdownRow {
  const isDiscount = line.subtotal < 0;
  return {
    type: isDiscount ? "discount" : "item",
    label: line.label,
    unit: line.unit,
    qty: line.qty,
    amount: line.subtotal,
    note: isDiscount ? estimateCopy.summary.designDiscountNote : undefined,
  };
}

function buildSeniorDiscountRow(
  before: number,
  after: number,
  percentOff: number,
): BreakdownRow | null {
  const discount = before - after;
  if (discount <= 0) return null;
  return {
    type: "discount",
    label: `${estimateCopy.summary.seniorDiscountLine}（${percentOff}% OFF）`,
    amount: -discount,
    note: `${formatYen(before)} → ${formatYen(after)}`,
  };
}

function buildSection(
  config: SectionConfig,
  allLines: EstimateLine[],
  input: EstimateInput,
): BreakdownSectionView | null {
  const itemLines = linesForCategories(allLines, config.categories);
  if (itemLines.length === 0) return null;

  const rows: BreakdownRow[] = itemLines.map(lineToRow);
  const subtotal = itemLines.reduce((sum, line) => sum + line.subtotal, 0);

  rows.push({
    type: "subtotal",
    label: estimateCopy.summary.sectionSubtotal,
    amount: subtotal,
  });

  let total = subtotal;
  let discountAmount = 0;

  if (input.clientType === "senior" && config.seniorRate && subtotal > 0) {
    const percentOff =
      config.seniorRate === "production"
        ? input.seniorProductionPercentOff
        : input.seniorLaunchMaintenancePercentOff;
    const multiplier = percentOffToMultiplier(percentOff);
    const after = Math.round(subtotal * multiplier);
    const discountRow = buildSeniorDiscountRow(subtotal, after, percentOff);
    if (discountRow) {
      rows.push(discountRow);
      discountAmount += subtotal - after;
      total = after;
    }
  }

  rows.push({
    type: "section-total",
    label: estimateCopy.summary.sectionTotal,
    amount: total,
  });

  return {
    id: config.id,
    title: config.title,
    rows,
    total,
    discountAmount,
  };
}

export function buildBreakdownView(
  input: EstimateInput,
  breakdown: EstimateBreakdown,
): BreakdownView {
  const { summary } = estimateCopy;
  const sectionConfigs: SectionConfig[] = [
    {
      id: "production",
      title: summary.rows.production,
      categories: ["production"],
      seniorRate: "production",
    },
    {
      id: "photos",
      title: summary.rows.photos,
      categories: ["photos"],
      seniorRate: null,
    },
    {
      id: "options",
      title: summary.rows.options,
      categories: ["options"],
      seniorRate: "production",
    },
    {
      id: "launch",
      title: summary.rows.launch,
      categories: ["launch"],
      seniorRate: "launch",
    },
    {
      id: "domain",
      title: summary.rows.domainActual,
      categories: ["domainActual"],
      seniorRate: null,
    },
    {
      id: "maintenance",
      title: summary.rows.maintenance,
      categories: ["maintenance"],
      seniorRate: "launch",
    },
  ];

  const sections = sectionConfigs
    .map((config) => buildSection(config, breakdown.lines, input))
    .filter((section): section is BreakdownSectionView => section !== null);

  const isSenior = input.clientType === "senior";
  const grandTotal = isSenior ? breakdown.totalWithSeniorDiscount : breakdown.total;

  return {
    sections,
    grandTotal,
    grandTotalBefore: isSenior ? breakdown.total : undefined,
    totalDiscount: isSenior ? breakdown.seniorDiscountAmount : 0,
  };
}
