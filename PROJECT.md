# LP Howmatch — プロジェクト引き継ぎドキュメント

> **目的:** どの AI / 開発者が触っても、要件・現状・次タスクをすぐ把握できるようにする。
> 最終更新: 2026-05-26

---

## 1. プロジェクト概要

| 項目 | 内容 |
|---|---|
| **名称** | Web制作 見積シミュレーター（lp-howmatch） |
| **目的** | 個人受注型 Web 制作の見積をリアルタイム試算。ココナラ等での出品・直受注の料金根拠として使う |
| **公開 URL** | https://lp-howmatch.vercel.app/estimate |
| **GitHub** | https://github.com/Kosei0128/lp-howmatch （`master` push → Vercel 自動デプロイ） |
| **制作者の状況** | 個人開発者。実績は **自分のサイト + 先輩のサイト** の2件のみ。初回特別 ¥40,000 は参考事例 |

### 技術スタック

- **Next.js 16** + **React 19** + **TypeScript** + **Tailwind CSS 4**
- デプロイ: **Vercel**
- 制作想定: **Next.js / React / Vercel**（WordPress ではない）
- CMS オプション: **Supabase 等の簡易管理画面**（フル WordPress ではない）

---

## 2. 要件定義（What / Why）

### 2.1 必須機能（実装済み）

- [x] 項目選択に応じた **リアルタイム見積計算**
- [x] カテゴリ別サマリー（制作費 / 写真 / オプション / 公開 / 保守）
- [x] **御見積明細**（カテゴリ別内訳、デザイン割引・先輩割の可視化）
- [x] 各項目の **平易な説明文**（初見でも選べる UI）
- [x] **原稿・文章**の説明（込み範囲 / 有料オプション / 制作フロー）
- [x] **先輩・知人割**（制作+オプション / 公開+保守 で別率、UI で % 調整可）
- [x] **料金表エディタ**（localStorage 保存、「料金表を初期値に戻す」あり）
- [x] 見積メモの **クリップボードコピー**
- [x] **LUXE HOLDINGS** 参考プリセット読み込み
- [x] **モバイル対応**（下部固定バー、明細カード表示、safe-area）
- [x] 初期・リセット時 **¥0**（ページ数 0 = 未選択。1以上で積み上がる）

### 2.2 非機能要件

- 料金数字 → `src/config/pricing.ts` **のみ** 編集
- 日本語 UI 文言 → `src/config/estimateGuide.ts` の `estimateCopy` **のみ** 編集
- 計算ロジックは pure function（`calculateEstimate.ts`）。UI から分離
- 税抜表示。正式見積はヒアリング後に確定（免責文言あり）

### 2.3 将来検討（未実装）

- [ ] 市場調査に基づく **料金改定の反映**（→ 現在の最優先タスク、下記 §6）
- [ ] ココナラ向け **出品パック UI**（5ページHPライト ¥99,800 等のワンクリック読み込み）
- [ ] トップページ（`/`）の本格 LP 化
- [ ] テスト（現状テストなし。`npm run build` で型チェックのみ）
- [ ] Vercel Hobby 商用利用の注意書き（調査レポートに記載あり）

---

## 3. ディレクトリ構成

```
src/
  app/
    page.tsx                 # トップ（シンプルな /estimate リンクのみ）
    estimate/page.tsx        # 見積シミュレーター本体
    layout.tsx               # viewport / metadata
    globals.css              # モバイル padding、スクロールバー等
  components/estimate/
    EstimateCalculator.tsx   # 状態管理・2カラムレイアウト・モバイル固定バー
    EstimateInputs.tsx       # 左: 全入力フォーム + ガイド
    EstimateSummary.tsx      # 右: サマリー + 明細トグル
    EstimateBreakdown.tsx    # 御見積明細 UI
    PricingSettings.tsx      # 折りたたみ料金表エディタ
    estimate-ui.tsx          # Section, PlanCard, RangeInput 等の共通 UI
  config/
    pricing.ts               # ★ すべての料金数字（Single Source of Truth）
    estimateGuide.ts         # ★ すべての日本語文言 + ラベル + ガイド文
  lib/
    calculateEstimate.ts     # 見積計算・デフォルト入力・メモ生成
    breakdownView.ts         # 明細のカテゴリ別ビュー組み立て
    pricingStorage.ts        # localStorage 読み書き

deep-research-report.md      # 市場調査・料金改定提案（未コミットの可能性あり）
PROJECT.md                   # 本ファイル
```

### 編集ルール（厳守）

| 変更内容 | 触るファイル |
|---|---|
| 単価・倍率・割引率 | `src/config/pricing.ts` |
| ラベル・説明・免責・ガイド文 | `src/config/estimateGuide.ts` |
| 計算式の変更 | `src/lib/calculateEstimate.ts` |
| 明細の見せ方 | `src/lib/breakdownView.ts`, `EstimateBreakdown.tsx` |

---

## 4. 見積計算ロジック（要点）

