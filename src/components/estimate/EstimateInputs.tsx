"use client";

import {
  designQualityLabels,
  maintenanceLabels,
  optionLabels,
  pricing,
  siteTypeLabels,
  type DesignQuality,
  type DomainTld,
  type MaintenancePlan,
  type OptionKey,
  type PhotoMaterialMode,
  type SiteType,
} from "@/config/pricing";
import type { ClientType, EstimateInput } from "@/lib/calculateEstimate";

type EstimateInputsProps = {
  input: EstimateInput;
  onChange: (patch: Partial<EstimateInput>) => void;
  onApplyPreset: () => void;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-b border-neutral-200 pb-8">
      <h2 className="font-en text-sm font-medium tracking-wide text-neutral-500 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-neutral-800"
    >
      {children}
    </label>
  );
}

function RadioGroup<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition ${
            value === opt.value
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-300 hover:border-neutral-500"
          }`}
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

export function EstimateInputs({
  input,
  onChange,
  onApplyPreset,
}: EstimateInputsProps) {
  const optionKeys = Object.keys(optionLabels) as OptionKey[];

  const toggleOption = (key: OptionKey) => {
    onChange({
      options: { ...input.options, [key]: !input.options[key] },
    });
  };

  return (
    <div className="space-y-8">
      <details className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <summary className="cursor-pointer text-sm font-medium">
          参考事例：LUXE HOLDINGS 相当の構成
        </summary>
        <div className="mt-3 space-y-3 text-sm text-neutral-600">
          <p>
            ページ10・事業6・管理画面・SEO・オリジナルデザイン。
            通常見積の目安は約 ¥350,000。初回制作の特別価格（¥40,000）は参考事例であり、通常見積には含みません。
          </p>
          <button
            type="button"
            onClick={onApplyPreset}
            className="rounded-full border border-neutral-900 px-4 py-2 text-sm transition hover:bg-neutral-900 hover:text-white"
          >
            この構成を読み込む
          </button>
        </div>
      </details>

      <Section title="基本情報">
        <div className="space-y-2">
          <FieldLabel>クライアント種別</FieldLabel>
          <RadioGroup<ClientType>
            name="clientType"
            value={input.clientType}
            options={[
              { value: "normal", label: "通常" },
              { value: "senior", label: "先輩・知人割" },
            ]}
            onChange={(clientType) => onChange({ clientType })}
          />
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="siteType">サイト種別</FieldLabel>
          <select
            id="siteType"
            value={input.siteType}
            onChange={(e) => onChange({ siteType: e.target.value as SiteType })}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
          >
            {(Object.keys(siteTypeLabels) as SiteType[]).map((key) => (
              <option key={key} value={key}>
                {siteTypeLabels[key]}
              </option>
            ))}
          </select>
        </div>
      </Section>

      <Section title="ページ・規模">
        <div className="space-y-2">
          <FieldLabel htmlFor="pageCount">
            固定ページ {input.pageCount} ページ
          </FieldLabel>
          <input
            id="pageCount"
            type="range"
            min={1}
            max={20}
            step={1}
            value={input.pageCount}
            onChange={(e) => onChange({ pageCount: Number(e.target.value) })}
            className="w-full accent-neutral-900"
          />
          <div className="flex justify-between text-xs text-neutral-500">
            <span>1</span>
            <span>20</span>
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="businessPageCount">事業詳細ページ数</FieldLabel>
          <input
            id="businessPageCount"
            type="number"
            min={0}
            max={12}
            value={input.businessPageCount}
            onChange={(e) =>
              onChange({
                businessPageCount: Math.min(12, Math.max(0, Number(e.target.value))),
              })
            }
            className="w-24 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </Section>

      <Section title="デザイン・素材">
        <div className="space-y-2">
          <FieldLabel>デザイン品質</FieldLabel>
          <RadioGroup<DesignQuality>
            name="designQuality"
            value={input.designQuality}
            options={(Object.keys(designQualityLabels) as DesignQuality[]).map(
              (key) => ({ value: key, label: designQualityLabels[key] }),
            )}
            onChange={(designQuality) => onChange({ designQuality })}
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>写真・ビジュアル素材</FieldLabel>
          <RadioGroup<PhotoMaterialMode>
            name="photoMode"
            value={input.photoMode}
            options={[
              { value: "client", label: "クライアント支給のみ（追加 ¥0）" },
              { value: "stock", label: "ストックフォト選定代行" },
            ]}
            onChange={(photoMode) => onChange({ photoMode })}
          />
        </div>

        {input.photoMode === "stock" && (
          <div className="space-y-4 rounded-lg bg-neutral-50 p-4">
            <div className="space-y-2">
              <FieldLabel htmlFor="heroImageCount">
                背景・ヒーロー画像（{input.heroImageCount} 枚）
              </FieldLabel>
              <input
                id="heroImageCount"
                type="range"
                min={0}
                max={10}
                step={1}
                value={input.heroImageCount}
                onChange={(e) =>
                  onChange({ heroImageCount: Number(e.target.value) })
                }
                className="w-full accent-neutral-900"
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="contentImageCount">
                事業・コンテンツ画像（{input.contentImageCount} 枚）
              </FieldLabel>
              <input
                id="contentImageCount"
                type="range"
                min={0}
                max={30}
                step={1}
                value={input.contentImageCount}
                onChange={(e) =>
                  onChange({ contentImageCount: Number(e.target.value) })
                }
                className="w-full accent-neutral-900"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={input.toneAdjust}
                onChange={(e) => onChange({ toneAdjust: e.target.checked })}
                className="h-4 w-4 rounded border-neutral-300 accent-neutral-900"
              />
              加工・トーン合わせ（+{pricing.photos.toneAdjust.toLocaleString()} 円）
            </label>
          </div>
        )}
      </Section>

      <Section title="機能オプション">
        <div className="grid gap-2 sm:grid-cols-2">
          {optionKeys.map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50"
            >
              <input
                type="checkbox"
                checked={input.options[key]}
                onChange={() => toggleOption(key)}
                className="h-4 w-4 rounded border-neutral-300 accent-neutral-900"
              />
              <span>
                {optionLabels[key]}
                <span className="ml-1 text-neutral-500">
                  (+{pricing.options[key].toLocaleString()} 円)
                </span>
              </span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="公開・運用">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={input.launchBundle}
            onChange={(e) => onChange({ launchBundle: e.target.checked })}
            className="h-4 w-4 rounded border-neutral-300 accent-neutral-900"
          />
          公開セット（まとめて {pricing.launch.launchBundle.toLocaleString()} 円）
        </label>

        {!input.launchBundle && (
          <div className="space-y-2 pl-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={input.domainProxy}
                onChange={(e) => onChange({ domainProxy: e.target.checked })}
                className="h-4 w-4 rounded border-neutral-300 accent-neutral-900"
              />
              ドメイン取得代行（{pricing.launch.domainProxy.toLocaleString()} 円）
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={input.vercelSetup}
                onChange={(e) => onChange({ vercelSetup: e.target.checked })}
                className="h-4 w-4 rounded border-neutral-300 accent-neutral-900"
              />
              Vercel公開・DNS・SSL設定（
              {pricing.launch.vercelSetup.toLocaleString()} 円）
            </label>
          </div>
        )}

        {(input.domainProxy || input.launchBundle) && (
          <div className="space-y-2">
            <FieldLabel htmlFor="domainTld">ドメイン TLD</FieldLabel>
            <select
              id="domainTld"
              value={input.domainTld}
              onChange={(e) =>
                onChange({ domainTld: e.target.value as DomainTld })
              }
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
            >
              <option value="jp">
                .jp（実費 {pricing.launch.domainActual.jp.toLocaleString()} 円/年）
              </option>
              <option value="com">
                .com（実費 {pricing.launch.domainActual.com.toLocaleString()} 円/年）
              </option>
            </select>
          </div>
        )}

        <div className="space-y-2">
          <FieldLabel>保守プラン</FieldLabel>
          <RadioGroup<MaintenancePlan>
            name="maintenancePlan"
            value={input.maintenancePlan}
            options={[
              { value: "none", label: "なし" },
              ...(
                Object.keys(maintenanceLabels) as Exclude<
                  MaintenancePlan,
                  "none"
                >[]
              ).map((key) => ({
                value: key,
                label: `${maintenanceLabels[key]}（${pricing.maintenance[key].toLocaleString()} 円/月）`,
              })),
            ]}
            onChange={(maintenancePlan) => onChange({ maintenancePlan })}
          />
        </div>

        {input.maintenancePlan !== "none" && (
          <div className="space-y-2">
            <FieldLabel htmlFor="maintenanceMonths">
              保守期間 {input.maintenanceMonths} ヶ月
            </FieldLabel>
            <input
              id="maintenanceMonths"
              type="range"
              min={1}
              max={24}
              step={1}
              value={input.maintenanceMonths}
              onChange={(e) =>
                onChange({ maintenanceMonths: Number(e.target.value) })
              }
              className="w-full accent-neutral-900"
            />
          </div>
        )}
      </Section>
    </div>
  );
}
