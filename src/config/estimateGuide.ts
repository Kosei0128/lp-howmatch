/**
 * 見積シミュレーターの表示文言・説明文の定数。
 * 文章を変更するときは estimateCopy を編集してください。
 * 料金の数字は src/config/pricing.ts を編集してください。
 */
import type {
  DesignQuality,
  DomainTld,
  MaintenancePlan,
  OptionKey,
  PhotoMaterialMode,
  SiteType,
} from "@/config/pricing";

export type GuideEntry = {
  title: string;
  summary: string;
  includes?: readonly string[];
};

/** 見積シミュレーターの表示文言（編集はこのファイルのみ） */
export const estimateCopy = {
  page: {
    backLink: "← トップへ",
    title: "Web制作 見積シミュレーター",
    description:
      "Webサイト制作の見積もりを、その場で試算できるツールです。項目ごとに説明を付けているので、初めての方でも内容を確認しながら選べます。選択を変えると右の合計がすぐ更新されます。",
    disclaimer:
      "表示価格は目安です。正式見積はヒアリング後に確定します。",
    specialPriceNote:
      "初回制作の特別価格（¥40,000）は参考事例であり、通常見積には含みません。",
  },
  calculator: {
    loading: "読み込み中…",
    resetInput: "入力をリセット",
  },
  preset: {
    title: "参考事例：LUXE HOLDINGS 相当",
    body: "ページ10・事業6・管理画面・SEO・オリジナルデザイン。通常見積の目安は約 ¥350,000。初回制作の特別価格（¥40,000）は参考事例であり、通常見積には含みません。",
    applyButton: "この構成を読み込む",
  },
  sections: {
    basic: {
      title: "基本情報",
      description: "誰向けの見積か、サイトの規模感を選びます。",
    },
    pages: {
      title: "ページ・規模",
      description:
        "トップページを含むページ数と、事業・サービスごとの詳細ページ数です。",
    },
    design: {
      title: "デザイン・素材",
      description: "デザインの作り込み度合いです。素材の選び方もここで決めます。",
    },
    options: {
      title: "機能オプション",
      description: "サイトに追加する機能です。必要なものだけチェックしてください。",
    },
    launch: {
      title: "公開・運用",
      description: "公開に必要な作業と、公開後の保守（運用サポート）です。",
    },
  },
  labels: {
    clientType: "クライアント種別",
    siteType: "サイト種別",
    businessPageCount: "事業詳細ページ数",
    designQuality: "デザイン品質",
    photoMaterial: "写真・ビジュアル素材",
    domainTld: "ドメイン TLD",
    maintenancePlan: "保守プラン（公開後のサポート）",
    toneAdjust: "加工・トーン合わせ",
    heroImages: "背景・ヒーロー",
    contentImages: "事業・コンテンツ",
    maintenanceMonths: "保守期間",
    seniorProductionDiscount: "制作費・オプション割引",
    seniorLaunchDiscount: "公開・保守割引",
    maintenanceNonePrice: "契約なし",
    perMonth: "円/月",
    perYear: "円/年",
    perImage: "円 / 枚",
    subtotal: "小計",
    addonYen: "円）",
    addonYenOpen: "（+",
  },
  hints: {
    seniorDiscount:
      "制作費・機能オプションに同じ割引率が適用されます。公開・保守は別率です。",
    pageCount:
      "トップページを含む総ページ数です。例：トップ・会社概要・サービス・問い合わせ = 4ページ。",
    businessPageCount:
      "事業・サービス・商品ごとに1ページずつ作る場合の枚数です。例：事業A・事業B・事業C = 3ページ。",
    heroImages: "トップや各ページ上部の大きな印象画像です。",
    contentImages: "サービス紹介や説明ブロックで使う写真です。",
    toneAdjust:
      "選んだ写真の明るさ・色味をサイト全体のトーンに合わせて調整します。",
    domainTld:
      "サイトのアドレス末尾（.co.jp や .com）。実費はレジストラの年間料金で、別途加算されます。",
    maintenancePlan:
      "サイト公開後、更新・監視・障害対応などをどこまで任せるか選びます。内容の違いは各プランをご確認ください。",
    maintenanceMonths:
      "保守プランを契約する期間（月数）です。1年なら12、半年なら6と入力してください。",
  },
  summary: {
    title: "見積サマリー",
    intro: "左で選んだ内容がリアルタイムで反映されます。税抜の目安金額です。",
    rows: {
      production: "制作費（初期）",
      photos: "写真・素材代行",
      options: "機能オプション",
      launch: "公開費用（一回）",
      domainActual: "ドメイン実費（年）",
      maintenance: "保守",
    },
    totalNormal: "合計（税抜）",
    totalSenior: "合計（先輩割・税抜）",
    totalBeforeDiscount: "合計（通常）",
    totalCompactNormal: "合計（税抜）",
    totalCompactSenior: "先輩割適用・税抜",
    howToReadTitle: "見積の読み方",
    howToReadItems: [
      "制作費 … ページ数・デザイン品質に応じたサイト本体の制作",
      "写真・素材 … ストック写真の選定代行（支給のみの場合は ¥0）",
      "機能オプション … フォーム・SEO など追加機能",
      "公開費用 … ドメイン・サーバー公開の初期作業（一回）",
      "保守 … 公開後の月額サポート × 契約月数",
    ],
    breakdownToggle: "見積明細",
    breakdownDocumentTitle: "御見積明細",
    breakdownTaxNote: "表示はすべて税抜です",
    sectionSubtotal: "小計",
    sectionTotal: "カテゴリ合計",
    seniorDiscountLine: "先輩・知人割",
    designDiscountNote: "デザイン割引",
    grandTotal: "お見積合計",
    youSave: "割引総額",
    breakdownHeaders: {
      item: "項目",
      unit: "単価",
      qty: "数量",
      subtotal: "小計",
    },
    copyMemo: "見積メモをコピー",
    copyMemoDone: "コピーしました",
    copyMemoCompact: "メモコピー",
    copyMemoCompactDone: "コピー済",
    reset: "リセット",
  },
  memo: {
    title: "【Web制作 見積メモ】",
    clientNormal: "通常",
    clientSenior: "先輩・知人割",
    seniorApplied: "先輩割適用後",
    disclaimer: "※ 表示価格は目安です。正式見積はヒアリング後に確定します。",
    sections: {
      breakdown: "--- 内訳 ---",
    },
  },
  breakdown: {
    baseLp: "ベース（LP）",
    baseSmall: "ベース（小規模）",
    baseCorporate: "ベース（中規模）",
    fixedPage: "固定ページ",
    businessPage: "事業詳細ページ",
    templateDiscount: "テンプレベース割引",
    premiumSurcharge: "高品質デザイン加算",
    heroStock: "背景・ヒーロー画像（ストック選定代行）",
    contentStock: "事業・コンテンツ画像（ストック選定代行）",
    toneAdjust: "加工・トーン合わせ",
    launchBundle: "公開セット（ドメイン代行＋Vercel設定）",
    domainProxy: "ドメイン取得代行",
    vercelSetup: "Vercel公開・DNS・SSL設定",
    domainActualYear: "ドメイン実費（.{tld} / 年）",
    maintenance: "保守",
  },
  pricingSettings: {
    title: "料金表の編集",
    description:
      "単価・割引率をここで変更。保存はこの端末のブラウザに記憶されます。",
    reset: "料金表を初期値に戻す",
    groups: {
      base: "制作ベース（円）",
      design: "デザイン倍率（1.0 = 100%）",
      senior: "先輩割（デフォルト % OFF）",
      photos: "写真・素材（円）",
      options: "機能オプション（円）",
      launch: "公開・運用（円）",
    },
    fields: {
      baseLp: "シンプルLP",
      baseSmall: "小規模コーポレート",
      baseCorporate: "中規模コーポレート",
      fixedPage: "固定ページ（1枚）",
      businessPage: "事業詳細ページ（1枚）",
      seniorProduction: "制作費・オプション",
      seniorLaunch: "公開・保守",
      heroImage: "ヒーロー画像（1枚）",
      contentImage: "コンテンツ画像（1枚）",
      toneAdjust: "加工・トーン合わせ",
      domainProxy: "ドメイン取得代行",
      vercelSetup: "Vercel設定",
      launchBundle: "公開セット",
      domainCoJp: "ドメイン実費 .co.jp（年）",
      domainCom: "ドメイン実費 .com（年）",
      maintenance: "保守",
    },
    suffixPercentOff: "% OFF",
  },
  guides: {
    clientType: {
      normal: {
        title: "通常",
        summary: "一般的なクライアント向けの標準単価です。",
      },
      senior: {
        title: "先輩・知人割",
        summary:
          "知人・先輩向けの特別単価です。制作費とオプションに割引が入り、公開・保守は別率で割引できます。",
      },
    },
    siteType: {
      lp: {
        title: "シンプルLP",
        summary:
          "1ページまたは少数ページの訴求型サイト。サービス紹介・問い合わせ獲得向け。",
        includes: ["トップ＋共通ヘッダー／フッター", "コンパクトな構成向け"],
      },
      small: {
        title: "小規模コーポレート",
        summary:
          "個人事業・小規模会社向け。会社概要・サービス・問い合わせなど基本構成。",
        includes: ["5〜8ページ前後が目安", "信頼感のある会社サイト"],
      },
      corporate: {
        title: "中規模コーポレート",
        summary: "事業が複数ある会社向け。ページ数・事業詳細が増える想定。",
        includes: ["8ページ以上の構成", "事業別ページを追加しやすい"],
      },
    },
    designQuality: {
      template: {
        title: "テンプレベース",
        summary: "既存デザインをベースに調整。コストを抑えたい場合向け。",
        includes: ["制作費が約40%割引", "独自性はオリジナルより控えめ"],
      },
      original: {
        title: "オリジナル",
        summary:
          "会社・サービスに合わせて一からデザイン。一般的なコーポレートサイト向け。",
        includes: [
          "標準的な見た目の作り込み",
          "ブランドに合わせた配色・レイアウト",
        ],
      },
      premium: {
        title: "高品質",
        summary: "余白・ typography・写真使いまでこだわる上位プラン。",
        includes: ["制作費が約30%加算", "見せ方・完成度を重視"],
      },
    },
    photoMode: {
      client: {
        title: "クライアント支給のみ",
        summary: "お手持ちの写真・ロゴをそのまま使用。追加費用はかかりません。",
      },
      stock: {
        title: "ストックフォト選定代行",
        summary:
          "Unsplash や Adobe Stock 等から、サイトの雰囲気に合う写真を手動で選定します。",
        includes: [
          "ヒーロー（大きな見出し画像）",
          "事業・サービス紹介用の写真",
          "必要ならトーン合わせ加工",
        ],
      },
    },
    options: {
      contactForm: {
        title: "お問い合わせフォーム",
        summary: "名前・メール・内容などを送信できるフォーム。通知メール設定込み。",
        includes: ["スパム対策の基本設定", "確認画面 or サンクスページ"],
      },
      faq: {
        title: "FAQ",
        summary: "よくある質問ページ。問い合わせ前の疑問解消に使います。",
        includes: ["質問と回答の一覧表示", "カテゴリ分け（必要に応じて）"],
      },
      news: {
        title: "ニュース / お知らせ",
        summary: "お知らせ・ブログ的な更新を載せる一覧＋詳細ページ。",
        includes: ["一覧ページ", "個別記事ページ", "更新しやすい構成"],
      },
      english: {
        title: "英語版",
        summary: "日本語サイトの英語版を追加。海外向け案内に使います。",
        includes: ["主要ページの英語版", "言語切替 UI"],
      },
      seo: {
        title: "SEO基本設定",
        summary:
          "検索エンジン向けの基本設定。Google に正しく認識してもらうための初期設定。",
        includes: [
          "タイトル・説明文（meta）",
          "OGP（SNSシェア用画像・文言）",
          "sitemap / robots の基本設定",
        ],
      },
      cms: {
        title: "管理画面（簡易CMS）",
        summary: "お知らせや一部テキストを、コードなしで更新できる仕組み。",
        includes: ["Supabase 等を利用した簡易管理", "お知らせ・コンテンツ更新"],
      },
      multiStore: {
        title: "サブドメイン / 多店舗",
        summary:
          "1つの会社サイトの中で、店舗・拠点・事業ごとにページを分けたり、shop.example.jp のようなサブドメインで別サイトとして運用する構成です。",
        includes: [
          "例：東京店・大阪店それぞれの紹介ページ",
          "例：shop.example.com / salon.example.com など",
          "共通デザインをベースに拠点ごとに内容を変更",
          "店舗数・拠点数が増えるほど制作・運用が複雑になるため高めのオプション",
        ],
      },
    },
    launch: {
      bundle: {
        title: "公開セット",
        summary:
          "ドメイン取得の代行と、Vercel への公開・DNS・SSL 設定をまとめて依頼。個別よりお得な料金です。",
        includes: ["ドメイン取得代行", "サーバー公開・DNS・SSL（HTTPS）設定"],
      },
      domainProxy: {
        title: "ドメイン取得代行",
        summary:
          "example.jp などのドメインを代理で取得・設定。実費（年間）は別途表示されます。",
      },
      vercelSetup: {
        title: "Vercel公開・DNS・SSL",
        summary:
          "制作したサイトをインターネット上に公開。独自ドメインの接続と HTTPS（鍵マーク）を設定します。",
      },
    },
    maintenance: {
      none: {
        title: "保守なし",
        summary:
          "公開後の定期サポートは含みません。更新・修正が必要なときは都度お見積もりです。",
        includes: ["初期制作・公開のみ", "障害対応・更新は別途依頼"],
      },
      light: {
        title: "ライト",
        summary:
          "「サイトが正常に動いているか」を見守る最小プラン。大きな更新は含みません。",
        includes: [
          "サイトの表示確認（死活監視）",
          "年数回の軽い動作チェック",
          "セキュリティ更新の連絡・軽微な対応",
          "急ぎの修正は都度見積もり",
        ],
      },
      standard: {
        title: "標準",
        summary:
          "月1〜2回程度の小さな更新依頼に対応。お知らせ1件追加、文言修正など。",
        includes: [
          "ライトプランの内容",
          "月1〜2回までの軽微な更新対応",
          "テキスト・画像の差し替え（小規模）",
          "表示崩れ・リンク切れの修正",
          "バックアップ状況の確認",
        ],
      },
      full: {
        title: "フル",
        summary:
          "更新作業をほぼ任せられるプラン。お知らせ投稿やコンテンツ更新を代行します。",
        includes: [
          "標準プランの内容",
          "お知らせ・ニュースの投稿代行",
          "定期的なコンテンツ更新サポート",
          "優先的な問い合わせ対応",
          "運用に関する相談・改善提案",
        ],
      },
    },
  },
} as const;

