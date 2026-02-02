"use client";
import * as React from "react";

export function BackgroundShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full">
      <section className="min-h-dvh">
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
          <div className="h-full relative z-10">{children}</div>
        </div>
      </section>
    </main>
  );
}
