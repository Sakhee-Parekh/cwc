import Papa from "papaparse";
import type { Provider } from "./lib/providers";
import ProvidersExperience from "./components/ProvidersExperience";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3e-AIJYp3_64kJWKtrPRxYDvHRLaU3yxXklGiX_dlKBgX9_QJkQHccuPIjcr918IZAKuqAyoXViFh/pub?gid=0&single=true&output=csv";

export default async function Page() {
  const res = await fetch(CSV_URL, { cache: "no-store" });
  const text = await res.text();

  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  const data = parsed.data as Provider[];

  const syncedAtISO = new Date().toISOString();
  const syncedLabel = new Date(syncedAtISO).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return <ProvidersExperience data={data} syncedLabel={syncedLabel} />;
}