// --- 後方互換・短い参照用エクスポート ---

export const sectionGuides = {
  basic: estimateCopy.sections.basic.description,
  pages: estimateCopy.sections.pages.description,
  design: estimateCopy.sections.design.description,
  options: estimateCopy.sections.options.description,
  launch: estimateCopy.sections.launch.description,
};

export const clientTypeGuide = estimateCopy.guides.clientType;
export const siteTypeGuide = estimateCopy.guides.siteType;
export const designQualityGuide = estimateCopy.guides.designQuality;
export const photoModeGuide = estimateCopy.guides.photoMode;
export const optionGuide = estimateCopy.guides.options;
export const launchGuide = estimateCopy.guides.launch;
export const maintenanceGuide = estimateCopy.guides.maintenance;

export const pageCountHint = estimateCopy.hints.pageCount;
export const businessPageHint = estimateCopy.hints.businessPageCount;
export const maintenanceMonthsHint = estimateCopy.hints.maintenanceMonths;
export const toneAdjustHint = estimateCopy.hints.toneAdjust;
export const howToReadSummary = estimateCopy.summary.howToReadItems;

// --- ラベル（pricing.ts からも参照） ---

export const siteTypeLabels: Record<SiteType, string> = {
  lp: siteTypeGuide.lp.title,
  small: siteTypeGuide.small.title,
  corporate: siteTypeGuide.corporate.title,
};

