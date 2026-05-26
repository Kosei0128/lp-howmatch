"use client";

import { estimateCopy } from "@/config/estimateGuide";
import { formatYen } from "@/lib/calculateEstimate";
import type { BreakdownRow, BreakdownSectionView, BreakdownView } from "@/lib/breakdownView";

function AmountCell({
  amount,
  type,
  size = "sm",
  inverted = false,
}: {
  amount: number;
  type: BreakdownRow["type"];
  size?: "sm" | "lg";
  inverted?: boolean;
}) {
  const isDiscount = amount < 0 || type === "discount";
  const isEmphasis = type === "section-total" || type === "subtotal";

  return (
    <span
      className={`inline-block whitespace-nowrap font-en tabular-nums ${
        size === "lg" ? "text-xl font-semibold sm:text-2xl" : "text-xs sm:text-sm"
      } ${
        inverted
          ? "font-semibold text-white"
          : isDiscount
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
          className={`px-3 py-2.5 text-xs sm:px-4 ${
            row.type === "section-total" ? "font-semibold" : "font-medium text-neutral-600"
          }`}
        >
          {row.label}
        </td>
        <td className="px-3 py-2.5 text-right sm:px-4">
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
      <td className="min-w-0 px-3 py-2.5 align-top sm:px-4">
        <p
          className={`break-words text-xs leading-snug ${
            row.type === "discount" ? "font-medium text-emerald-800" : ""
          }`}
        >
          {row.label}
        </p>
        {row.note ? (
          <p className="mt-0.5 break-words text-[11px] leading-relaxed text-neutral-500">
            {row.note}
          </p>
        ) : null}
      </td>
      <td className="px-2 py-2.5 align-top whitespace-nowrap tabular-nums text-[11px] text-neutral-600 sm:text-xs">
        {row.unit !== undefined ? formatYen(row.unit) : "—"}
      </td>
      <td className="px-2 py-2.5 align-top text-center tabular-nums text-[11px] text-neutral-600 sm:text-xs">
        {row.qty ?? "—"}
      </td>
      <td className="px-3 py-2.5 text-right align-top sm:px-4">
        <AmountCell amount={row.amount} type={row.type} />
      </td>
    </tr>
  );
}

function BreakdownRowCard({ row }: { row: BreakdownRow }) {
  const isSummaryRow = row.type === "subtotal" || row.type === "section-total";

  return (
    <div
      className={`rounded-lg px-3 py-2.5 sm:px-4 ${
        row.type === "discount"
          ? "bg-emerald-50"
          : row.type === "section-total"
            ? "border border-neutral-300 bg-neutral-50"
            : row.type === "subtotal"
              ? "bg-neutral-50"
              : "border border-neutral-100 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={`min-w-0 flex-1 break-words text-xs leading-snug ${
            isSummaryRow ? "font-semibold" : "font-medium"
          } ${row.type === "discount" ? "text-emerald-800" : ""}`}
        >
          {row.label}
        </p>
        <div className="shrink-0 text-right">
          <AmountCell amount={row.amount} type={row.type} />
        </div>
      </div>
      {row.unit !== undefined && row.type === "item" ? (
        <p className="mt-1.5 text-[11px] text-neutral-500">
          {formatYen(row.unit)} × {row.qty}
        </p>
      ) : null}
      {row.note ? (
        <p className="mt-1 break-words text-[11px] leading-relaxed text-neutral-500">
          {row.note}
        </p>
      ) : null}
    </div>
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
    <div className="rounded-xl border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 rounded-t-xl border-b border-neutral-200 bg-neutral-100 px-3 py-2.5 sm:px-4">
        <h3 className="min-w-0 text-sm font-semibold leading-snug text-neutral-900">
          {section.title}
        </h3>
        {section.discountAmount > 0 ? (
          <span className="shrink-0 whitespace-nowrap rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800">
            −{formatYen(section.discountAmount)}
          </span>
        ) : null}
      </div>

      <div className="hidden min-w-0 lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-0 table-fixed text-left">
            <colgroup>
              <col />
              <col className="w-[24%]" />
              <col className="w-[10%]" />
              <col className="w-[28%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-neutral-100 text-[11px] text-neutral-500">
                <th className="px-3 py-2 font-medium sm:px-4">{headers.item}</th>
                <th className="px-2 py-2 font-medium">{headers.unit}</th>
                <th className="px-2 py-2 text-center font-medium">{headers.qty}</th>
                <th className="px-3 py-2 text-right font-medium sm:px-4">
                  {headers.subtotal}
                </th>
              </tr>
            </thead>
            <tbody>
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
      </div>

      <div className="space-y-2 p-3 lg:hidden">
        {section.rows.map((row, i) => (
          <BreakdownRowCard key={`${section.id}-m-${i}`} row={row} />
        ))}
      </div>
    </div>
  );
}

export function EstimateBreakdown({ view }: { view: BreakdownView }) {
  const { summary } = estimateCopy;

  if (view.sections.length === 0) return null;

  return (
    <div className="min-w-0 space-y-4">
      <div className="border-b border-neutral-200 pb-3">
        <p className="text-base font-semibold tracking-wide text-neutral-900">
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
          <div className="mb-2 flex items-center justify-between gap-3 text-sm text-neutral-300">
            <span className="min-w-0 shrink">{summary.totalBeforeDiscount}</span>
            <span className="shrink-0 whitespace-nowrap font-en tabular-nums line-through">
              {formatYen(view.grandTotalBefore)}
            </span>
          </div>
        ) : null}
        {view.totalDiscount > 0 ? (
          <div className="mb-2 flex items-center justify-between gap-3 text-sm text-emerald-300">
            <span className="min-w-0 shrink">{summary.youSave}</span>
            <span className="shrink-0 whitespace-nowrap font-en tabular-nums">
              −{formatYen(view.totalDiscount)}
            </span>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 text-sm font-medium">{summary.grandTotal}</span>
          <AmountCell
            amount={view.grandTotal}
            type="section-total"
            size="lg"
            inverted
          />
        </div>
      </div>
    </div>
  );
}
