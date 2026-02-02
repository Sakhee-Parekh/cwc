import { NextResponse } from "next/server";
import Papa from "papaparse";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3e-AIJYp3_64kJWKtrPRxYDvHRLaU3yxXklGiX_dlKBgX9_QJkQHccuPIjcr918IZAKuqAyoXViFh/pub?gid=0&single=true&output=csv";

export async function GET() {
  const res = await fetch(CSV_URL, { cache: "no-store" });
  const text = await res.text();

  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  return NextResponse.json(parsed.data);
}
