"use client";

import { CheckboxRow } from "@/components/estimate/estimate-ui";
import {
  addonPriceLabel,
  contentGuide,
  estimateCopy,
  optionGuide,
} from "@/config/estimateGuide";
import type { OptionKey, PricingConfig } from "@/config/pricing";
import type { EstimateInput } from "@/lib/calculateEstimate";

const copyOptionKeys = ["copySupport", "copyPremium"] as const satisfies readonly OptionKey[];

type ContentWorkflowSectionProps = {
  input: EstimateInput;
  pricingConfig: PricingConfig;
  onToggleCopyOption: (key: (typeof copyOptionKeys)[number]) => void;
};

export function ContentWorkflowSection({
  input,
  pricingConfig,
  onToggleCopyOption,
}: ContentWorkflowSectionProps) {
  const { content } = estimateCopy;
  const { sections } = estimateCopy;

  return (
    <section className="space-y-4 border-b border-neutral-200 pb-6 sm:pb-8">
      <div className="space-y-1">
        <h2 className="font-en text-xs font-medium tracking-wide text-neutral-500 uppercase sm:text-sm">
          {sections.content.title}
        </h2>
        <p className="text-xs leading-relaxed text-neutral-500">
          {sections.content.description}
        </p>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-emerald-900">
          {content.includedTitle}
        </h3>
        <ul className="mt-3 space-y-2">
          {content.includedItems.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm leading-relaxed text-emerald-950"
            >
              <span aria-hidden className="shrink-0 text-emerald-600">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-neutral-900">
          {content.exampleTitle}
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-neutral-50 p-3">
            <p className="text-[11px] font-medium text-neutral-500">
              {content.exampleBeforeLabel}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-neutral-700">
              {content.exampleBefore}
            </p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-3">
            <p className="text-[11px] font-medium text-neutral-500">
              {content.exampleAfterLabel}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-neutral-700">
              {content.exampleAfter}
            </p>
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500">
          {content.exampleNote}
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-amber-950">
          {content.paidTitle}
        </h3>
        <ul className="mt-3 space-y-2">
          {content.paidItems.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm leading-relaxed text-amber-950"
            >
              <span aria-hidden className="shrink-0">
                ＋
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-2">
        {copyOptionKeys.map((key) => {
          const guide = optionGuide[key];
          return (
            <CheckboxRow
              key={key}
              checked={input.options[key]}
              onChange={() => onToggleCopyOption(key)}
              title={addonPriceLabel(guide.title, pricingConfig.options[key])}
              description={guide.summary}
              includes={guide.includes}
            />
          );
        })}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-neutral-900">
          {content.clientNoticeTitle}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">
          {content.clientNotice}
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-neutral-900">
          {content.workflowTitle}
        </h3>
        <ol className="mt-3 space-y-2">
          {content.workflowSteps.map((step, index) => (
            <li
              key={step}
              className="flex gap-3 text-sm leading-relaxed text-neutral-700"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50/40 p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-red-950">
          {content.cautionTitle}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-red-900">
          {content.cautionIntro}
        </p>
        <ul className="mt-3 space-y-1.5">
          {content.cautionItems.map((item) => (
            <li key={item} className="text-sm leading-relaxed text-red-900">
              ・{item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-red-800">
          {content.cautionNote}
        </p>
      </div>

      <p className="text-xs leading-relaxed text-neutral-500">{contentGuide.summary}</p>
    </section>
  );
}
