"use client";

import { EstimateBreakdown as EstimateBreakdownPanel } from "@/components/estimate/EstimateBreakdown";
import { InfoPanel } from "@/components/estimate/estimate-ui";
import {
  estimateCopy,
  seniorDiscountSummary,
} from "@/config/estimateGuide";
import { percentOffToMultiplier } from "@/config/pricing";
import {
  formatYen,
  type EstimateBreakdown,
  type EstimateInput,
} from "@/lib/calculateEstimate";
import { buildBreakdownView } from "@/lib/breakdownView";
import { useMemo, useState } from "react";

type EstimateSummaryProps = {
  input: EstimateInput;
  breakdown: EstimateBreakdown;
  onCopyMemo: () => void;
  onReset: () => void;
  copyStatus: "idle" | "copied";
  variant?: "full" | "compact";
};

function SummaryRow({
  label,
  amount,
  muted,
}: {
  label: string;
  amount: number;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-3 py-2.5 ${muted ? "text-neutral-500" : ""}`}
    >
      <span className="min-w-0 flex-1 text-sm leading-snug">{label}</span>
      <span className="shrink-0 whitespace-nowrap font-en text-sm tabular-nums">
        {formatYen(amount)}
      </span>
    </div>
  );
}

export function EstimateSummary({
  input,
  breakdown,
  onCopyMemo,
  onReset,
  copyStatus,
  variant = "full",
}: EstimateSummaryProps) {
  const [showBreakdown, setShowBreakdown] = useState(true);
  const { summary } = estimateCopy;
  const breakdownView = useMemo(
    () => buildBreakdownView(input, breakdown),
    [input, breakdown],
  );
  const isSenior = input.clientType === "senior";
  const displayTotal = isSenior
    ? breakdown.totalWithSeniorDiscount
    : breakdown.total;

  const productionDisplay = isSenior
    ? Math.round(
        breakdown.subtotalProduction *
          percentOffToMultiplier(input.seniorProductionPercentOff),
      )
    : breakdown.subtotalProduction;

  const launchMaintenanceMultiplier = isSenior
    ? percentOffToMultiplier(input.seniorLaunchMaintenancePercentOff)
    : 1;

  const launchDisplay = isSenior
    ? Math.round(breakdown.subtotalLaunch * launchMaintenanceMultiplier)
    : breakdown.subtotalLaunch;

  const maintenanceDisplay = isSenior
    ? Math.round(breakdown.subtotalMaintenance * launchMaintenanceMultiplier)
    : breakdown.subtotalMaintenance;

  const optionsDisplay = isSenior
    ? Math.round(
        breakdown.subtotalOptions *
          percentOffToMultiplier(input.seniorProductionPercentOff),
      )
    : breakdown.subtotalOptions;

  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-neutral-500">
            {isSenior ? summary.totalCompactSenior : summary.totalCompactNormal}
          </p>
          {isSenior ? (
            <div className="flex items-baseline gap-2">
              <span className="font-en text-xs text-neutral-400 line-through tabular-nums">
                {formatYen(breakdown.total)}
              </span>
              <span className="font-en shrink-0 whitespace-nowrap text-xl font-semibold tabular-nums">
                {formatYen(displayTotal)}
              </span>
            </div>
          ) : (
            <p className="font-en shrink-0 whitespace-nowrap text-xl font-semibold tabular-nums">
              {formatYen(displayTotal)}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onCopyMemo}
          className="min-h-11 shrink-0 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm text-white active:bg-neutral-700"
        >
          {copyStatus === "copied"
            ? summary.copyMemoCompactDone
            : summary.copyMemoCompact}
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-4 lg:space-y-6">
      <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="font-en mb-1 text-lg font-medium">{summary.title}</h2>
        <p className="mb-4 text-xs leading-relaxed text-neutral-500">
          {summary.intro}
        </p>

        <div className="divide-y divide-neutral-100">
          <SummaryRow label={summary.rows.production} amount={productionDisplay} />
          <SummaryRow label={summary.rows.photos} amount={breakdown.subtotalPhotos} />
          <SummaryRow label={summary.rows.options} amount={optionsDisplay} />
          <SummaryRow label={summary.rows.launch} amount={launchDisplay} />
          {breakdown.domainActual > 0 && (
            <SummaryRow
              label={summary.rows.domainActual}
              amount={breakdown.domainActual}
              muted
            />
          )}
          <SummaryRow label={summary.rows.maintenance} amount={maintenanceDisplay} />
        </div>

        <div className="mt-4 border-t border-neutral-200 pt-4 sm:mt-6">
          {isSenior ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-neutral-400">
                <span className="text-sm">{summary.totalBeforeDiscount}</span>
                <span className="font-en text-sm tabular-nums line-through">
                  {formatYen(breakdown.total)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-base font-medium leading-snug">
                  {summary.totalSenior}
                </span>
                <span className="font-en shrink-0 whitespace-nowrap text-2xl font-semibold tabular-nums sm:text-xl">
                  {formatYen(displayTotal)}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                {seniorDiscountSummary(
                  input.seniorProductionPercentOff,
                  input.seniorLaunchMaintenancePercentOff,
                )}
              </p>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <span className="text-base font-medium">{summary.totalNormal}</span>
              <span className="font-en shrink-0 whitespace-nowrap text-2xl font-semibold tabular-nums sm:text-xl">
                {formatYen(displayTotal)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-5 hidden gap-2 sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={onCopyMemo}
            className="min-h-11 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm text-white transition hover:bg-neutral-700"
          >
            {copyStatus === "copied" ? summary.copyMemoDone : summary.copyMemo}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="min-h-11 rounded-xl border border-neutral-300 px-5 py-2.5 text-sm transition hover:border-neutral-500"
          >
            {summary.reset}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
        <InfoPanel title={summary.howToReadTitle} items={summary.howToReadItems} />
      </div>

      <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
        <button
          type="button"
          onClick={() => setShowBreakdown((v) => !v)}
          className="flex min-h-11 w-full items-center justify-between gap-3 text-sm font-medium"
          aria-expanded={showBreakdown}
        >
          <span className="min-w-0 text-left">{summary.breakdownToggle}</span>
          <span className="shrink-0 text-neutral-400">{showBreakdown ? "−" : "+"}</span>
        </button>

        {showBreakdown && (
          <div className="mt-4 min-w-0">
            <EstimateBreakdownPanel view={breakdownView} />
          </div>
        )}
      </div>
    </div>
  );
}
