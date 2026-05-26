"use client";

import { ContentWorkflowSection } from "@/components/estimate/ContentWorkflowSection";
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
  addonPriceLabel,
  businessPageHint,
  clientTypeGuide,
  contentImageCountLabel,
  designQualityGuide,
  domainActualOptionLabel,
  estimateCopy,
  heroImageCountLabel,
  launchGuide,
  maintenanceGuide,
  maintenanceMonthsHint,
  maintenanceMonthsLabel,
  maintenancePriceLabel,
  optionGuide,
  pageCountHint,
  pageCountLabel,
  photoSelectionHint,
  photoUnitPriceLabel,
  photoModeGuide,
  seniorLaunchDiscountLabel,
  seniorProductionDiscountLabel,
  siteTypeGuide,
  siteTypeLabels,
  toneAdjustHint,
} from "@/config/estimateGuide";
import {
  optionLabels,
  type DesignQuality,
  type DomainTld,
  type MaintenancePlan,
  type OptionKey,
  type PhotoMaterialMode,
  type PricingConfig,
  type SiteType,
} from "@/config/pricing";
import type { CoconalaPackId } from "@/lib/coconalaPacks";
import type { ClientType, EstimateInput } from "@/lib/calculateEstimate";

type EstimateInputsProps = {
  input: EstimateInput;
  pricingConfig: PricingConfig;
  onChange: (patch: Partial<EstimateInput>) => void;
  onApplyPreset: () => void;
  onApplyCoconalaPack: (packId: CoconalaPackId) => void;
};

