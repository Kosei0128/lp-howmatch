"use client";

import {
  CheckboxRow,
  FieldHint,
  FieldLabel,
  InfoPanel,
  NumberInput,
  PlanCard,
  RangeInput,
  Section,
  SelectInput,
} from "@/components/estimate/estimate-ui";
import {
  businessPageHint,
  clientTypeGuide,
  designQualityGuide,
  launchGuide,
  maintenanceGuide,
  maintenanceMonthsHint,
  optionGuide,
  pageCountHint,
  photoModeGuide,
  sectionGuides,
  siteTypeGuide,
  toneAdjustHint,
} from "@/config/estimateGuide";
import {
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
  const maintenancePlans: MaintenancePlan[] = [
    "none",
    "light",
    "standard",
    "full",
  ];
  const selectedSiteGuide = siteTypeGuide[input.siteType];

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
        <Section title="基本情報" description={sectionGuides.basic}>
          <div className="space-y-2">
            <FieldLabel>クライアント種別</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["normal", "senior"] as ClientType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange({ clientType: type })}
                  className={`rounded-xl border p-3 text-left transition ${
                    input.clientType === type
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white hover:border-neutral-400"
                  }`}
                >
                  <span className="block text-sm font-medium">
                    {clientTypeGuide[type].title}
                  </span>
                  <span
                    className={`mt-1 block text-xs leading-relaxed ${
                      input.clientType === type
                        ? "text-neutral-200"
                        : "text-neutral-600"
                    }`}
                  >
                    {clientTypeGuide[type].summary}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {input.clientType === "senior" && (
            <div className="space-y-4 rounded-xl bg-neutral-50 p-4">
              <FieldHint>
                制作費・機能オプションに同じ割引率が適用されます。公開・保守は別率です。
              </FieldHint>
              <div className="space-y-2">
                <FieldLabel htmlFor="seniorProductionPercentOff">
                  制作費・オプション割引 {input.seniorProductionPercentOff}% OFF
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
            <InfoPanel
              title={selectedSiteGuide.title}
              items={[selectedSiteGuide.summary, ...(selectedSiteGuide.includes ?? [])]}
            />
          </div>
        </Section>

        <Section title="ページ・規模" description={sectionGuides.pages}>
          <div className="space-y-2">
            <FieldLabel htmlFor="pageCount">
              固定ページ {input.pageCount} ページ
            </FieldLabel>
            <FieldHint>{pageCountHint}</FieldHint>
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
            <FieldHint>{businessPageHint}</FieldHint>
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

        <Section title="デザイン・素材" description={sectionGuides.design}>
          <div className="space-y-2">
            <FieldLabel>デザイン品質</FieldLabel>
            <div className="grid gap-2">
              {(Object.keys(designQualityGuide) as DesignQuality[]).map(
                (key) => {
                  const guide = designQualityGuide[key];
                  return (
                    <PlanCard
                      key={key}
                      name="designQuality"
                      value={key}
                      selected={input.designQuality === key}
                      title={guide.title}
                      summary={guide.summary}
                      includes={guide.includes}
                      onChange={(designQuality) => onChange({ designQuality })}
                    />
                  );
                },
              )}
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel>写真・ビジュアル素材</FieldLabel>
            <div className="grid gap-2">
              {(["client", "stock"] as PhotoMaterialMode[]).map((mode) => {
                const guide = photoModeGuide[mode];
                return (
                  <PlanCard
                    key={mode}
                    name="photoMode"
                    value={mode}
                    selected={input.photoMode === mode}
                    title={guide.title}
                    summary={guide.summary}
                    includes={guide.includes}
                    onChange={(photoMode) => onChange({ photoMode })}
                  />
                );
              })}
            </div>
          </div>

          {input.photoMode === "stock" && (
            <div className="space-y-4 rounded-xl bg-neutral-50 p-4">
              <div className="space-y-2">
                <FieldLabel htmlFor="heroImageCount">
                  背景・ヒーロー（{input.heroImageCount} 枚）
                </FieldLabel>
                <FieldHint>トップや各ページ上部の大きな印象画像です。</FieldHint>
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
                <FieldHint>サービス紹介や説明ブロックで使う写真です。</FieldHint>
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
                title={`加工・トーン合わせ（+${pricingConfig.photos.toneAdjust.toLocaleString()} 円）`}
                description={toneAdjustHint}
              />
            </div>
          )}
        </Section>

        <Section title="機能オプション" description={sectionGuides.options}>
          <div className="grid gap-2">
            {optionKeys.map((key) => {
              const guide = optionGuide[key];
              return (
                <CheckboxRow
                  key={key}
                  checked={input.options[key]}
                  onChange={() => toggleOption(key)}
                  title={`${guide.title}（+${pricingConfig.options[key].toLocaleString()} 円）`}
                  description={guide.summary}
                  includes={guide.includes}
                />
              );
            })}
          </div>
        </Section>

        <Section title="公開・運用" description={sectionGuides.launch}>
          <CheckboxRow
            checked={input.launchBundle}
            onChange={(launchBundle) => onChange({ launchBundle })}
            title={`${launchGuide.bundle.title}（+${pricingConfig.launch.launchBundle.toLocaleString()} 円）`}
            description={launchGuide.bundle.summary}
            includes={launchGuide.bundle.includes}
          />

          {!input.launchBundle && (
            <div className="space-y-2">
              <CheckboxRow
                checked={input.domainProxy}
                onChange={(domainProxy) => onChange({ domainProxy })}
                title={`${launchGuide.domainProxy.title}（+${pricingConfig.launch.domainProxy.toLocaleString()} 円）`}
                description={launchGuide.domainProxy.summary}
              />
              <CheckboxRow
                checked={input.vercelSetup}
                onChange={(vercelSetup) => onChange({ vercelSetup })}
                title={`${launchGuide.vercelSetup.title}（+${pricingConfig.launch.vercelSetup.toLocaleString()} 円）`}
                description={launchGuide.vercelSetup.summary}
              />
            </div>
          )}

          {(input.domainProxy || input.launchBundle) && (
            <div className="space-y-2">
              <FieldLabel htmlFor="domainTld">ドメイン TLD</FieldLabel>
              <FieldHint>
                サイトのアドレス末尾（.jp や .com）。実費はレジストラの年間料金で、別途加算されます。
              </FieldHint>
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

          <div className="space-y-3">
            <div className="space-y-1">
              <FieldLabel>保守プラン（公開後のサポート）</FieldLabel>
              <FieldHint>
                サイト公開後、更新・監視・障害対応などをどこまで任せるか選びます。内容の違いは各プランをご確認ください。
              </FieldHint>
            </div>
            <div className="grid gap-2">
              {maintenancePlans.map((plan) => {
                const guide = maintenanceGuide[plan];
                const priceLabel =
                  plan === "none"
                    ? "契約なし"
                    : `${pricingConfig.maintenance[plan].toLocaleString()} 円/月`;
                return (
                  <PlanCard
                    key={plan}
                    name="maintenancePlan"
                    value={plan}
                    selected={input.maintenancePlan === plan}
                    title={guide.title}
                    priceLabel={priceLabel}
                    summary={guide.summary}
                    includes={guide.includes}
                    onChange={(maintenancePlan) =>
                      onChange({ maintenancePlan })
                    }
                  />
                );
              })}
            </div>
          </div>

          {input.maintenancePlan !== "none" && (
            <div className="space-y-2">
              <FieldLabel htmlFor="maintenanceMonths">
                保守期間 {input.maintenanceMonths} ヶ月
              </FieldLabel>
              <FieldHint>{maintenanceMonthsHint}</FieldHint>
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
