import Papa from "papaparse";
import { cache } from "react";
import type { Provider } from "./providers";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3e-AIJYp3_64kJWKtrPRxYDvHRLaU3yxXklGiX_dlKBgX9_QJkQHccuPIjcr918IZAKuqAyoXViFh/pub?gid=0&single=true&output=csv";

export const getProvidersData = cache(async () => {
  const res = await fetch(CSV_URL, { cache: "no-store" });
  const text = await res.text();

  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  const data = parsed.data as Provider[];

  const syncedAtISO = new Date().toISOString();

  return { data, syncedAtISO };
});
