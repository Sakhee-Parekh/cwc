"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import type { Provider } from "../lib/providers";
import { ProvidersTable } from "./ProvidersTable";
import { BackgroundShell } from "./BackgroundShell";
import { TopNavbar } from "./TopNavBar";

export default function ProvidersSearchPageClient({
  data,
  syncedAtISO,
  whatParam,
  whereParam,
}: {
  data: Provider[];
  syncedAtISO: string;
  whatParam: string;
  whereParam: string;
}) {
  const router = useRouter();
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

  const [what, setWhat] = React.useState(whatParam || "");
  const [where, setWhere] = React.useState(whereParam || "");
  const [isSearching, setIsSearching] = React.useState(false);
  const [filteredCount, setFilteredCount] = React.useState(data.length);

  React.useEffect(() => {
    setWhat(whatParam || "");
  }, [whatParam]);

  React.useEffect(() => {
    setWhere(whereParam || "");
  }, [whereParam]);

  React.useEffect(() => {
    setFilteredCount(data.length);
  }, [data.length]);

  function pushParams(nextWhat: string, nextWhere: string) {
    setIsSearching(true);

    const w = (nextWhat ?? "").trim();
    const loc = (nextWhere ?? "").trim();

    const params = new URLSearchParams();
    if (w) params.set("what", w);
    if (loc) params.set("where", loc);

    router.push(`/search?${params.toString()}`);
  }

  React.useEffect(() => {
    setIsSearching(false);
  }, [whatParam, whereParam]);

  function submitCombined(e: React.FormEvent) {
    e.preventDefault();
    if (
      what.trim() === (whatParam ?? "").trim() &&
      where.trim() === (whereParam ?? "").trim()
    ) {
      return;
    }
    pushParams(what, where);
  }

  const combinedQuery = [whatParam, whereParam]
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join(" ");

  return (
    <BackgroundShell>
      <TopNavbar />
      <div className="relative z-10 px-4 pb-5 pt-8 sm:px-8 sm:pt-10">
        <div className="mx-auto max-w-[1300px]">
          <div className="max-w-4xl">
            <div className="cwc-kicker text-[var(--accent)]">Navigate Cancer</div>
            <h1 className="cwc-display mt-3 text-balance text-[2.4rem] leading-[0.98] text-[var(--foreground)] sm:text-[3.5rem]">
              Search results
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">
              Search the directory below, then click on any provider for contact
              details, care information, and access support.
            </p>
          </div>

          <div className="mt-8 rounded-[2rem] cwc-panel-strong p-4 sm:p-5">
            <form onSubmit={submitCombined}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--accent)]" />
                  <input
                    value={what}
                    disabled={isSearching}
                    onChange={(e) => setWhat(e.target.value)}
                    placeholder='How can we help? (for example "therapy")'
                    className="cwc-input min-h-14 rounded-[1.35rem] py-4 pl-[3.25rem] pr-4 text-[0.96rem] lg:rounded-full"
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
                    "Update search"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-col gap-2 border-t border-[var(--border)] pt-4 text-sm leading-6 text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
              <div>
                {combinedQuery ? (
                  <>
                    <span className="font-semibold text-[var(--foreground)]">
                      {filteredCount}
                    </span>{" "}
                    Results for{" "}
                    <span className="font-semibold text-[var(--foreground)]">
                      {combinedQuery}
                    </span>
                  </>
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-[var(--foreground)]">
                      all providers
                    </span>
                    {" "}
                    <span className="text-[var(--muted)]">
                      ({filteredCount} total)
                    </span>
                  </>
                )}
              </div>
              <div>
                {data.length} providers | Last synced {syncedLabel}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 pb-12 pt-3 sm:px-8 sm:pb-16">
        <div className="mx-auto max-w-[1300px] rounded-[2rem] cwc-panel-strong p-3 sm:p-4">
          <ProvidersTable
            data={data}
            initialQuery={combinedQuery}
            onFilteredCountChange={setFilteredCount}
            showSearch={false}
          />
        </div>
      </div>
    </BackgroundShell>
  );
}
