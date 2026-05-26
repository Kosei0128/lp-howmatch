"use client";

import { InfoPanel } from "@/components/estimate/estimate-ui";
import { howToReadSummary } from "@/config/estimateGuide";
import { percentOffToMultiplier } from "@/config/pricing";
import {
  formatYen,
  type EstimateBreakdown,
  type EstimateInput,
} from "@/lib/calculateEstimate";
import { useState } from "react";

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
      <span className="text-sm leading-snug">{label}</span>
      <span className="font-en shrink-0 text-sm tabular-nums">
        {formatYen(amount)}
      </span>
    </div>
  );
}

function BreakdownCards({
  lines,
}: {
  lines: EstimateBreakdown["lines"];
}) {
  return (
    <div className="space-y-2 lg:hidden">
      {lines.map((line, i) => (
        <div
          key={`${line.label}-${i}`}
          className="rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-3"
        >
          <p className="text-sm font-medium leading-snug">{line.label}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
            <span>
              {formatYen(line.unit)} × {line.qty}
            </span>
            <span className="font-en text-sm text-neutral-900 tabular-nums">
              {formatYen(line.subtotal)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function BreakdownTable({
  lines,
}: {
  lines: EstimateBreakdown["lines"];
}) {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full min-w-[420px] text-left text-xs">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-500">
            <th className="pb-2 pr-2 font-medium">項目</th>
            <th className="pb-2 pr-2 font-medium">単価</th>
            <th className="pb-2 pr-2 font-medium">数量</th>
            <th className="pb-2 font-medium">小計</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, i) => (
            <tr key={`${line.label}-${i}`} className="border-b border-neutral-100">
              <td className="py-2 pr-2">{line.label}</td>
              <td className="py-2 pr-2 tabular-nums">{formatYen(line.unit)}</td>
              <td className="py-2 pr-2 tabular-nums">{line.qty}</td>
              <td className="py-2 tabular-nums">{formatYen(line.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
  const [showBreakdown, setShowBreakdown] = useState(false);
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
            {isSenior ? "先輩割適用・税抜" : "合計（税抜）"}
          </p>
          {isSenior ? (
            <div className="flex items-baseline gap-2">
              <span className="font-en text-xs text-neutral-400 line-through tabular-nums">
                {formatYen(breakdown.total)}
              </span>
              <span className="font-en truncate text-xl font-semibold tabular-nums">
                {formatYen(displayTotal)}
              </span>
            </div>
          ) : (
            <p className="font-en truncate text-xl font-semibold tabular-nums">
              {formatYen(displayTotal)}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onCopyMemo}
          className="min-h-11 shrink-0 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm text-white active:bg-neutral-700"
        >
          {copyStatus === "copied" ? "コピー済" : "メモコピー"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="font-en mb-1 text-lg font-medium">見積サマリー</h2>
        <p className="mb-4 text-xs leading-relaxed text-neutral-500">
          左で選んだ内容がリアルタイムで反映されます。税抜の目安金額です。
        </p>

        <div className="divide-y divide-neutral-100">
          <SummaryRow label="制作費（初期）" amount={productionDisplay} />
          <SummaryRow label="写真・素材代行" amount={breakdown.subtotalPhotos} />
          <SummaryRow label="機能オプション" amount={optionsDisplay} />
          <SummaryRow label="公開費用（一回）" amount={launchDisplay} />
          {breakdown.domainActual > 0 && (
            <SummaryRow
              label="ドメイン実費（年）"
              amount={breakdown.domainActual}
              muted
            />
          )}
          <SummaryRow label="保守" amount={maintenanceDisplay} />
        </div>

        <div className="mt-4 border-t border-neutral-200 pt-4 sm:mt-6">
          {isSenior ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-neutral-400">
                <span className="text-sm">合計（通常）</span>
                <span className="font-en text-sm tabular-nums line-through">
                  {formatYen(breakdown.total)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-base font-medium leading-snug">
                  合計（先輩割・税抜）
                </span>
                <span className="font-en text-2xl font-semibold tabular-nums sm:text-xl">
                  {formatYen(displayTotal)}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                制作費・オプション {input.seniorProductionPercentOff}% OFF / 公開・保守{" "}
                {input.seniorLaunchMaintenancePercentOff}% OFF
              </p>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <span className="text-base font-medium">合計（税抜）</span>
              <span className="font-en text-2xl font-semibold tabular-nums sm:text-xl">
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
            {copyStatus === "copied" ? "コピーしました" : "見積メモをコピー"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="min-h-11 rounded-xl border border-neutral-300 px-5 py-2.5 text-sm transition hover:border-neutral-500"
          >
            リセット
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
        <InfoPanel title="見積の読み方" items={howToReadSummary} />
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
        <button
          type="button"
          onClick={() => setShowBreakdown((v) => !v)}
          className="flex min-h-11 w-full items-center justify-between text-sm font-medium"
          aria-expanded={showBreakdown}
        >
          内訳を見る
          <span className="text-neutral-400">{showBreakdown ? "−" : "+"}</span>
        </button>

        {showBreakdown && (
          <div className="mt-4">
            <BreakdownCards lines={breakdown.lines} />
            <BreakdownTable lines={breakdown.lines} />
          </div>
        )}
      </div>
    </div>
  );
}
