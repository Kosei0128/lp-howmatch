import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="font-en text-2xl font-medium tracking-tight">
        Web制作 LP
      </h1>
      <Link
        href="/estimate"
        className="rounded-full border border-neutral-900 px-6 py-3 text-sm transition hover:bg-neutral-900 hover:text-white"
      >
        制作見積シミュレーター
      </Link>
    </main>
  );
}
