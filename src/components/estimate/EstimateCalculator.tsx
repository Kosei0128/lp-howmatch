"use client";

import { EstimateInputs } from "@/components/estimate/EstimateInputs";
import { EstimateSummary } from "@/components/estimate/EstimateSummary";
import { PricingSettings } from "@/components/estimate/PricingSettings";
import {
  buildEstimateMemo,
  calculateEstimate,
  createEmptyEstimateInput,
  createLuxeHoldingsPreset,
  type EstimateInput,
} from "@/lib/calculateEstimate";
import {
  clonePricingConfig,
  loadPricingConfig,
} from "@/lib/pricingStorage";
import type { PricingConfig } from "@/config/pricing";
import { estimateCopy } from "@/config/estimateGuide";
import { useEffect, useMemo, useState } from "react";

export function EstimateCalculator() {
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(() =>
    clonePricingConfig(),
  );
  const [input, setInput] = useState<EstimateInput>(() =>
    createEmptyEstimateInput(),
  );
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = loadPricingConfig();
    setPricingConfig(saved);
    setInput(createEmptyEstimateInput(saved));
    setReady(true);
  }, []);

  const breakdown = useMemo(
    () => calculateEstimate(input, pricingConfig),
    [input, pricingConfig],
  );

  const handleChange = (patch: Partial<EstimateInput>) => {
    setInput((prev) => ({ ...prev, ...patch }));
    setCopyStatus("idle");
  };

  const handleCopyMemo = async () => {
    const memo = buildEstimateMemo(input, breakdown);
    await navigator.clipboard.writeText(memo);
    setCopyStatus("copied");
    setTimeout(() => setCopyStatus("idle"), 2000);
  };

  const handleReset = () => {
    setInput(createEmptyEstimateInput(pricingConfig));
    setCopyStatus("idle");
  };

  if (!ready) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
        {estimateCopy.calculator.loading}
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 space-y-4">
        <PricingSettings config={pricingConfig} onChange={setPricingConfig} />
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
        <div className="min-w-0">
          <EstimateInputs
            input={input}
            pricingConfig={pricingConfig}
            onChange={handleChange}
            onApplyPreset={() =>
              setInput(createLuxeHoldingsPreset(pricingConfig))
            }
          />
        </div>
        <aside className="estimate-summary-panel min-w-0 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-2rem)] lg:self-start lg:overflow-y-auto lg:overscroll-y-contain lg:pr-1">
          <EstimateSummary
            input={input}
            breakdown={breakdown}
            onCopyMemo={handleCopyMemo}
            onReset={handleReset}
            copyStatus={copyStatus}
          />
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
        <EstimateSummary
          input={input}
          breakdown={breakdown}
          onCopyMemo={handleCopyMemo}
          onReset={handleReset}
          copyStatus={copyStatus}
          variant="compact"
        />
        <button
          type="button"
          onClick={handleReset}
          className="mt-2 min-h-10 w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm"
        >
          {estimateCopy.calculator.resetInput}
        </button>
      </div>
    </>
  );
}
