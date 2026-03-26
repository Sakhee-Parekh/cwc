"use client";

import * as React from "react";
import { HeartHandshake, MapPin, Search, UserRound } from "lucide-react";
import type { Provider } from "../lib/providers";
import { useRouter } from "next/navigation";
import { BackgroundShell } from "./BackgroundShell";
import { TopNavbar } from "./TopNavBar";

function buildTopCategoryChips(data: Provider[], limit = 10) {
  const counts = new Map<string, number>();

  for (const p of data) {
    const raw = p["Categories"] || "";
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((c) => counts.set(c, (counts.get(c) ?? 0) + 1));
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label]) => label);
}

export default function ProvidersExperience({
  data,
  syncedAtISO,
}: {
  data: Provider[];
  syncedAtISO: string;
}) {
  const syncedLabel = React.useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(syncedAtISO)),
    [syncedAtISO],
  );

  const router = useRouter();

  const [what, setWhat] = React.useState("");
  const [where, setWhere] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const topCategories = React.useMemo(
    () => buildTopCategoryChips(data, 10),
    [data],
  );

  const quickChips = React.useMemo(() => {
    const access = [
      "Financial Assistance",
    ];
    const merged = [...topCategories, ...access];
    return Array.from(new Set(merged)).slice(0, 14);
  }, [topCategories]);

  function goToSearch(whatValue: string, whereValue: string) {
    setIsSearching(true);

    const whatQ = (whatValue ?? "").trim();
    const whereQ = (whereValue ?? "").trim();

    const params = new URLSearchParams();
    if (whatQ) params.set("what", whatQ);
    if (whereQ) params.set("where", whereQ);

    router.push(`/search?${params.toString()}`);
  }

  function submitCombined(e: React.FormEvent) {
    e.preventDefault();
    goToSearch(what, where);
  }

  return (
    <BackgroundShell>
      <TopNavbar />

      <div className="relative z-10 px-4 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10">
        <div className="mx-auto w-full max-w-[1300px]">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white/90 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--accent)] shadow-sm">
              <HeartHandshake className="h-4 w-4" />
              A guided path to wellness
            </div>

            <h1 className="cwc-display mx-auto mt-6 max-w-5xl text-balance text-[2.9rem] leading-[0.95] text-[var(--foreground)] sm:text-[4.4rem]">
              Clear, Compassionate Guidance for your Cancer Journey.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-pretty text-base leading-7 text-[var(--muted)] sm:text-lg">
              A guided pathway through prevention, diagnosis, treatment, monitoring, and financial decisions. Wherever you are in the process, you do not have to navigate this journey alone.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-[1080px] rounded-[2rem] cwc-panel-strong p-4 sm:p-5">
            <form onSubmit={submitCombined}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--accent)]" />
                  <input
                    value={what}
                    disabled={isSearching}
                    onChange={(e) => setWhat(e.target.value)}
                    placeholder='Category? ("therapy", "transportation", etc.)'
                    className="cwc-input min-h-14 rounded-[1.35rem] py-4 pl-[3.25rem] pr-4 text-[0.96rem] lg:rounded-full"
                    autoFocus
                  />
                </div>

                <div className="relative flex-1">
                  <MapPin className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--accent)]" />
                  <input
                    value={where}
                    disabled={isSearching}
                    onChange={(e) => setWhere(e.target.value)}
                    placeholder='Where? (city, region, or "telehealth")'
                    className="cwc-input min-h-14 rounded-[1.35rem] py-4 pl-[3.25rem] pr-4 text-[0.96rem] lg:rounded-full"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="cwc-button-primary inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[1.35rem] px-7 py-4 text-sm font-semibold tracking-[0.08em] uppercase lg:w-auto lg:rounded-full disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSearching ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Searching...
                    </>
                  ) : (
                    "Search the directory"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-col gap-2 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
              <span>{data.length} providers available</span>
              <span>Last synced {syncedLabel}</span>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-[1080px]">
            {/* <div className="mb-3 pl-2 text-left text-sm font-medium text-[var(--foreground)]">
              Popular searches
            </div> */}
            <div
              className="
                flex gap-2 overflow-x-auto pb-2 sm:justify-center
                [-ms-overflow-style:none] [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                sm:flex-wrap sm:overflow-visible sm:pb-0
              "
            >
              {quickChips.slice(0, 12).map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => goToSearch(chip, "")}
                  className="cwc-button-secondary inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap active:scale-[0.99]"
                >
                  <UserRound className="h-4 w-4" />
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BackgroundShell>
  );
}
