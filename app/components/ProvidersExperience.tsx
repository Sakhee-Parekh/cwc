"use client";

import * as React from "react";
import {
  Search,
  Compass,
  MapPin,
  UserRound,
  HeartHandshake,
} from "lucide-react";
import type { Provider } from "../lib/providers";
import Image from "next/image";
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
  syncedLabel,
}: {
  data: Provider[];
  syncedLabel: string;
}) {
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
      "Telehealth",
      "Financial Assistance",
      "Transportation",
      "Interpreters",
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
      <div className="relative z-10 px-4 pb-10 pt-10 sm:px-10 sm:pb-16 sm:pt-14">
        <div className="mx-auto w-full max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#415d43]/85 ring-1 ring-white/15">
            <HeartHandshake className="h-4 w-4" />
            Guidance, when you need it
          </div>

          <h1 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.02em] text-[#415d43] sm:text-6xl">
            Find care and support that is right for you
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm text-[#415d43]/75 sm:text-base">
            Search by service, location, language, or access needs — then open a
            provider to call, copy contact info, or get directions.
          </p>

          <form
            onSubmit={submitCombined}
            className="
              mx-auto mt-7 w-full max-w-4xl
              rounded-3xl sm:rounded-full
              bg-white/90 p-2
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
                  autoFocus
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
                  hover:bg-[#5a7f63]
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

          <div className="mt-3 text-xs text-[#415d43]/60">
            {data.length} providers available • Last synced {syncedLabel}
          </div>

          <div className="mx-auto mt-6 w-full max-w-4xl">
            <div
              className="
                flex gap-2
                overflow-x-auto
                pb-2
                [-ms-overflow-style:none] [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0
              "
            >
              {quickChips.slice(0, 12).map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => goToSearch(chip, "")}
                  className="
                    inline-flex shrink-0 items-center gap-2
                    rounded-full
                    bg-white/70
                    px-4 py-2
                    text-sm font-semibold text-[#415d43]/85
                    ring-1 ring-white/15
                    hover:bg-white/55
                    active:scale-[0.99]
                    whitespace-nowrap
                  "
                >
                  <UserRound className="h-4 w-4 text-[#415d43]/80" />
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="h-10 sm:h-0" />
        </div>
      </div>
    </BackgroundShell>
  );
}
