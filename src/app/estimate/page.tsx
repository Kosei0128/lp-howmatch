import { EstimateCalculator } from "@/components/estimate/EstimateCalculator";
import Link from "next/link";

export default function EstimatePage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="estimate-page-shell mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <header className="mb-8 space-y-3 sm:mb-10">
          <Link
            href="/"
            className="inline-flex min-h-10 items-center text-sm text-neutral-500 transition hover:text-neutral-900"
          >
            ← トップへ
          </Link>
          <h1 className="font-en text-2xl font-medium tracking-tight sm:text-3xl">
            Web制作 見積シミュレーター
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
            Webサイト制作の見積もりを、その場で試算できるツールです。
            項目ごとに説明を付けているので、初めての方でも内容を確認しながら選べます。
            選択を変えると右の合計がすぐ更新されます。
          </p>
        </header>

        <EstimateCalculator />

        <footer className="mt-12 rounded-2xl border border-neutral-200 bg-white p-4 text-sm leading-relaxed text-neutral-600 sm:mt-16 sm:p-6">
          <p>表示価格は目安です。正式見積はヒアリング後に確定します。</p>
          <p className="mt-2">
            初回制作の特別価格（¥40,000）は参考事例であり、通常見積には含みません。
          </p>
        </footer>
      </div>
    </main>
  );
}