```
pageCount < 1  →  合計 ¥0（未選択）

制作費 = round((base + fixedPages×固定単価 + businessPages×事業単価) × designMultiplier)
  fixedPages = max(0, pageCount - 1)

合計 = 制作費 + 写真 + オプション + 公開 + ドメイン実費 + 保守

先輩割:
  - 制作費・オプション → productionPercentOff（デフォ 45% OFF）
  - 公開・保守         → launchMaintenancePercentOff（デフォ 10% OFF）
  - 写真・ドメイン実費 → 割引なし
```

### 入力状態の種類

| 関数 | 用途 |
|---|---|
| `createEmptyEstimateInput()` | **初期表示・リセット**（pageCount=0, 全オプション OFF → ¥0） |
| `createDefaultEstimateInput()` | **サンプル構成**（5P, 事業2, フォーム+SEO, ストック写真）— LUXE プリセットのベース |
| `createLuxeHoldingsPreset()` | 参考事例ボタン用（10P, 事業6, CMS+SEO+フォーム） |

---

## 5. 現行料金表（`pricing.ts` — Phase 1 反映済み）

> Phase 1（2026-05）: Pattern A 寄りのオプション圧縮。**ベースは実績作りのため現行維持**。知人割 45% / 10% 維持。

| カテゴリ | 項目 | 単価（税抜） |
|---|---|---:|
| ベース | LP / 小規模 / 中規模 | ¥40,000 / ¥50,000 / ¥60,000 |
| ページ | 固定 / 事業詳細 | ¥10,000 / ¥13,000 |
| デザイン倍率 | テンプレ / オリジナル / 高品質 | 0.6 / 1.0 / 1.35 |
| 写真 | ヒーロー / コンテンツ / トーン | ¥3,000/枚 / ¥2,000/枚 / ¥3,000 |
| オプション | フォーム / FAQ / … / 多店舗 | 12k / 5k / … / 35k |
| **原稿** | 原稿作成サポート / 本格コピー | **¥15,000 / ¥30,000** |
| 公開 | ドメイン代行 / Vercel / セット | ¥4,000 / ¥12,000 / ¥15,000 |
| 保守 | ライト / 標準 / フル | ¥3,000 / ¥7,000 / ¥12,000 月 |
| 知人割 | 制作+オプション / 公開+保守 | 45% OFF / 10% OFF |

### 参考見積（Phase 1・税抜）

| 構成 | 合計 |
|---|---:|
| デフォルトサンプル（5P・事業2・オリジナル・写真2+4・フォーム+SEO） | 約 ¥152,000 |
| LUXE相当（10P・事業6・CMS+SEO+フォーム） | 約 ¥290,000 |

### ココナラ出品パック（構成読み込みあり）

`EstimateInputs` 上部の「ココナラ出品パック」から5種読み込み可。出品目安価格は `estimateGuide.ts` の `coconalaPacks` を参照。

---

## 6. 今どこまで終わっているか

### ✅ 完了

1. アプリ一式 scaffold〜デプロイ（Vercel + GitHub 連携）
2. 見積計算・サマリー・御見積明細 UI
3. 先輩割・料金表エディタ・LUXE プリセット
4. 文言の `estimateCopy` 一元化
5. モバイル UI 修正（見切れ・safe-area）
6. リセット = ¥0 の空状態
7. 市場調査レポート（`deep-research-report.md`）
8. **Phase 1 料金改定**（A寄り・ベース現行維持・知人割45%維持）
9. **ココナラ出品パック 5種**の構成読み込み UI
10. **原稿・文章の説明セクション**（制作込み範囲 / 有料オプション / ヒアリング流れ）
11. **原稿オプション**（原稿作成サポート ¥15,000 / 本格コピー ¥30,000）

### 🔄 進行中（次にやること）

**Phase 2（実績がついたら）:** 下記「§11 値上げタイミング」参照

### ⏳ 未着手

- トップページ（`/`）の本格 LP 化
- テストスイート
- `deep-research-report.md` / `PROJECT.md` の Git コミット（ユーザー依頼時）

---

## 11. 値上げタイミング（将来用メモ）

> **いつ・何を上げるか** の目安。個人フリーランス / ココナラ出品の一般的な感覚 + 本プロジェクトの Phase 2 計画。
> 値上げは **一度に全部やらず、ベース → 知人割率** の順が安全。

### 現在地（2026-05）

| 指標 | 状態 |
|---|---|
| 公開実績 | 2件（自分 + 先輩） |
| 料金フェーズ | **Phase 1**（ベース現行・オプション A 寄り） |
| 知人割 | 45% / 10% |

### 段階別の目安

| フェーズ | 目安条件（だいたいこうなったら） | やること | 小規模ベース目安 |
|---|---|---|---|
| **Phase 1（今）** | 実績 0〜5件、ココナラレビュー少ない | ベース **40/50/60 維持**。オプションは相場に合わせて調整済み | ¥50,000 |
| **Phase 1.5** | 納品 **3〜5件** / ココナラ **★4.5以上・3件以上** / 問い合わせが月1件以上 | ベースを **+5,000〜10,000**（Pattern A: 45/55/70） | ¥55,000 |
| **Phase 2** | 納品 **5〜10件** / レビュー **5件以上** / 紹介案件が全体の **2〜3割** | ベース **Pattern B**（55/70/90）。知人割 **35%** に変更 | ¥70,000 |
| **Phase 3** | 納品 **10件以上** / 待ち案件あり / 直受注メイン | Pattern B〜C。パック価格も **10〜15%** 上方。保守・CMS は維持 or 微増 | ¥70,000〜 |

