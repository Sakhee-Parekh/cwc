"use client";

import * as React from "react";
import {
  Search,
  ArrowLeft,
  Compass,
  MapPin,
  UserRound,
  HeartHandshake,
} from "lucide-react";
import type { Provider } from "../lib/providers";
import { ProvidersTable } from "./ProvidersTable";
import Image from "next/image";

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
  const [mode, setMode] = React.useState<"entry" | "results">("entry");
  const [what, setWhat] = React.useState("");
  const [where, setWhere] = React.useState("");

  const [appliedQuery, setAppliedQuery] = React.useState("");
  const [tableKey, setTableKey] = React.useState(0);

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

  function startSearch(nextQuery: string) {
    const q = (nextQuery ?? "").trim();
    setAppliedQuery(q);
    setMode("results");
    setTableKey((k) => k + 1);
  }

  function submitCombined(e: React.FormEvent) {
    e.preventDefault();
    const combined = [what, where]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(" ");
    startSearch(combined);
  }

  if (mode === "entry") {
    return (
      <main className="min-h-dvh w-full">
        <section className="min-h-dvh bg-[#0F241B]">
          <div className="relative min-h-dvh">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(900px circle at 18% 18%, rgba(181,201,154,.30) 0%, transparent 55%)," +
                  "radial-gradient(900px circle at 82% 26%, rgba(113,131,85,.22) 0%, transparent 55%)," +
                  "linear-gradient(180deg, rgba(233,245,219) 0%, rgba(207,225,185) 100%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.10]"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(113,131,85,.75) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />

            <div className="relative z-20 px-4 pt-4 sm:pt-6">
              <div
                className="
                  mx-auto
                  w-full max-w-3xl
                  rounded-full
                  border border-white/20
                  bg-white/70
                  px-4 py-2
                  shadow-lg
                  backdrop-blur-md
                "
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="Care Finder Logo"
                      height={32}
                      width={32}
                      className="h-8 w-8 shrink-0"
                    />
                    <div className="hidden sm:flex min-w-0 flex-col text-xs font-semibold text-[#415d43] leading-tight">
                      <span className="truncate">Community</span>
                      <span className="truncate">Wellness Collective</span>
                    </div>
                  </div>

                  <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-[#415d43]/80">
                    <a className="hover:text-[#415d43]" href="#">
                      Home
                    </a>
                    <a className="hover:text-[#415d43]" href="#">
                      Resources
                    </a>
                    <a className="hover:text-[#415d43]" href="#">
                      About
                    </a>
                  </nav>

                  <button
                    type="button"
                    onClick={() => startSearch("")}
                    className="
                      inline-flex items-center gap-2
                      rounded-full bg-[#709775]
                      px-4 py-2
                      text-sm font-medium text-white
                      shadow-sm
                      hover:bg-[#5f8762]
                      active:scale-[0.98]
                      whitespace-nowrap
                    "
                  >
                    <Compass className="h-4 w-4" />
                    Browse
                  </button>
                </div>
              </div>
            </div>

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
                  Search by service, location, language, or access needs — then
                  open a provider to call, copy contact info, or get directions.
                </p>

                <form
                  onSubmit={submitCombined}
                  className="
                    mx-auto mt-7 w-full max-w-4xl
                    rounded-3xl sm:rounded-full
                    bg-white p-2
                    shadow-xl ring-1 ring-black/5
                  "
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B8477]" />
                      <input
                        value={what}
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
                      className="
                        inline-flex items-center justify-center
                        rounded-2xl sm:rounded-full
                        bg-[#709775]
                        px-6 py-3
                        text-sm font-semibold text-white
                        shadow-sm
                        hover:bg-[#5f8762]
                        active:scale-[0.99]
                        w-full sm:w-auto
                      "
                    >
                      Search
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
                        onClick={() => {
                          setWhat(chip);
                          setWhere("");
                          startSearch(chip);
                        }}
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
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] space-y-4 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMode("entry")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-zinc-50 active:scale-[0.99]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="text-sm text-zinc-600">
            {appliedQuery ? (
              <>
                Results for{" "}
                <span className="font-semibold text-zinc-900">
                  {appliedQuery}
                </span>
              </>
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-zinc-900">
                  all providers
                </span>
              </>
            )}
          </div>
        </div>

        <div className="text-sm text-zinc-500">
          {data.length} providers • Last synced {syncedLabel}
        </div>
      </div>

      <ProvidersTable key={tableKey} data={data} initialQuery={appliedQuery} />
    </main>
  );
}
