"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

function clampValue(value: number, min?: number, max?: number): number {
  let next = value;
  if (min !== undefined) next = Math.max(min, next);
  if (max !== undefined) next = Math.min(max, next);
  return next;
}

function usesIntegerStep(step: number): boolean {
  return step >= 1 && Number.isInteger(step);
}

function formatNumberForDisplay(value: number, integer: boolean): string {
  return integer ? String(Math.trunc(value)) : String(value);
}

function sanitizeIntegerDraft(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits === "") return "";
  return String(parseInt(digits, 10));
}

function sanitizeDecimalDraft(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const [head, ...rest] = cleaned.split(".");
  if (rest.length === 0) {
    return head;
  }
  return `${head}.${rest.join("")}`;
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 border-b border-neutral-200 pb-6 sm:pb-8">
      <div className="space-y-1">
        <h2 className="font-en text-xs font-medium tracking-wide text-neutral-500 uppercase sm:text-sm">
          {title}
        </h2>
        {description ? <FieldHint>{description}</FieldHint> : null}
      </div>
      {children}
    </section>
  );
}

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium leading-snug text-neutral-800"
    >
      {children}
    </label>
  );
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-relaxed text-neutral-500">{children}</p>;
}

export function SelectInput({
  id,
  value,
  onChange,
  children,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-base sm:text-sm"
    >
      {children}
    </select>
  );
}

export function NumberInput({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  className = "",
}: {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}) {
  const integerMode = usesIntegerStep(step);
  const [draft, setDraft] = useState(() =>
    formatNumberForDisplay(value, integerMode),
  );

  useEffect(() => {
    setDraft(formatNumberForDisplay(value, integerMode));
  }, [value, integerMode]);

  const commitDraft = (raw: string) => {
    if (raw === "" || raw === ".") {
      const fallback = clampValue(min ?? 0, min, max);
      setDraft(formatNumberForDisplay(fallback, integerMode));
      onChange(fallback);
      return;
    }

    const parsed = integerMode ? parseInt(raw, 10) : parseFloat(raw);
    if (Number.isNaN(parsed)) {
      setDraft(formatNumberForDisplay(value, integerMode));
      return;
    }

    const next = clampValue(parsed, min, max);
    setDraft(formatNumberForDisplay(next, integerMode));
    onChange(next);
  };

  return (
    <input
      id={id}
      type="text"
      inputMode={integerMode ? "numeric" : "decimal"}
      autoComplete="off"
      value={draft}
      onChange={(e) => {
        const raw = integerMode
          ? sanitizeIntegerDraft(e.target.value)
          : sanitizeDecimalDraft(e.target.value);

        setDraft(raw);

        if (raw === "" || raw === ".") return;

        const parsed = integerMode ? parseInt(raw, 10) : parseFloat(raw);
        if (Number.isNaN(parsed)) return;

        onChange(clampValue(parsed, min, max));
      }}
      onBlur={() => commitDraft(draft)}
      onFocus={(e) => e.target.select()}
      className={`min-h-11 rounded-xl border border-neutral-300 px-3 py-2.5 text-base tabular-nums sm:text-sm ${className}`}
    />
  );
}

export function RangeInput({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="range-input w-full"
    />
  );
}

export function RadioGroup<T extends string>({
  name,
  value,
  options,
  onChange,
  layout = "stack",
}: {
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  layout?: "stack" | "inline";
}) {
  return (
    <div
      className={
        layout === "stack"
          ? "grid gap-2"
          : "flex flex-wrap gap-2"
      }
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-4 py-2.5 text-sm leading-snug transition active:scale-[0.99] ${
            value === opt.value
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-200 bg-white hover:border-neutral-400"
          } ${layout === "stack" ? "justify-start text-left" : ""}`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="sr-only"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export function CheckboxRow({
  checked,
  onChange,
  title,
  description,
  includes,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title?: string;
  description?: string;
  includes?: readonly string[];
  children?: ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm leading-snug transition active:bg-neutral-50 ${
        checked
          ? "border-neutral-900 bg-neutral-50"
          : "border-neutral-200 bg-white"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 rounded border-neutral-300 accent-neutral-900"
      />
      <span className="min-w-0 flex-1 space-y-1">
        {title ? (
          <span className="block font-medium text-neutral-900">{title}</span>
        ) : null}
        {description ? (
          <span className="block text-xs leading-relaxed text-neutral-600">
            {description}
          </span>
        ) : null}
        {includes && includes.length > 0 ? (
          <ul className="mt-1 space-y-0.5 text-xs text-neutral-500">
            {includes.map((item) => (
              <li key={item} className="flex gap-1.5">
                <span aria-hidden className="shrink-0">
                  ·
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {children}
      </span>
    </label>
  );
}

export function PlanCard<T extends string>({
  name,
  value,
  selected,
  title,
  priceLabel,
  summary,
  includes,
  onChange,
}: {
  name: string;
  value: T;
  selected: boolean;
  title: string;
  priceLabel?: string;
  summary: string;
  includes?: readonly string[];
  onChange: (value: T) => void;
}) {
  return (
    <label
      className={`block cursor-pointer rounded-xl border p-4 transition active:scale-[0.99] ${
        selected
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-200 bg-white hover:border-neutral-400"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold">{title}</span>
        {priceLabel ? (
          <span
            className={`shrink-0 text-xs font-medium tabular-nums ${
              selected ? "text-neutral-200" : "text-neutral-500"
            }`}
          >
            {priceLabel}
          </span>
        ) : null}
      </div>
      <p
        className={`mt-2 text-xs leading-relaxed ${
          selected ? "text-neutral-200" : "text-neutral-600"
        }`}
      >
        {summary}
      </p>
      {includes && includes.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {includes.map((item) => (
            <li
              key={item}
              className={`flex gap-2 text-xs leading-relaxed ${
                selected ? "text-neutral-100" : "text-neutral-500"
              }`}
            >
              <span aria-hidden className="shrink-0">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </label>
  );
}

export function InfoPanel({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      <p className="text-xs font-medium text-neutral-800">{title}</p>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item} className="text-xs leading-relaxed text-neutral-600">
            · {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SettingsGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4">
      <h3 className="text-sm font-medium text-neutral-800">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function SettingsField({
  label,
  id,
  value,
  onChange,
  suffix,
  step = 1,
}: {
  label: string;
  id: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  step?: number;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs text-neutral-600">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <NumberInput
          id={id}
          value={value}
          onChange={onChange}
          min={0}
          step={step}
          className="w-full"
        />
        {suffix ? (
          <span className="shrink-0 text-xs text-neutral-500">{suffix}</span>
        ) : null}
      </div>
    </div>
  );
}