### 「みんな値上げする」感覚の目安

フリーランス・ココナラ出品者が**初めて値上げしやすいタイミング**は、だいたい次のどれかが揃ったときです。

1. **レビュー 5件前後** — 星4.8前後だと「安いのに質が高い」状態から抜け出しやすい
2. **同じ内容の案件を2回以上こなした** — 工数見積もりが安定し、値上げ理由を説明できる
3. **紹介・リピートが1件以上** — 市場価格より安いと紹介が止まらなくなるサイン
4. **スケジュールが2ヶ月先まで埋まり始めた** — 需要 > 供給
5. **ココナラで同ジャンルより明らかに安い** — 比較一覧で下位20%に入っている

**まだ早いサイン（値上げ待ち）:**

- レビュー 0〜2件
- ポートフォリオが2サイトのみ
- ココナラで比較されて「なぜ高い？」と言われる（説明材料が足りない）

### Phase 2 で `pricing.ts` に入れる数値（参照）

`deep-research-report.md` Pattern B「最終推奨」より:

- 小規模ベース: **¥70,000**
- 知人割（制作+オプション）: **35% OFF**
- 知人割（公開+保守）: **5% OFF**
- その他オプション: Pattern B 表を参照

### 値上げ時のやり方

1. `pricing.ts` を更新
2. `estimateGuide.ts` の LUXE 説明・パック目安価格を更新
3. **既存のココナラ出品**は旧価格で受けた案件を優先（新価格は新規のみ）
4. サイト・出品文に「2026年◯月より改定」と1行書く
5. `PROJECT.md` の「現在地」表を更新

---

## 7. 開発・デプロイ手順

```powershell
cd c:\Users\tulip-mouse\Desktop\LP_howmatch
npm install
npm run dev          # ローカル http://localhost:3000/estimate
npm run build        # 型チェック + 本番ビルド（PR前に必須）
```

```powershell
git add .
git commit -m "メッセージ"
git push             # → Vercel 自動デプロイ（1〜2分）
```

### Git author（設定済み）

- `user.name` = Kosei0128
- `user.email` = Kosei0128@users.noreply.github.com
- `gh` CLI で push 認証

### 注意

- ブラウザ **localStorage** に古い料金表が残ることがある → UI の「料金表を初期値に戻す」
- **コミットはユーザー明示依頼時のみ**（ユーザールール）
- テストスイートなし。変更後は `npm run build` で確認

---

## 8. Cursor / AI 向けメモ

### Cursor 設定（リポジトリ内）

- `.cursor/settings.json` — `cursor-team-kit` プラグイン有効
- **プロジェクト固有の `.cursor/rules/` は未作成**（ユーザー側のグローバルルール + team-kit ルールが適用される想定）

### AI が作業するときの優先順位

1. 本ファイル（`PROJECT.md`）と `deep-research-report.md` を読む
2. 料金変更 → `pricing.ts` のみ。文言 → `estimateGuide.ts` のみ
3. スコープ最小限。依頼外のリファクタ・テスト追加はしない
4. 完了後 `npm run build` で確認
5. push はユーザーが依頼したときだけ

### よくある罠

| 罠 | 対処 |
|---|---|
| リセットで ¥166,000 になる | 旧仕様。現在は `createEmptyEstimateInput()` で ¥0 |
| 画面の単価が `pricing.ts` と違う | localStorage のカスタム料金表を確認 |
| 明細が見切れる | 右カラムは `min-w-0`。`< lg` はカード、 `lg+` は fluid table |
| `EstimateBreakdown` 型とコンポーネント名が衝突 | コンポーネントは `EstimateBreakdownPanel` として import |

---

## 9. 関連ファイル一覧

| ファイル | 内容 |
|---|---|
| `PROJECT.md` | 本ドキュメント（進行・引き継ぎ） |
| `deep-research-report.md` | 市場調査・ギャップ分析・改定案 A/B/C・ココナラ戦略 |
| `src/config/pricing.ts` | 現行料金 |
| `src/config/estimateGuide.ts` | 全 UI 文言（`content` = 原稿説明） |
| `src/components/estimate/ContentWorkflowSection.tsx` | 原稿・文章 UI |

---

## 10. 次セッションで最初にやること（チェックリスト）

```
[ ] Phase 2: ベース料金 B 案・知人割 35%（実績5件〜で検討）
[ ] ココナラ出品文・サムネイル作成
[ ] npm run build
[ ] git commit & push（ユーザー依頼時）
[ ] （任意）トップページ LP 化
```

---

*このファイルはプロジェクトの状態が変わったら AI / 開発者が更新すること。*
