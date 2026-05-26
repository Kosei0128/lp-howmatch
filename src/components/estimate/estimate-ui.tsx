"use client";

import type { ReactNode } from "react";

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 border-b border-neutral-200 pb-6 sm:pb-8">
      <h2 className="font-en text-xs font-medium tracking-wide text-neutral-500 uppercase sm:text-sm">
        {title}
      </h2>
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
  return (
    <input
      id={id}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
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
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm leading-snug active:bg-neutral-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 rounded border-neutral-300 accent-neutral-900"
      />
      <span className="flex-1">{children}</span>
    </label>
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
