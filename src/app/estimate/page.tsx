import { EstimateCalculator } from "@/components/estimate/EstimateCalculator";
import Link from "next/link";

export default function EstimatePage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <header className="mb-10 space-y-3">
          <Link
            href="/"
            className="text-sm text-neutral-500 transition hover:text-neutral-900"
          >
            ← トップへ
          </Link>
          <h1 className="font-en text-3xl font-medium tracking-tight">
            Web制作 見積シミュレーター
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
            ページ数・オプション・写真代行・公開・保守を選ぶと、金額が即座に更新されます。
            先輩・知人割トグルで Before / After をその場で確認できます。
          </p>
        </header>

        <EstimateCalculator />

        <footer className="mt-16 rounded-lg border border-neutral-200 bg-white p-6 text-sm leading-relaxed text-neutral-600">
          <p>
            表示価格は目安です。正式見積はヒアリング後に確定します。
          </p>
          <p className="mt-2">
            初回制作の特別価格（¥40,000）は参考事例であり、通常見積には含みません。
          </p>
          {/*
            料金カスタマイズ: src/config/pricing.ts の数値を編集してください。
            計算ロジック: src/lib/calculateEstimate.ts
            変更ファイル: app/estimate/page.tsx, components/estimate/*, config/pricing.ts, lib/calculateEstimate.ts
          */}
        </footer>
      </div>
    </main>
  );
}
