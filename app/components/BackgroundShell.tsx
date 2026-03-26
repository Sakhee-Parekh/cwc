"use client";
import * as React from "react";

export function BackgroundShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full overflow-hidden">
      <section className="min-h-dvh">
        <div className="relative min-h-dvh bg-[var(--background)]">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[10rem] sm:h-[11rem]"
            style={{
              background:
                "linear-gradient(180deg, rgba(194,220,208,0.28) 0%, rgba(194,220,208,0.06) 74%, rgba(255,255,255,0) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[18rem] sm:h-[20rem]"
            style={{
              background:
                "radial-gradient(60% 70% at 12% 0%, rgba(194,220,208,0.26) 0%, transparent 62%), radial-gradient(34% 56% at 88% 12%, rgba(194,220,208,0.18) 0%, transparent 60%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-[5rem] h-[16rem] opacity-[0.45] sm:top-[6rem] sm:h-[18rem]"
            style={{
              background:
                "radial-gradient(34rem 18rem at 12% 14%, rgba(104,136,113,0.08) 0%, transparent 62%), radial-gradient(30rem 16rem at 88% 10%, rgba(104,136,113,0.06) 0%, transparent 60%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(42rem 20rem at 15% 30%, rgba(194,220,208,0.16) 0%, transparent 65%), radial-gradient(34rem 18rem at 85% 24%, rgba(194,220,208,0.14) 0%, transparent 62%)",
            }}
          />
          <div className="h-full relative z-10">{children}</div>
        </div>
      </section>
    </main>
  );
}
