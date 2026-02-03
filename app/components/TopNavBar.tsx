"use client";

import Image from "next/image";

export function TopNavbar() {
  return (
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
            <a href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Care Finder Logo"
                height={32}
                width={32}
                className="h-8 w-8 shrink-0"
              />
            </a>
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
              About Us
            </a>
            <a className="hover:text-[#415d43]" href="#">
              Blogs
            </a>
            <a className="hover:text-[#415d43]" href="#">
              Contact Us
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
