"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNavbar() {
  const pathname = usePathname();
  const isAssistant = pathname?.startsWith("/assistant");

  return (
    <div className="relative z-20">
      <div className="mx-auto flex w-full max-w-[1300px] items-center justify-between gap-4 px-4 py-5 sm:px-8 sm:py-6">
        <Link href="/" className="flex min-w-0 items-center gap-3 text-[var(--foreground)] sm:gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-white shadow-[0_12px_28px_rgba(79,118,97,0.12)] sm:h-14 sm:w-14">
            <Image
              src="/logo.png"
              alt="Community Wellness Collective logo"
              height={40}
              width={40}
              className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
            />
          </div>

          <div className="min-w-0">
            <div className="cwc-kicker truncate text-[0.62rem] text-[var(--muted)] sm:text-[0.7rem]">
              Community Wellness Collective
            </div>
            <div className="cwc-display truncate text-[1.55rem] leading-none text-[var(--foreground)] sm:text-[1.85rem]">
              Navigate Cancer
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="flex rounded-full border border-[var(--sage-medium)] bg-[var(--sage-light)] p-1.5 shadow-[0_14px_34px_rgba(79,118,97,0.14)]">
            <Link
              href="/"
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
                isAssistant
                  ? "bg-transparent text-[var(--foreground)] hover:text-[var(--accent)]"
                  : "bg-[var(--accent)] !text-white shadow-[0_10px_24px_rgba(79,118,97,0.22)]"
              }`}
            >
              Directory
            </Link>
            <Link
              href="/assistant"
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
                isAssistant
                  ? "bg-[var(--accent)] !text-white shadow-[0_10px_24px_rgba(79,118,97,0.22)]"
                  : "bg-transparent text-[var(--foreground)] hover:text-[var(--accent)]"
              }`}
            >
              Ask CWC
            </Link>
          </nav>

          <a
            href="https://mycwc.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
          >
            Visit mycwc.org
          </a>
        </div>
      </div>

      <div className="mx-auto h-px w-[calc(100%-2rem)] max-w-[1236px] bg-[var(--sage-medium)] sm:w-[calc(100%-4rem)]" />
    </div>
  );
}