export const designQualityLabels: Record<DesignQuality, string> = {
  template: designQualityGuide.template.title,
  original: designQualityGuide.original.title,
  premium: designQualityGuide.premium.title,
};

export const optionLabels: Record<OptionKey, string> = {
  contactForm: optionGuide.contactForm.title,
  faq: optionGuide.faq.title,
  news: optionGuide.news.title,
  english: optionGuide.english.title,
  seo: optionGuide.seo.title,
  cms: optionGuide.cms.title,
  multiStore: optionGuide.multiStore.title,
};

export const maintenanceLabels: Record<
  Exclude<MaintenancePlan, "none">,
  string
> = {
  light: maintenanceGuide.light.title,
  standard: maintenanceGuide.standard.title,
  full: maintenanceGuide.full.title,
};

// --- 動的文言ヘルパー ---

export function pageCountLabel(count: number): string {
  return `固定ページ ${count} ページ`;
}

export function heroImageCountLabel(count: number): string {
  return `${estimateCopy.labels.heroImages}（${count} 枚）`;
}

export function contentImageCountLabel(count: number): string {
  return `${estimateCopy.labels.contentImages}（${count} 枚）`;
}

export function photoUnitPriceLabel(unitPrice: number): string {
  return `¥${unitPrice.toLocaleString()} ${estimateCopy.labels.perImage}`;
}

