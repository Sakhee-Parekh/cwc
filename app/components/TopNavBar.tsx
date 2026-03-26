"use client";

import Image from "next/image";
import Link from "next/link";

export function TopNavbar() {
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

        <div className="hidden items-center gap-5 lg:flex">
          {/* <nav className="flex items-center gap-7 text-[0.95rem] font-medium text-[var(--foreground)]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-150 hover:text-[var(--accent)]"
              >
                {link.label}
              </a>
            ))}
          </nav> */}

          <a
            href="https://mycwc.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="cwc-button-primary inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
          >
            Visit mycwc.org
          </a>
        </div>
      </div>

      <div className="mx-auto h-px w-[calc(100%-2rem)] max-w-[1236px] bg-[var(--sage-medium)] sm:w-[calc(100%-4rem)]" />
    </div>
  );
}
