"use client";

import { estimateCopy } from "@/config/estimateGuide";
import { formatYen } from "@/lib/calculateEstimate";
import type { BreakdownRow, BreakdownSectionView, BreakdownView } from "@/lib/breakdownView";

function AmountCell({
  amount,
  type,
}: {
  amount: number;
  type: BreakdownRow["type"];
}) {
  const isDiscount = amount < 0 || type === "discount";
  const isEmphasis = type === "section-total" || type === "subtotal";

  return (
    <span
      className={`font-en tabular-nums ${
        isDiscount
          ? "font-medium text-emerald-700"
          : isEmphasis
            ? "font-semibold text-neutral-900"
            : "text-neutral-800"
      }`}
    >
      {isDiscount && amount > 0 ? "−" : ""}
      {formatYen(Math.abs(amount))}
    </span>
  );
}

function BreakdownRowLine({
  row,
  headers,
}: {
  row: BreakdownRow;
  headers: typeof estimateCopy.summary.breakdownHeaders;
}) {
  if (row.type === "subtotal" || row.type === "section-total") {
    return (
      <tr
        className={`${
          row.type === "section-total"
            ? "border-t-2 border-neutral-300 bg-neutral-50"
            : "border-t border-neutral-200"
        }`}
      >
        <td
          colSpan={3}
          className={`py-2.5 pr-2 text-xs ${
            row.type === "section-total" ? "font-semibold" : "font-medium text-neutral-600"
          }`}
        >
          {row.label}
        </td>
        <td className="py-2.5 text-right text-sm">
          <AmountCell amount={row.amount} type={row.type} />
        </td>
      </tr>
    );
  }

  return (
    <tr
      className={
        row.type === "discount"
          ? "bg-emerald-50/80"
          : "border-b border-neutral-100"
      }
    >
      <td className="py-2.5 pr-2 align-top">
        <p
          className={`text-xs leading-snug ${
            row.type === "discount" ? "font-medium text-emerald-800" : ""
          }`}
        >
          {row.label}
        </p>
        {row.note ? (
          <p className="mt-0.5 text-[11px] text-neutral-500">{row.note}</p>
        ) : null}
      </td>
      <td className="py-2.5 pr-2 align-top tabular-nums text-xs text-neutral-600">
        {row.unit !== undefined ? formatYen(row.unit) : "—"}
      </td>
      <td className="py-2.5 pr-2 align-top tabular-nums text-xs text-neutral-600">
        {row.qty ?? "—"}
      </td>
      <td className="py-2.5 text-right align-top text-sm">
        <AmountCell amount={row.amount} type={row.type} />
      </td>
    </tr>
  );
}

function SectionBlock({
  section,
  headers,
}: {
  section: BreakdownSectionView;
  headers: typeof estimateCopy.summary.breakdownHeaders;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-100 px-3 py-2.5 sm:px-4">
        <h3 className="text-sm font-semibold text-neutral-900">{section.title}</h3>
        {section.discountAmount > 0 ? (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
            −{formatYen(section.discountAmount)}
          </span>
        ) : null}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[480px] text-left">
          <thead>
            <tr className="border-b border-neutral-100 text-[11px] text-neutral-500">
              <th className="px-3 py-2 font-medium sm:px-4">{headers.item}</th>
              <th className="px-2 py-2 font-medium">{headers.unit}</th>
              <th className="px-2 py-2 font-medium">{headers.qty}</th>
              <th className="px-3 py-2 text-right font-medium sm:px-4">
                {headers.subtotal}
              </th>
            </tr>
          </thead>
          <tbody className="px-1">
            {section.rows.map((row, i) => (
              <BreakdownRowLine
                key={`${section.id}-${row.type}-${i}`}
                row={row}
                headers={headers}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 p-3 sm:hidden">
        {section.rows.map((row, i) => (
          <div
            key={`${section.id}-m-${i}`}
            className={`rounded-lg px-3 py-2.5 ${
              row.type === "discount"
                ? "bg-emerald-50"
                : row.type === "section-total"
                  ? "border border-neutral-300 bg-neutral-50"
                  : row.type === "subtotal"
                    ? "bg-neutral-50"
                    : "border border-neutral-100"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium leading-snug">{row.label}</p>
              <AmountCell amount={row.amount} type={row.type} />
            </div>
            {row.unit !== undefined && row.type === "item" ? (
              <p className="mt-1 text-[11px] text-neutral-500">
                {formatYen(row.unit)} × {row.qty}
              </p>
            ) : null}
            {row.note ? (
              <p className="mt-1 text-[11px] text-neutral-500">{row.note}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EstimateBreakdown({ view }: { view: BreakdownView }) {
  const { summary } = estimateCopy;

  if (view.sections.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="border-b border-neutral-200 pb-3">
        <p className="font-en text-base font-semibold tracking-wide">
          {summary.breakdownDocumentTitle}
        </p>
        <p className="mt-1 text-xs text-neutral-500">{summary.breakdownTaxNote}</p>
      </div>

      <div className="space-y-4">
        {view.sections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            headers={summary.breakdownHeaders}
          />
        ))}
      </div>

      <div className="rounded-xl border-2 border-neutral-900 bg-neutral-900 px-4 py-4 text-white">
        {view.grandTotalBefore !== undefined ? (
          <div className="mb-2 flex items-center justify-between text-sm text-neutral-300">
            <span>{summary.totalBeforeDiscount}</span>
            <span className="font-en tabular-nums line-through">
              {formatYen(view.grandTotalBefore)}
            </span>
          </div>
        ) : null}
        {view.totalDiscount > 0 ? (
          <div className="mb-2 flex items-center justify-between text-sm text-emerald-300">
            <span>{summary.youSave}</span>
            <span className="font-en tabular-nums">−{formatYen(view.totalDiscount)}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">{summary.grandTotal}</span>
          <span className="font-en text-2xl font-semibold tabular-nums">
            {formatYen(view.grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
