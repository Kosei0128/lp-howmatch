"use client";

import { pricing } from "@/config/pricing";
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
      className={`flex items-center justify-between py-2 ${muted ? "text-neutral-500" : ""}`}
    >
      <span className="text-sm">{label}</span>
      <span className="font-en text-sm tabular-nums">{formatYen(amount)}</span>
    </div>
  );
}

export function EstimateSummary({
  input,
  breakdown,
  onCopyMemo,
  onReset,
  copyStatus,
}: EstimateSummaryProps) {
  const [showBreakdown, setShowBreakdown] = useState(true);
  const isSenior = input.clientType === "senior";
  const displayTotal = isSenior
    ? breakdown.totalWithSeniorDiscount
    : breakdown.total;

  const productionDisplay = isSenior
    ? Math.round(breakdown.subtotalProduction * pricing.seniorDiscount)
    : breakdown.subtotalProduction;

  const launchDisplay = isSenior
    ? Math.round(
        breakdown.subtotalLaunch * pricing.seniorDiscountLaunchMaintenance,
      )
    : breakdown.subtotalLaunch;

  const maintenanceDisplay = isSenior
    ? Math.round(
        breakdown.subtotalMaintenance * pricing.seniorDiscountLaunchMaintenance,
      )
    : breakdown.subtotalMaintenance;

  return (
    <div className="sticky top-6 space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="font-en mb-4 text-lg font-medium">見積サマリー</h2>

        <div className="divide-y divide-neutral-100">
          <SummaryRow label="制作費（初期）" amount={productionDisplay} />
          <SummaryRow label="写真・素材代行" amount={breakdown.subtotalPhotos} />
          <SummaryRow
            label="機能オプション"
            amount={breakdown.subtotalOptions}
          />
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

        <div className="mt-6 border-t border-neutral-200 pt-4">
          {isSenior ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-sm">合計（通常）</span>
                <span className="font-en text-sm tabular-nums line-through">
                  {formatYen(breakdown.total)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">
                  合計（先輩割適用・税抜）
                </span>
                <span className="font-en text-xl font-semibold tabular-nums">
                  {formatYen(displayTotal)}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                制作費 ×{pricing.seniorDiscount} / 公開・保守 ×
                {pricing.seniorDiscountLaunchMaintenance}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-base font-medium">合計（税抜）</span>
              <span className="font-en text-xl font-semibold tabular-nums">
                {formatYen(displayTotal)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCopyMemo}
            className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white transition hover:bg-neutral-700"
          >
            {copyStatus === "copied" ? "コピーしました" : "見積メモをコピー"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm transition hover:border-neutral-500"
          >
            リセット
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <button
          type="button"
          onClick={() => setShowBreakdown((v) => !v)}
          className="flex w-full items-center justify-between text-sm font-medium"
          aria-expanded={showBreakdown}
        >
          内訳を見る
          <span className="text-neutral-400">{showBreakdown ? "−" : "+"}</span>
        </button>

        {showBreakdown && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="pb-2 pr-2 font-medium">項目</th>
                  <th className="pb-2 pr-2 font-medium">単価</th>
                  <th className="pb-2 pr-2 font-medium">数量</th>
                  <th className="pb-2 font-medium">小計</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.lines.map((line, i) => (
                  <tr key={`${line.label}-${i}`} className="border-b border-neutral-100">
                    <td className="py-2 pr-2">{line.label}</td>
                    <td className="py-2 pr-2 tabular-nums">
                      {formatYen(line.unit)}
                    </td>
                    <td className="py-2 pr-2 tabular-nums">{line.qty}</td>
                    <td className="py-2 tabular-nums">
                      {formatYen(line.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