export function photoSelectionHint(
  description: string,
  count: number,
  unitPrice: number,
): string {
  const unit = photoUnitPriceLabel(unitPrice);
  if (count === 0) {
    return `${description}（${unit}）`;
  }
  const subtotal = (count * unitPrice).toLocaleString();
  return `${description}（${unit} → ${estimateCopy.labels.subtotal} ¥${subtotal}）`;
}

export function maintenanceMonthsLabel(months: number): string {
  return `${estimateCopy.labels.maintenanceMonths} ${months} ヶ月`;
}

export function seniorProductionDiscountLabel(percent: number): string {
  return `${estimateCopy.labels.seniorProductionDiscount} ${percent}% OFF`;
}

export function seniorLaunchDiscountLabel(percent: number): string {
  return `${estimateCopy.labels.seniorLaunchDiscount} ${percent}% OFF`;
}

export function addonPriceLabel(title: string, price: number): string {
  return `${title}${estimateCopy.labels.addonYenOpen}${price.toLocaleString()} ${estimateCopy.labels.addonYen}`;
}

export function domainActualOptionLabel(
  tld: DomainTld,
  price: number,
): string {
  return `.${tld}（実費 ${price.toLocaleString()} ${estimateCopy.labels.perYear}）`;
}

export function maintenancePriceLabel(plan: MaintenancePlan, price: number): string {
  if (plan === "none") return estimateCopy.labels.maintenanceNonePrice;
  return `${price.toLocaleString()} ${estimateCopy.labels.perMonth}`;
}

