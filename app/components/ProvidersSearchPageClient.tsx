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
  syncedLabel,
  whatParam,
  whereParam,
}: {
  data: Provider[];
  syncedLabel: string;
  whatParam: string;
  whereParam: string;
}) {
  const router = useRouter();

  const [what, setWhat] = React.useState(whatParam || "");
  const [where, setWhere] = React.useState(whereParam || "");
  const [isSearching, setIsSearching] = React.useState(false);

  React.useEffect(() => {
    setWhat(whatParam || "");
  }, [whatParam]);

  React.useEffect(() => {
    setWhere(whereParam || "");
  }, [whereParam]);

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
    )
      return;
    pushParams(what, where);
  }

  const combinedQuery = [whatParam, whereParam]
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join(" ");

  return (
    <BackgroundShell>
      <TopNavbar />
      <div className="px-4 pt-4 mx-auto max-w-[1440px]">
        <div className="rounded-3xl bg-white/60 shadow-lg ring-1 ring-black/5 backdrop-blur-md">
          <div className="flex flex-col gap-3 p-3 sm:p-4">
            <form
              onSubmit={submitCombined}
              className="
                  w-full
                  rounded-3xl sm:rounded-full
                  bg-white/30 p-2
                  shadow-xl ring-1 ring-black/5
                "
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B8477]" />
                  <input
                    value={what}
                    disabled={isSearching}
                    onChange={(e) => setWhat(e.target.value)}
                    placeholder='How can we help? (e.g. "therapy", "support group")'
                    className="
                        w-full
                        rounded-2xl sm:rounded-full
                        bg-transparent
                        py-3 pl-12 pr-4
                        text-sm text-[#0F241B]
                        outline-none
                        placeholder:text-[#7A9285]
                      "
                  />
                </div>

                <div className="relative flex-1">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B8477]" />
                  <input
                    value={where}
                    disabled={isSearching}
                    onChange={(e) => setWhere(e.target.value)}
                    placeholder='Where? (city, region, or "telehealth")'
                    className="
                        w-full
                        rounded-2xl sm:rounded-full
                        bg-transparent
                        py-3 pl-12 pr-4
                        text-sm text-[#0F241B]
                        outline-none
                        placeholder:text-[#7A9285]
                      "
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-2xl sm:rounded-full
                    bg-[#709775]
                    px-6 py-3
                    text-sm font-semibold text-white
                    shadow-sm
                    hover:bg-[#5f8762]
                    active:scale-[0.99]
                    w-full sm:w-auto
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                "
                >
                  {isSearching ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Searching…
                    </>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </form>

            <div className="text-sm text-[#415d43]/80 px-1">
              {combinedQuery ? (
                <>
                  Results for{" "}
                  <span className="font-semibold text-[#415d43]">
                    {combinedQuery}
                  </span>
                </>
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-[#415d43]">
                    all providers
                  </span>
                </>
              )}
            </div>
            <div className="text-xs text-[#415d43]/60 px-1">
              {data.length} providers • Last synced {syncedLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-10 pt-4 sm:pt-6 mx-auto max-w-[1440px]">
        <div className="rounded-3xl bg-white/40 shadow-xl ring-1 ring-black/5 backdrop-blur-md p-3 sm:p-4">
          <ProvidersTable
            data={data}
            initialQuery={combinedQuery}
            showSearch={false}
          />
        </div>
      </div>
    </BackgroundShell>
  );
}
