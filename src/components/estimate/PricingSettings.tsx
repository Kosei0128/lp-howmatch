"use client";

import {
  SettingsField,
  SettingsGroup,
} from "@/components/estimate/estimate-ui";
import { estimateCopy } from "@/config/estimateGuide";
import {
  designQualityLabels,
  maintenanceLabels,
  optionLabels,
  pricing as defaultPricing,
  type DesignQuality,
  type OptionKey,
  type PricingConfig,
} from "@/config/pricing";
import {
  clearPricingConfig,
  savePricingConfig,
} from "@/lib/pricingStorage";

type PricingSettingsProps = {
  config: PricingConfig;
  onChange: (config: PricingConfig) => void;
};

function updateNested<K extends keyof PricingConfig>(
  config: PricingConfig,
  key: K,
  value: PricingConfig[K],
): PricingConfig {
  return { ...config, [key]: value };
}

export function PricingSettings({ config, onChange }: PricingSettingsProps) {
  const { pricingSettings: copy } = estimateCopy;
  const optionKeys = Object.keys(optionLabels) as OptionKey[];
  const designKeys = Object.keys(designQualityLabels) as DesignQuality[];
  const maintenanceKeys = Object.keys(maintenanceLabels) as Array<
    keyof typeof maintenanceLabels
  >;

  const patch = (next: PricingConfig) => {
    onChange(next);
    savePricingConfig(next);
  };

  const handleReset = () => {
    clearPricingConfig();
    onChange(structuredClone(defaultPricing));
  };

  return (
    <details className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <summary className="cursor-pointer list-none px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{copy.title}</p>
            <p className="mt-1 text-xs text-neutral-500">{copy.description}</p>
          </div>
          <span className="text-neutral-400" aria-hidden>
            ▼
          </span>
        </div>
      </summary>

      <div className="space-y-4 border-t border-neutral-100 px-4 py-4 sm:px-5 sm:py-5">
        <SettingsGroup title={copy.groups.base}>
          <SettingsField
            id="base-lp"
            label={copy.fields.baseLp}
            value={config.base.lp}
            onChange={(lp) =>
              patch(updateNested(config, "base", { ...config.base, lp }))
            }
          />
          <SettingsField
            id="base-small"
            label={copy.fields.baseSmall}
            value={config.base.small}
            onChange={(small) =>
              patch(updateNested(config, "base", { ...config.base, small }))
            }
          />
          <SettingsField
            id="base-corporate"
            label={copy.fields.baseCorporate}
            value={config.base.corporate}
            onChange={(corporate) =>
              patch(
                updateNested(config, "base", { ...config.base, corporate }),
              )
            }
          />
          <SettingsField
            id="perPage-fixed"
            label={copy.fields.fixedPage}
            value={config.perPage.fixed}
            onChange={(fixed) =>
              patch(
                updateNested(config, "perPage", { ...config.perPage, fixed }),
              )
            }
          />
          <SettingsField
            id="perPage-business"
            label={copy.fields.businessPage}
            value={config.perPage.business}
            onChange={(business) =>
              patch(
                updateNested(config, "perPage", {
                  ...config.perPage,
                  business,
                }),
              )
            }
          />
        </SettingsGroup>

        <SettingsGroup title={copy.groups.design}>
          {designKeys.map((key) => (
            <SettingsField
              key={key}
              id={`design-${key}`}
              label={designQualityLabels[key]}
              value={config.designMultiplier[key]}
              onChange={(value) =>
                patch(
                  updateNested(config, "designMultiplier", {
                    ...config.designMultiplier,
                    [key]: value,
                  }),
                )
              }
              step={0.05}
            />
          ))}
        </SettingsGroup>

        <SettingsGroup title={copy.groups.senior}>
          <SettingsField
            id="senior-production"
            label={copy.fields.seniorProduction}
            suffix={copy.suffixPercentOff}
            value={config.seniorDiscount.productionPercentOff}
            onChange={(productionPercentOff) =>
              patch(
                updateNested(config, "seniorDiscount", {
                  ...config.seniorDiscount,
                  productionPercentOff,
                }),
              )
            }
          />
          <SettingsField
            id="senior-launch"
            label={copy.fields.seniorLaunch}
            suffix={copy.suffixPercentOff}
            value={config.seniorDiscount.launchMaintenancePercentOff}
            onChange={(launchMaintenancePercentOff) =>
              patch(
                updateNested(config, "seniorDiscount", {
                  ...config.seniorDiscount,
                  launchMaintenancePercentOff,
                }),
              )
            }
          />
        </SettingsGroup>

        <SettingsGroup title={copy.groups.photos}>
          <SettingsField
            id="photo-hero"
            label={copy.fields.heroImage}
            value={config.photos.heroPerImage}
            onChange={(heroPerImage) =>
              patch(
                updateNested(config, "photos", {
                  ...config.photos,
                  heroPerImage,
                }),
              )
            }
          />
          <SettingsField
            id="photo-content"
            label={copy.fields.contentImage}
            value={config.photos.contentPerImage}
            onChange={(contentPerImage) =>
              patch(
                updateNested(config, "photos", {
                  ...config.photos,
                  contentPerImage,
                }),
              )
            }
          />
          <SettingsField
            id="photo-tone"
            label={copy.fields.toneAdjust}
            value={config.photos.toneAdjust}
            onChange={(toneAdjust) =>
              patch(
                updateNested(config, "photos", {
                  ...config.photos,
                  toneAdjust,
                }),
              )
            }
          />
        </SettingsGroup>

        <SettingsGroup title={copy.groups.options}>
          {optionKeys.map((key) => (
            <SettingsField
              key={key}
              id={`option-${key}`}
              label={optionLabels[key]}
              value={config.options[key]}
              onChange={(value) =>
                patch(
                  updateNested(config, "options", {
                    ...config.options,
                    [key]: value,
                  }),
                )
              }
            />
          ))}
        </SettingsGroup>

        <SettingsGroup title={copy.groups.launch}>
          <SettingsField
            id="launch-domain"
            label={copy.fields.domainProxy}
            value={config.launch.domainProxy}
            onChange={(domainProxy) =>
              patch(
                updateNested(config, "launch", {
                  ...config.launch,
                  domainProxy,
                }),
              )
            }
          />
          <SettingsField
            id="launch-vercel"
            label={copy.fields.vercelSetup}
            value={config.launch.vercelSetup}
            onChange={(vercelSetup) =>
              patch(
                updateNested(config, "launch", {
                  ...config.launch,
                  vercelSetup,
                }),
              )
            }
          />
          <SettingsField
            id="launch-bundle"
            label={copy.fields.launchBundle}
            value={config.launch.launchBundle}
            onChange={(launchBundle) =>
              patch(
                updateNested(config, "launch", {
                  ...config.launch,
                  launchBundle,
                }),
              )
            }
          />
          <SettingsField
            id="domain-jp"
            label={copy.fields.domainJp}
            value={config.launch.domainActual.jp}
            onChange={(jp) =>
              patch(
                updateNested(config, "launch", {
                  ...config.launch,
                  domainActual: { ...config.launch.domainActual, jp },
                }),
              )
            }
          />
          <SettingsField
            id="domain-com"
            label={copy.fields.domainCom}
            value={config.launch.domainActual.com}
            onChange={(com) =>
              patch(
                updateNested(config, "launch", {
                  ...config.launch,
                  domainActual: { ...config.launch.domainActual, com },
                }),
              )
            }
          />
          {maintenanceKeys.map((key) => (
            <SettingsField
              key={key}
              id={`maintenance-${key}`}
              label={`${copy.fields.maintenance} ${maintenanceLabels[key]}（月）`}
              value={config.maintenance[key]}
              onChange={(value) =>
                patch(
                  updateNested(config, "maintenance", {
                    ...config.maintenance,
                    [key]: value,
                  }),
                )
              }
            />
          ))}
        </SettingsGroup>

        <button
          type="button"
          onClick={handleReset}
          className="min-h-11 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm transition hover:border-neutral-500"
        >
          {copy.reset}
        </button>
      </div>
    </details>
  );
}