export function seniorDiscountSummary(
  productionPercent: number,
  launchPercent: number,
): string {
  return `制作費・オプション ${productionPercent}% OFF / 公開・保守 ${launchPercent}% OFF`;
}

export function baseSiteLabel(siteType: SiteType): string {
  switch (siteType) {
    case "lp":
      return estimateCopy.breakdown.baseLp;
    case "small":
      return estimateCopy.breakdown.baseSmall;
    case "corporate":
      return estimateCopy.breakdown.baseCorporate;
  }
}

export function designAdjustLabel(designMultiplier: number): string {
  const pct = Math.round((designMultiplier - 1) * 100);
  if (designMultiplier < 1) {
    return `${estimateCopy.breakdown.templateDiscount}（${Math.abs(pct)}%）`;
  }
  return `${estimateCopy.breakdown.premiumSurcharge}（+${pct}%）`;
}

export function maintenanceBreakdownLabel(plan: MaintenancePlan): string {
  const name =
    plan === "light" || plan === "standard" || plan === "full"
      ? maintenanceLabels[plan]
      : maintenanceGuide.none.title;
  return `${estimateCopy.breakdown.maintenance}（${name}）`;
}

export function domainActualBreakdownLabel(tld: DomainTld): string {
  return estimateCopy.breakdown.domainActualYear.replace("{tld}", tld);
}
