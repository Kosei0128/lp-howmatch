import { EstimateCalculator } from "@/components/estimate/EstimateCalculator";
import { estimateCopy } from "@/config/estimateGuide";
import Link from "next/link";

export default function EstimatePage() {
  const { page } = estimateCopy;

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="estimate-page-shell mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <header className="mb-8 space-y-3 sm:mb-10">
          <Link
            href="/"
            className="inline-flex min-h-10 items-center text-sm text-neutral-500 transition hover:text-neutral-900"
          >
            {page.backLink}
          </Link>
          <h1 className="font-en text-2xl font-medium tracking-tight sm:text-3xl">
            {page.title}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
            {page.description}
          </p>
        </header>

        <EstimateCalculator />

        <footer className="mt-12 rounded-2xl border border-neutral-200 bg-white p-4 text-sm leading-relaxed text-neutral-600 sm:mt-16 sm:p-6">
          <p>{page.disclaimer}</p>
          <p className="mt-2">{page.specialPriceNote}</p>
        </footer>
      </div>
    </main>
  );
}
