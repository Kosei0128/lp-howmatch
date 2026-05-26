"use client";

import { EstimateInputs } from "@/components/estimate/EstimateInputs";
import { EstimateSummary } from "@/components/estimate/EstimateSummary";
import {
  buildEstimateMemo,
  calculateEstimate,
  defaultEstimateInput,
  luxeHoldingsPreset,
  type EstimateInput,
} from "@/lib/calculateEstimate";
import { useMemo, useState } from "react";

export function EstimateCalculator() {
  const [input, setInput] = useState<EstimateInput>(defaultEstimateInput);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  const breakdown = useMemo(() => calculateEstimate(input), [input]);

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
    setInput(defaultEstimateInput);
    setCopyStatus("idle");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
      <EstimateInputs
        input={input}
        onChange={handleChange}
        onApplyPreset={() => setInput(luxeHoldingsPreset)}
      />
      <EstimateSummary
        input={input}
        breakdown={breakdown}
        onCopyMemo={handleCopyMemo}
        onReset={handleReset}
        copyStatus={copyStatus}
      />
    </div>
  );
}
