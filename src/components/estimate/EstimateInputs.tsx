"use client";

import {
  CheckboxRow,
  FieldHint,
  FieldLabel,
  NumberInput,
  RadioGroup,
  RangeInput,
  Section,
  SelectInput,
} from "@/components/estimate/estimate-ui";
import {
  designQualityLabels,
  maintenanceLabels,
  optionLabels,
  siteTypeLabels,
  type DesignQuality,
  type DomainTld,
  type MaintenancePlan,
  type OptionKey,
  type PhotoMaterialMode,
  type PricingConfig,
  type SiteType,
} from "@/config/pricing";
import type { ClientType, EstimateInput } from "@/lib/calculateEstimate";

type EstimateInputsProps = {
  input: EstimateInput;
  pricingConfig: PricingConfig;
  onChange: (patch: Partial<EstimateInput>) => void;
  onApplyPreset: () => void;
};

export function EstimateInputs({
  input,
  pricingConfig,
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
    <div className="space-y-6 sm:space-y-8">
      <details className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <summary className="cursor-pointer text-sm font-medium">
          参考事例：LUXE HOLDINGS 相当
        </summary>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-600">
          <p>
            ページ10・事業6・管理画面・SEO・オリジナルデザイン。
            通常見積の目安は約 ¥350,000。初回制作の特別価格（¥40,000）は参考事例であり、通常見積には含みません。
          </p>
          <button
            type="button"
            onClick={onApplyPreset}
            className="min-h-11 w-full rounded-xl border border-neutral-900 px-4 py-2.5 text-sm transition active:bg-neutral-900 active:text-white sm:w-auto"
          >
            この構成を読み込む
          </button>
        </div>
      </details>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
        <Section title="基本情報">
          <div className="space-y-2">
            <FieldLabel>クライアント種別</FieldLabel>
            <RadioGroup<ClientType>
              name="clientType"
              value={input.clientType}
              layout="inline"
              options={[
                { value: "normal", label: "通常" },
                { value: "senior", label: "先輩・知人割" },
              ]}
              onChange={(clientType) => onChange({ clientType })}
            />
          </div>

          {input.clientType === "senior" && (
            <div className="space-y-4 rounded-xl bg-neutral-50 p-4">
              <FieldHint>
                割引率はその場で調整できます。デフォルトは料金表の設定から読み込まれます。
              </FieldHint>
              <div className="space-y-2">
                <FieldLabel htmlFor="seniorProductionPercentOff">
                  制作費割引 {input.seniorProductionPercentOff}% OFF
                </FieldLabel>
                <RangeInput
                  id="seniorProductionPercentOff"
                  min={
                    pricingConfig.seniorDiscount.productionPercentOffRange.min
                  }
                  max={
                    pricingConfig.seniorDiscount.productionPercentOffRange.max
                  }
                  value={input.seniorProductionPercentOff}
                  onChange={(seniorProductionPercentOff) =>
                    onChange({ seniorProductionPercentOff })
                  }
                />
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="seniorLaunchMaintenancePercentOff">
                  公開・保守割引 {input.seniorLaunchMaintenancePercentOff}% OFF
                </FieldLabel>
                <RangeInput
                  id="seniorLaunchMaintenancePercentOff"
                  min={
                    pricingConfig.seniorDiscount
                      .launchMaintenancePercentOffRange.min
                  }
                  max={
                    pricingConfig.seniorDiscount
                      .launchMaintenancePercentOffRange.max
                  }
                  value={input.seniorLaunchMaintenancePercentOff}
                  onChange={(seniorLaunchMaintenancePercentOff) =>
                    onChange({ seniorLaunchMaintenancePercentOff })
                  }
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <FieldLabel htmlFor="siteType">サイト種別</FieldLabel>
            <SelectInput
              id="siteType"
              value={input.siteType}
              onChange={(value) => onChange({ siteType: value as SiteType })}
            >
              {(Object.keys(siteTypeLabels) as SiteType[]).map((key) => (
                <option key={key} value={key}>
                  {siteTypeLabels[key]}
                </option>
              ))}
            </SelectInput>
          </div>
        </Section>

        <Section title="ページ・規模">
          <div className="space-y-2">
            <FieldLabel htmlFor="pageCount">
              固定ページ {input.pageCount} ページ
            </FieldLabel>
            <RangeInput
              id="pageCount"
              min={1}
              max={20}
              value={input.pageCount}
              onChange={(pageCount) => onChange({ pageCount })}
            />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="businessPageCount">事業詳細ページ数</FieldLabel>
            <NumberInput
              id="businessPageCount"
              min={0}
              max={12}
              value={input.businessPageCount}
              onChange={(businessPageCount) =>
                onChange({
                  businessPageCount: Math.min(12, Math.max(0, businessPageCount)),
                })
              }
              className="w-28"
            />
          </div>
        </Section>

        <Section title="デザイン・素材">
          <div className="space-y-2">
            <FieldLabel>デザイン品質</FieldLabel>
            <RadioGroup<DesignQuality>
              name="designQuality"
              value={input.designQuality}
              layout="stack"
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
              layout="stack"
              options={[
                { value: "client", label: "クライアント支給のみ（追加 ¥0）" },
                { value: "stock", label: "ストックフォト選定代行" },
              ]}
              onChange={(photoMode) => onChange({ photoMode })}
            />
          </div>

          {input.photoMode === "stock" && (
            <div className="space-y-4 rounded-xl bg-neutral-50 p-4">
              <div className="space-y-2">
                <FieldLabel htmlFor="heroImageCount">
                  背景・ヒーロー（{input.heroImageCount} 枚）
                </FieldLabel>
                <RangeInput
                  id="heroImageCount"
                  min={0}
                  max={10}
                  value={input.heroImageCount}
                  onChange={(heroImageCount) => onChange({ heroImageCount })}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="contentImageCount">
                  事業・コンテンツ（{input.contentImageCount} 枚）
                </FieldLabel>
                <RangeInput
                  id="contentImageCount"
                  min={0}
                  max={30}
                  value={input.contentImageCount}
                  onChange={(contentImageCount) =>
                    onChange({ contentImageCount })
                  }
                />
              </div>
              <CheckboxRow
                checked={input.toneAdjust}
                onChange={(toneAdjust) => onChange({ toneAdjust })}
              >
                加工・トーン合わせ（+
                {pricingConfig.photos.toneAdjust.toLocaleString()} 円）
              </CheckboxRow>
            </div>
          )}
        </Section>

        <Section title="機能オプション">
          <div className="grid gap-2">
            {optionKeys.map((key) => (
              <CheckboxRow
                key={key}
                checked={input.options[key]}
                onChange={() => toggleOption(key)}
              >
                {optionLabels[key]}
                <span className="ml-1 text-neutral-500">
                  (+{pricingConfig.options[key].toLocaleString()} 円)
                </span>
              </CheckboxRow>
            ))}
          </div>
        </Section>

        <Section title="公開・運用">
          <CheckboxRow
            checked={input.launchBundle}
            onChange={(launchBundle) => onChange({ launchBundle })}
          >
            公開セット（まとめて{" "}
            {pricingConfig.launch.launchBundle.toLocaleString()} 円）
          </CheckboxRow>

          {!input.launchBundle && (
            <div className="space-y-2">
              <CheckboxRow
                checked={input.domainProxy}
                onChange={(domainProxy) => onChange({ domainProxy })}
              >
                ドメイン取得代行（
                {pricingConfig.launch.domainProxy.toLocaleString()} 円）
              </CheckboxRow>
              <CheckboxRow
                checked={input.vercelSetup}
                onChange={(vercelSetup) => onChange({ vercelSetup })}
              >
                Vercel公開・DNS・SSL（
                {pricingConfig.launch.vercelSetup.toLocaleString()} 円）
              </CheckboxRow>
            </div>
          )}

          {(input.domainProxy || input.launchBundle) && (
            <div className="space-y-2">
              <FieldLabel htmlFor="domainTld">ドメイン TLD</FieldLabel>
              <SelectInput
                id="domainTld"
                value={input.domainTld}
                onChange={(value) =>
                  onChange({ domainTld: value as DomainTld })
                }
              >
                <option value="jp">
                  .jp（実費{" "}
                  {pricingConfig.launch.domainActual.jp.toLocaleString()} 円/年）
                </option>
                <option value="com">
                  .com（実費{" "}
                  {pricingConfig.launch.domainActual.com.toLocaleString()} 円/年）
                </option>
              </SelectInput>
            </div>
          )}

          <div className="space-y-2">
            <FieldLabel>保守プラン</FieldLabel>
            <RadioGroup<MaintenancePlan>
              name="maintenancePlan"
              value={input.maintenancePlan}
              layout="stack"
              options={[
                { value: "none", label: "なし" },
                ...(
                  Object.keys(maintenanceLabels) as Exclude<
                    MaintenancePlan,
                    "none"
                  >[]
                ).map((key) => ({
                  value: key,
                  label: `${maintenanceLabels[key]}（${pricingConfig.maintenance[key].toLocaleString()} 円/月）`,
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
              <RangeInput
                id="maintenanceMonths"
                min={1}
                max={24}
                value={input.maintenanceMonths}
                onChange={(maintenanceMonths) =>
                  onChange({ maintenanceMonths })
                }
              />
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
