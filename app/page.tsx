import Papa from "papaparse";
import { ProvidersTable } from "./components/ProvidersTable";
import type { Provider } from "./lib/providers";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3e-AIJYp3_64kJWKtrPRxYDvHRLaU3yxXklGiX_dlKBgX9_QJkQHccuPIjcr918IZAKuqAyoXViFh/pub?gid=0&single=true&output=csv";

export default async function Page() {
  const res = await fetch(CSV_URL, { cache: "no-store" });
  const text = await res.text();

  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  const data = parsed.data as Provider[];

  return (
    <main className="space-y-4">
      {/* database meta row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">
            Provider database
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {data.length} providers • Published Google Sheet
          </p>
        </div>

        <div className="text-xs text-zinc-500">
          Tip: use search + filters to narrow results
        </div>
      </div>

      {/* surface */}
      <section className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="p-4 sm:p-6">
          <ProvidersTable data={data} />
        </div>
      </section>
    </main>
  );
}