export function EstimateInputs({
  input,
  pricingConfig,
  onChange,
  onApplyPreset,
  onApplyCoconalaPack,
}: EstimateInputsProps) {
  const optionKeys = (Object.keys(optionLabels) as OptionKey[]).filter(
    (key) => key !== "copySupport" && key !== "copyPremium",
  );
  const maintenancePlans: MaintenancePlan[] = [
    "none",
    "light",
    "standard",
    "full",
  ];
  const selectedSiteGuide = siteTypeGuide[input.siteType];

  const { preset, coconalaPacks, sections, labels, hints } = estimateCopy;

  const toggleOption = (key: OptionKey) => {
    onChange({
      options: { ...input.options, [key]: !input.options[key] },
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <details className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <summary className="cursor-pointer text-sm font-medium">
          {preset.title}
        </summary>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-600">
          <p>{preset.body}</p>
          <button
            type="button"
            onClick={onApplyPreset}
            className="min-h-11 w-full rounded-xl border border-neutral-900 px-4 py-2.5 text-sm transition active:bg-neutral-900 active:text-white sm:w-auto"
          >
            {preset.applyButton}
          </button>
        </div>
      </details>

      <details className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <summary className="cursor-pointer text-sm font-medium">
          {coconalaPacks.sectionTitle}
        </summary>
        <div className="mt-3 space-y-4">
          <p className="text-sm leading-relaxed text-neutral-600">
            {coconalaPacks.sectionDescription}
          </p>
          {(
            Object.entries(coconalaPacks.items) as [
              CoconalaPackId,
              (typeof coconalaPacks.items)[CoconalaPackId],
            ][]
          ).map(([packId, pack]) => (
            <div
              key={packId}
              className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-neutral-900">
                  {pack.title}
                </h3>
                <span className="shrink-0 rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs font-medium text-white">
                  出品目安 {pack.targetPrice}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {pack.summary}
              </p>
              <ul className="mt-2 space-y-1 text-xs text-neutral-500">
                {pack.includes.map((item) => (
                  <li key={item}>・{item}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => onApplyCoconalaPack(packId)}
                className="mt-3 min-h-11 w-full rounded-xl border border-neutral-900 px-4 py-2.5 text-sm transition active:bg-neutral-900 active:text-white sm:w-auto"
              >
                {coconalaPacks.applyButton}
              </button>
            </div>
          ))}
          <p className="text-xs leading-relaxed text-neutral-500">
            {coconalaPacks.note}
          </p>
        </div>
      </details>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
        <Section title={sections.basic.title} description={sections.basic.description}>
          <div className="space-y-2">
            <FieldLabel>{labels.clientType}</FieldLabel>
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
              <FieldHint>{hints.seniorDiscount}</FieldHint>
              <div className="space-y-2">
                <FieldLabel htmlFor="seniorProductionPercentOff">
                  {seniorProductionDiscountLabel(input.seniorProductionPercentOff)}
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
                  {seniorLaunchDiscountLabel(input.seniorLaunchMaintenancePercentOff)}
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
            <FieldLabel htmlFor="siteType">{labels.siteType}</FieldLabel>
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

        <Section title={sections.pages.title} description={sections.pages.description}>
          <div className="space-y-2">
            <FieldLabel htmlFor="pageCount">
              {pageCountLabel(input.pageCount)}
            </FieldLabel>
            <FieldHint>{pageCountHint}</FieldHint>
            <RangeInput
              id="pageCount"
              min={0}
              max={20}
              value={input.pageCount}
              onChange={(pageCount) => onChange({ pageCount })}
            />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="businessPageCount">{labels.businessPageCount}</FieldLabel>
            <FieldHint>{businessPageHint}</FieldHint>
            <NumberInput
              id="businessPageCount"
              min={0}
              max={12}
              value={input.businessPageCount}
              onChange={(businessPageCount) => onChange({ businessPageCount })}
              className="w-28"
            />
          </div>
        </Section>

        <Section title={sections.design.title} description={sections.design.description}>
          <div className="space-y-2">
            <FieldLabel>{labels.designQuality}</FieldLabel>
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
                      includes={"includes" in guide ? guide.includes : undefined}
                      onChange={(designQuality) => onChange({ designQuality })}
                    />
                  );
                },
              )}
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel>{labels.photoMaterial}</FieldLabel>
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
                    includes={"includes" in guide ? guide.includes : undefined}
                    onChange={(photoMode) => onChange({ photoMode })}
                  />
                );
              })}
            </div>
          </div>

          {input.photoMode === "stock" && (
            <div className="space-y-4 rounded-xl bg-neutral-50 p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <FieldLabel htmlFor="heroImageCount">
                    {heroImageCountLabel(input.heroImageCount)}
                  </FieldLabel>
                  <span className="shrink-0 text-xs font-medium tabular-nums text-neutral-600">
                    {photoUnitPriceLabel(pricingConfig.photos.heroPerImage)}
                  </span>
                </div>
                <FieldHint>
                  {photoSelectionHint(
                    hints.heroImages,
                    input.heroImageCount,
                    pricingConfig.photos.heroPerImage,
                  )}
                </FieldHint>
                <RangeInput
                  id="heroImageCount"
                  min={0}
                  max={10}
                  value={input.heroImageCount}
                  onChange={(heroImageCount) => onChange({ heroImageCount })}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <FieldLabel htmlFor="contentImageCount">
                    {contentImageCountLabel(input.contentImageCount)}
                  </FieldLabel>
                  <span className="shrink-0 text-xs font-medium tabular-nums text-neutral-600">
                    {photoUnitPriceLabel(pricingConfig.photos.contentPerImage)}
                  </span>
                </div>
                <FieldHint>
                  {photoSelectionHint(
                    hints.contentImages,
                    input.contentImageCount,
                    pricingConfig.photos.contentPerImage,
                  )}
                </FieldHint>
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
                title={addonPriceLabel(labels.toneAdjust, pricingConfig.photos.toneAdjust)}
                description={toneAdjustHint}
              />
            </div>
          )}
        </Section>

        <ContentWorkflowSection
          input={input}
          pricingConfig={pricingConfig}
          onToggleCopyOption={(key) => toggleOption(key)}
        />

        <Section title={sections.options.title} description={sections.options.description}>
          <div className="grid gap-2">
            {optionKeys.map((key) => {
              const guide = optionGuide[key];
              return (
                <CheckboxRow
                  key={key}
                  checked={input.options[key]}
                  onChange={() => toggleOption(key)}
                  title={addonPriceLabel(guide.title, pricingConfig.options[key])}
                  description={guide.summary}
                  includes={guide.includes}
                />
              );
            })}
          </div>
        </Section>

        <Section title={sections.launch.title} description={sections.launch.description}>
          <CheckboxRow
            checked={input.launchBundle}
            onChange={(launchBundle) => onChange({ launchBundle })}
            title={addonPriceLabel(launchGuide.bundle.title, pricingConfig.launch.launchBundle)}
            description={launchGuide.bundle.summary}
            includes={launchGuide.bundle.includes}
          />

          {!input.launchBundle && (
            <div className="space-y-2">
              <CheckboxRow
                checked={input.domainProxy}
                onChange={(domainProxy) => onChange({ domainProxy })}
                title={addonPriceLabel(
                  launchGuide.domainProxy.title,
                  pricingConfig.launch.domainProxy,
                )}
                description={launchGuide.domainProxy.summary}
              />
              <CheckboxRow
                checked={input.vercelSetup}
                onChange={(vercelSetup) => onChange({ vercelSetup })}
                title={addonPriceLabel(
                  launchGuide.vercelSetup.title,
                  pricingConfig.launch.vercelSetup,
                )}
                description={launchGuide.vercelSetup.summary}
              />
            </div>
          )}

          {(input.domainProxy || input.launchBundle) && (
            <div className="space-y-2">
              <FieldLabel htmlFor="domainTld">{labels.domainTld}</FieldLabel>
              <FieldHint>{hints.domainTld}</FieldHint>
              <SelectInput
                id="domainTld"
                value={input.domainTld}
                onChange={(value) =>
                  onChange({ domainTld: value as DomainTld })
                }
              >
                <option value="co.jp">
                  {domainActualOptionLabel(
                    "co.jp",
                    pricingConfig.launch.domainActual["co.jp"],
                  )}
                </option>
                <option value="com">
                  {domainActualOptionLabel(
                    "com",
                    pricingConfig.launch.domainActual.com,
                  )}
                </option>
              </SelectInput>
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1">
              <FieldLabel>{labels.maintenancePlan}</FieldLabel>
              <FieldHint>{hints.maintenancePlan}</FieldHint>
            </div>
            <div className="grid gap-2">
              {maintenancePlans.map((plan) => {
                const guide = maintenanceGuide[plan];
                const priceLabel = maintenancePriceLabel(
                  plan,
                  pricingConfig.maintenance[plan],
                );
                return (
                  <PlanCard
                    key={plan}
                    name="maintenancePlan"
                    value={plan}
                    selected={input.maintenancePlan === plan}
                    title={guide.title}
                    priceLabel={priceLabel}
                    summary={guide.summary}
                    includes={"includes" in guide ? guide.includes : undefined}
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
                {maintenanceMonthsLabel(input.maintenanceMonths)}
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
