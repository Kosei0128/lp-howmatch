import type {
  DesignQuality,
  MaintenancePlan,
  OptionKey,
  PhotoMaterialMode,
  SiteType,
} from "@/config/pricing";

export type GuideEntry = {
  title: string;
  summary: string;
  includes?: string[];
};

export const sectionGuides = {
  basic: "誰向けの見積か、サイトの規模感を選びます。",
  pages: "トップページを含むページ数と、事業・サービスごとの詳細ページ数です。",
  design: "デザインの作り込み度合いです。素材の選び方もここで決めます。",
  options: "サイトに追加する機能です。必要なものだけチェックしてください。",
  launch: "公開に必要な作業と、公開後の保守（運用サポート）です。",
} as const;

export const clientTypeGuide: Record<"normal" | "senior", GuideEntry> = {
  normal: {
    title: "通常",
    summary: "一般的なクライアント向けの標準単価です。",
  },
  senior: {
    title: "先輩・知人割",
    summary:
      "知人・先輩向けの特別単価です。制作費とオプションに割引が入り、公開・保守は別率で割引できます。",
  },
};

export const siteTypeGuide: Record<SiteType, GuideEntry> = {
  lp: {
    title: "シンプルLP",
    summary: "1ページまたは少数ページの訴求型サイト。サービス紹介・問い合わせ獲得向け。",
    includes: [
      "トップ＋共通ヘッダー／フッター",
      "コンパクトな構成向け",
    ],
  },
  small: {
    title: "小規模コーポレート",
    summary: "個人事業・小規模会社向け。会社概要・サービス・問い合わせなど基本構成。",
    includes: [
      "5〜8ページ前後が目安",
      "信頼感のある会社サイト",
    ],
  },
  corporate: {
    title: "中規模コーポレート",
    summary: "事業が複数ある会社向け。ページ数・事業詳細が増える想定。",
    includes: [
      "8ページ以上の構成",
      "事業別ページを追加しやすい",
    ],
  },
};

export const designQualityGuide: Record<DesignQuality, GuideEntry> = {
  template: {
    title: "テンプレベース",
    summary: "既存デザインをベースに調整。コストを抑えたい場合向け。",
    includes: ["制作費が約40%割引", "独自性はオリジナルより控えめ"],
  },
  original: {
    title: "オリジナル",
    summary: "会社・サービスに合わせて一からデザイン。一般的なコーポレートサイト向け。",
    includes: ["標準的な見た目の作り込み", "ブランドに合わせた配色・レイアウト"],
  },
  premium: {
    title: "高品質",
    summary: "余白・ typography・写真使いまでこだわる上位プラン。",
    includes: ["制作費が約30%加算", "見せ方・完成度を重視"],
  },
};

export const photoModeGuide: Record<PhotoMaterialMode, GuideEntry> = {
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
};

export const optionGuide: Record<OptionKey, GuideEntry> = {
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
    summary: "検索エンジン向けの基本設定。Google に正しく認識してもらうための初期設定。",
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
    summary: "店舗・拠点ごとにページを分ける、またはサブドメインで運用する構成。",
    includes: ["複数拠点の個別ページ", "共通デザインの展開"],
  },
};

export const launchGuide = {
  bundle: {
    title: "公開セット",
    summary:
      "ドメイン取得の代行と、Vercel への公開・DNS・SSL 設定をまとめて依頼。個別よりお得な料金です。",
    includes: ["ドメイン取得代行", "サーバー公開・DNS・SSL（HTTPS）設定"],
  },
  domainProxy: {
    title: "ドメイン取得代行",
    summary: "example.jp などのドメインを代理で取得・設定。実費（年間）は別途表示されます。",
  },
  vercelSetup: {
    title: "Vercel公開・DNS・SSL",
    summary:
      "制作したサイトをインターネット上に公開。独自ドメインの接続と HTTPS（鍵マーク）を設定します。",
  },
} as const;

export const maintenanceGuide: Record<MaintenancePlan, GuideEntry> = {
  none: {
    title: "保守なし",
    summary:
      "公開後の定期サポートは含みません。更新・修正が必要なときは都度お見積もりです。",
    includes: [
      "初期制作・公開のみ",
      "障害対応・更新は別途依頼",
    ],
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
};

export const pageCountHint =
  "トップページを含む総ページ数です。例：トップ・会社概要・サービス・問い合わせ = 4ページ。";

export const businessPageHint =
  "事業・サービス・商品ごとに1ページずつ作る場合の枚数です。例：事業A・事業B・事業C = 3ページ。";

export const maintenanceMonthsHint =
  "保守プランを契約する期間（月数）です。1年なら12、半年なら6と入力してください。";

export const toneAdjustHint =
  "選んだ写真の明るさ・色味をサイト全体のトーンに合わせて調整します。";

export const howToReadSummary = [
  "制作費 … ページ数・デザイン品質に応じたサイト本体の制作",
  "写真・素材 … ストック写真の選定代行（支給のみの場合は ¥0）",
  "機能オプション … フォーム・SEO など追加機能",
  "公開費用 … ドメイン・サーバー公開の初期作業（一回）",
  "保守 … 公開後の月額サポート × 契約月数",
];
