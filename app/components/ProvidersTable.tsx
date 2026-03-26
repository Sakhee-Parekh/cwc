"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import Papa from "papaparse";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Phone,
  Search,
  SlidersHorizontal,
  Star,
  X,
  Building2,
  Globe,
  MapPin,
  Languages,
  Users,
  Stethoscope,
  ShieldCheck,
  StickyNote,
  Copy,
} from "lucide-react";

import type { Provider } from "../lib/providers";

const secondaryButtonClass =
  "cwc-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium active:scale-[0.99]";
const primaryButtonClass =
  "cwc-button-primary inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium active:scale-[0.99]";

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, [query]);

  return matches;
}

function ActionButton({
  icon,
  children,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  if (href) {
    return (
      <a
        className={secondaryButtonClass}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {icon}
        {children}
      </a>
    );
  }
  return (
    <button className={secondaryButtonClass} onClick={onClick} type="button">
      {icon}
      {children}
    </button>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-[0_12px_30px_rgba(45,39,31,0.06)]">
      <div className="flex items-center gap-2">
        <span className="text-[var(--accent)]">{icon}</span>
        <h4 className="text-sm font-semibold text-[var(--foreground)]">
          {title}
        </h4>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "info";
}) {
  const styles =
    tone === "good"
      ? "cwc-badge-good"
      : tone === "warn"
        ? "cwc-badge-warn"
        : tone === "info"
          ? "cwc-badge-info"
          : "cwc-badge";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        styles,
      )}
    >
      {children}
    </span>
  );
}

function ynTone(v: string): "neutral" | "good" | "warn" | "info" {
  const val = (v || "").trim().toUpperCase();
  if (val === "Y") return "good";
  if (val === "N") return "warn";
  return "neutral";
}

function parseRating(r: string) {
  const m = (r || "").match(/([0-9.]+)/);
  return m ? Number(m[1]) : null;
}

function formatPhoneHref(phone: string) {
  const cleaned = (phone || "").replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "#";
}

function exportRowsToCSV(rows: Provider[], filename = "providers-export.csv") {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const [portalEl, setPortalEl] = React.useState<HTMLDivElement | null>(null);

  // Create a dedicated portal mount at the end of <body>
  React.useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("data-portal", "cwc-modal");
    // Make SURE this mount is not affected by parent layout
    el.style.position = "relative";
    el.style.zIndex = "2147483647";
    document.body.appendChild(el);
    setPortalEl(el);

    return () => {
      document.body.removeChild(el);
      setPortalEl(null);
    };
  }, []);

  React.useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  if (!open || !portalEl) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        pointerEvents: "auto",
      }}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
        }}
      />
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 768,
            background: "var(--surface-strong)",
            border: "1px solid var(--border)",
            borderRadius: 28,
            boxShadow:
              "0 25px 50px -12px rgba(27,23,18,0.22), 0 0 0 1px rgba(87,77,61,0.08)",
            overflow: "hidden",
            height: "92vh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute",
              right: 16,
              top: 16,
              height: 36,
              width: 36,
              borderRadius: 9999,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--muted)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              zIndex: 1,
            }}
          >
            <X className="h-5 w-5" />
          </button>

          <div
            style={{
              padding: 20,
              paddingTop: 56,
              overflowY: "auto",
              height: "calc(92vh - 56px)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>,
    portalEl,
  );
}

function CallButton({
  phone,
  providerName,
}: {
  phone: string;
  providerName: string;
}) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const telHref = formatPhoneHref(phone);

  async function copy() {
    await navigator.clipboard.writeText(phone);
  }

  function stopPropagationOnly(e: React.SyntheticEvent) {
    e.stopPropagation();
  }

  function stopAll(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (isMobile) {
    return (
      <a
        href={telHref}
        onClick={(e) => stopPropagationOnly(e)}
        className={primaryButtonClass}
      >
        <Phone className="h-4 w-4" />
        Call
      </a>
    );
  }

  return (
    <>
      <button
        onMouseDown={(e) => stopAll(e)}
        onClick={(e) => {
          stopAll(e);
          setOpen(true);
        }}
        className={secondaryButtonClass}
      >
        <Phone className="h-4 w-4" />
        Call
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={`Call ${providerName}`}
      >
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Phone number
            </div>
            <div className="mt-1 text-lg font-semibold text-[var(--foreground)]">
              {phone}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={copy}
              className={primaryButtonClass}
            >
              Copy number
            </button>

            <a
              onClick={(e) => stopPropagationOnly(e)}
              href={telHref}
              className={secondaryButtonClass}
              title="May open FaceTime/Skype/phone app depending on your computer"
            >
              Try calling from this device
            </a>
          </div>

          <p className="text-sm text-[var(--muted)]">
            Tip: Paste the number into your phone dialer, or into an app like
            Google Voice if you use one.
          </p>
        </div>
      </Dialog>
    </>
  );
}

const columns: ColumnDef<Provider>[] = [
  {
    accessorKey: "Provider Name",
    header: "Provider",
    cell: ({ row }) => {
      const name = row.original["Provider Name"];
      const sys = row.original["System / Network Name"];
      return (
        <div className="min-w-0 break-words">
          <div className="font-medium text-[var(--foreground)]">{name}</div>
          <div className="mt-0.5 text-xs text-[var(--muted)]">{sys}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "Categories",
    header: "Categories",
    cell: ({ getValue }) => {
      const raw = String(getValue() || "");
      const parts = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);
      const extra =
        raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean).length - parts.length;

      return (
        <div className="flex flex-wrap gap-1.5">
          {parts.map((p) => (
            <Badge key={p} tone="info">
              {p}
            </Badge>
          ))}
          {extra > 0 ? <Badge>+{extra}</Badge> : null}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const raw = String(row.getValue(id) || "").toLowerCase();
      return String(value || "")
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .every((token) => raw.includes(token));
    },
  },
  {
    accessorKey: "Organization Type",
    header: "Type",
    cell: ({ getValue }) => (
      <span className="text-sm text-[color:var(--foreground)]">
        {String(getValue() || "")}
      </span>
    ),
  },
  {
    accessorKey: "Address",
    header: "Location",
    cell: ({ getValue }) => (
      <div className="min-w-0 break-words text-sm text-[color:var(--foreground)]">
        {String(getValue() || "")}
      </div>
    ),
  },
  {
    accessorKey: "Customer review rating",
    header: "Rating",
    cell: ({ getValue }) => {
      const r = parseRating(String(getValue() || ""));
      return (
        <div className="flex items-center gap-2">
          <span className="cwc-badge inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium">
            <Star className="h-3.5 w-3.5" />
            {r ?? "-"}
          </span>
        </div>
      );
    },
    sortingFn: (a, b, id) => {
      const ar = parseRating(String(a.getValue(id) || "")) ?? -1;
      const br = parseRating(String(b.getValue(id) || "")) ?? -1;
      return ar - br;
    },
  },
  {
    id: "Access",
    header: "Access",
    cell: ({ row }) => {
      const p = row.original;
      const y = (k: keyof Provider) => p[k] as string;

      return (
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            tone={
              ynTone(y("Availability of Professional Interpreters (Y/N)"))
            }
          >
            Interpreters:{y("Availability of Professional Interpreters (Y/N)")}
          </Badge>
          <Badge tone={ynTone(y("Telehealth (Y/N)"))}>
            Telehealth: {y("Telehealth (Y/N)")}
          </Badge>
          <Badge tone={ynTone(y("Financial Assistance (Y/N)"))}>
            Financial Aid: {y("Financial Assistance (Y/N)")}
          </Badge>
          <Badge tone={ynTone(y("Transportation (Y/N)"))}>
            Transportation: {y("Transportation (Y/N)")}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const url = row.original["Website URL"];
      const phone = row.original["Phone number"];
      return (
        <div className="flex flex-wrap justify-end gap-2">
          <a
            className={secondaryButtonClass}
            href={url}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            Website
          </a>
          {phone && phone !== "N/A" ? (
            <CallButton
              phone={phone}
              providerName={row.original["Provider Name"]}
            />
          ) : null}
        </div>
      );
    },
  },
];

function ProviderCard({
  p,
  onOpen,
}: {
  p: Provider;
  onOpen: (p: Provider) => void;
}) {
  const rating = parseRating(p["Customer review rating"]);
  const phone = p["Phone number"];
  const url = p["Website URL"];

  const cats = (p["Categories"] || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div
      className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_18px_36px_rgba(45,39,31,0.08)] active:scale-[0.99]"
      onClick={() => onOpen(p)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-[var(--foreground)]">
            {p["Provider Name"]}
          </div>
          <div className="mt-0.5 truncate text-sm text-[var(--muted)]">
            {p["System / Network Name"]}
          </div>
        </div>

        <span className="cwc-badge inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium">
          <Star className="h-3.5 w-3.5" />
          {rating ?? "-"}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {cats.map((c) => (
          <Badge key={c} tone="info">
            {c}
          </Badge>
        ))}
      </div>

      <div className="mt-3 text-sm text-[color:var(--foreground)]">
        <div
          className="text-sm text-[color:var(--foreground)]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {p["Address"]}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge
          tone={ynTone(p["Availability of Professional Interpreters (Y/N)"])}
        >
          Interpreters:{p["Availability of Professional Interpreters (Y/N)"]}
        </Badge>
        <Badge tone={ynTone(p["Telehealth (Y/N)"])}>
          Telehealth: {p["Telehealth (Y/N)"]}
        </Badge>
        <Badge tone={ynTone(p["Financial Assistance (Y/N)"])}>
          Aid: {p["Financial Assistance (Y/N)"]}
        </Badge>
        <Badge tone={ynTone(p["Transportation (Y/N)"])}>
          Transport: {p["Transportation (Y/N)"]}
        </Badge>
      </div>

      <div className="mt-4 flex gap-2">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`${secondaryButtonClass} flex-1`}
        >
          <ExternalLink className="h-4 w-4" />
          Website
        </a>

        {phone && phone !== "N/A" ? (
          <a
            href={formatPhoneHref(phone)}
            onClick={(e) => e.stopPropagation()}
            className={`${primaryButtonClass} flex-1`}
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(p);
            }}
            className={`${secondaryButtonClass} flex-1`}
          >
            Details
          </button>
        )}
      </div>
    </div>
  );
}

export function ProvidersTable({
  data,
  initialQuery,
  onFilteredCountChange,
  showSearch = true,
}: {
  data: Provider[];
  initialQuery?: string;
  onFilteredCountChange?: (count: number) => void;
  showSearch?: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "Customer review rating", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState(initialQuery ?? "");
  const prevInitialRef = React.useRef<string | undefined>(initialQuery);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      Address: true,
      "Organization Type": true,
      Categories: true,
      Access: true,
    });

  const [selected, setSelected] = React.useState<Provider | null>(null);
  const [columnsOpen, setColumnsOpen] = React.useState(false);

  const isMobile = useMediaQuery("(max-width: 640px)");

  React.useEffect(() => {
    if (prevInitialRef.current !== initialQuery) {
      const prev = prevInitialRef.current ?? "";
      if (globalFilter === prev) {
        setGlobalFilter(initialQuery ?? "");
      }
      prevInitialRef.current = initialQuery;
    }
  }, [initialQuery, globalFilter]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue || "")
        .toLowerCase()
        .trim();
      if (!q) return true;

      const hay = [
        row.original["Provider Name"],
        row.original["System / Network Name"],
        row.original["Organization Type"],
        row.original["Address"],
        row.original["Categories"],
        row.original["Services offered"],
        row.original["Primary Audience"],
        row.original["Notes for Indian / South Asian Patients"],
      ]
        .filter(Boolean)
        .join(" • ")
        .toLowerCase();

      return q
        .split(" ")
        .filter(Boolean)
        .every((token) => hay.includes(token));
    },
    initialState: { pagination: { pageSize: 10 } },
  });

  const filteredCount = table.getFilteredRowModel().rows.length;

  React.useEffect(() => {
    onFilteredCountChange?.(filteredCount);
  }, [filteredCount, onFilteredCountChange]);

  const visibleProviders = table.getRowModel().rows.map((r) => r.original);
  const filteredRows = table.getFilteredRowModel().rows.map((r) => r.original);

  return (
    <div className="space-y-4">
      {/* Header / Controls */}
      {(showSearch || !isMobile) && (
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="cwc-display text-2xl text-[var(--foreground)]"></h1>
            <p className="mt-1 text-sm text-[var(--muted)]"></p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {showSearch && (
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-3 h-4 w-4 text-[var(--accent)]" />
                <input
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search providers, location, services..."
                  className="cwc-input w-full rounded-full py-2.5 pl-11 pr-4 text-sm sm:w-[340px]"
                />
              </div>
            )}

            {!isMobile && (
              <button
                onClick={() => setColumnsOpen((v) => !v)}
                className={secondaryButtonClass}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Manage columns
                <ChevronDown className="h-4 w-4 text-[var(--muted)]" />
              </button>
            )}
            <button
              onClick={() => exportRowsToCSV(filteredRows)}
              className={primaryButtonClass}
            >
              Export filtered
            </button>
          </div>
        </div>
      )}

      {/* Column menu */}
      {columnsOpen ? (
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_16px_36px_rgba(45,39,31,0.08)]">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-[var(--foreground)]">Columns</div>
            <button
              onClick={() => setColumnsOpen(false)}
              className="rounded-full p-2 text-[var(--muted)] transition hover:bg-white/80 hover:text-[var(--foreground)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {table.getAllLeafColumns().map((col) => {
              const id = col.id;
              if (id === "actions") return null;
              return (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2 text-sm text-[color:var(--foreground)] transition hover:bg-[var(--sage-light)]"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[var(--accent)]"
                    checked={col.getIsVisible()}
                    onChange={col.getToggleVisibilityHandler()}
                  />
                  {id}
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Table */}
      {isMobile ? (
        <div className="space-y-3">
          {visibleProviders.map((p, idx) => (
            <ProviderCard
              key={`${p["Provider Name"]}-${idx}`}
              p={p}
              onOpen={setSelected}
            />
          ))}

          {visibleProviders.length === 0 ? (
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)] shadow-[0_16px_36px_rgba(45,39,31,0.08)]">
              No matches. Try adjusting your search.
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-3">
            <div className="text-sm text-[var(--muted)]">
              Showing{" "}
              <span className="font-medium text-[var(--foreground)]">
                {table.getRowModel().rows.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[var(--foreground)]">{data.length}</span>
            </div>

            <div className="flex items-center gap-2 whitespace-nowrap">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={`${secondaryButtonClass} disabled:opacity-50`}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <div className="text-sm text-[var(--muted)]">
                Page{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {table.getState().pagination.pageIndex + 1}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {table.getPageCount()}
                </span>
              </div>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={`${secondaryButtonClass} disabled:opacity-50`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] shadow-[0_18px_36px_rgba(45,39,31,0.08)]">
          <div className="max-h-[49vh] overflow-y-auto overflow-x-hidden rounded-[1.75rem] max-[1199px]:overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 rounded-[1.75rem] table-fixed max-[1199px]:min-w-[1200px] max-[1199px]:table-auto">
              <thead className="sticky top-0 z-10 bg-[var(--sage-medium)]">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const sortDir = header.column.getIsSorted();
                      const columnId = header.column.id;

                      return (
                        <th
                          key={header.id}
                          className={clsx(
                            "border-b border-[var(--border)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]",
                            columnId === "Provider Name" && "w-[22%]",
                            columnId === "Categories" && "w-[18%]",
                            columnId === "Organization Type" && "w-[10%]",
                            columnId === "Address" && "w-[17%]",
                            columnId === "Customer review rating" && "w-[7%]",
                            columnId === "Access" && "w-[15%]",
                            columnId === "actions" && "w-[11%]",
                            canSort &&
                              "cursor-pointer select-none hover:text-[var(--foreground)]",
                          )}
                          onClick={
                            canSort
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          <div className="flex items-center gap-2">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {sortDir ? (
                              <span className="text-[10px] text-[var(--muted)]">
                                {sortDir === "asc" ? "▲" : "▼"}
                              </span>
                            ) : null}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="group pointer-events-auto cursor-pointer transition hover:bg-[var(--sage-light)]"
                    onClick={() => setSelected(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border-b border-[var(--border)] px-4 py-3 align-top text-sm text-[color:var(--foreground)] whitespace-normal"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-sm text-[var(--muted)]"
                      colSpan={999}
                    >
                      No matches. Try adjusting your search.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-[var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[var(--muted)]">
              Showing{" "}
              <span className="font-medium text-[var(--foreground)]">
                {table.getRowModel().rows.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[var(--foreground)]">{data.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={`${secondaryButtonClass} disabled:opacity-50`}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <div className="text-sm text-[var(--muted)]">
                Page{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {table.getState().pagination.pageIndex + 1}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {table.getPageCount()}
                </span>
              </div>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={`${secondaryButtonClass} disabled:opacity-50`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.["Provider Name"] ?? "Provider"}
      >
        {selected ? (
          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="cwc-display flex-wrap text-lg text-[var(--foreground)]">
                    {selected["Provider Name"]}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                    {selected["System / Network Name"] ? (
                      <span className="inline-flex items-center gap-1">
                        <div className="h-4 w-4">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <span className="flex-wrap">
                          {selected["System / Network Name"]}
                        </span>
                      </span>
                    ) : null}
                    {selected["Organization Type"] ? (
                      <span className="inline-flex items-center gap-1">
                        <div className="h-4 w-4">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        {selected["Organization Type"]}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="cwc-badge inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium">
                  <Star className="h-4 w-4" />
                  <span>
                    {parseRating(selected["Customer review rating"]) ?? "-"}
                  </span>
                  <span className="font-normal text-[var(--muted)]">rating</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {selected["Website URL"] ? (
                  <ActionButton
                    href={selected["Website URL"]}
                    icon={<Globe className="h-4 w-4" />}
                  >
                    Website
                  </ActionButton>
                ) : null}

                {selected["Phone number"] &&
                selected["Phone number"] !== "N/A" ? (
                  <>
                    <CallButton
                      phone={selected["Phone number"]}
                      providerName={selected["Provider Name"]}
                    />
                    <ActionButton
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          selected["Phone number"],
                        );
                      }}
                      icon={<Copy className="h-4 w-4" />}
                    >
                      Copy phone
                    </ActionButton>
                  </>
                ) : null}

                {selected["Address"] ? (
                  <ActionButton
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selected["Address"],
                    )}`}
                    icon={<MapPin className="h-4 w-4" />}
                  >
                    Directions
                  </ActionButton>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Section title="Location" icon={<MapPin className="h-4 w-4" />}>
                {selected["Address"] ? (
                  <div className="text-sm text-[color:var(--foreground)]">
                    {selected["Address"]}
                  </div>
                ) : (
                  <div className="text-sm text-[var(--muted)]">
                    No address listed.
                  </div>
                )}
              </Section>

              <Section title="Contact" icon={<Phone className="h-4 w-4" />}>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[var(--muted)]">Phone</div>
                    <div className="font-medium text-[var(--foreground)]">
                      {selected["Phone number"] || "-"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[var(--muted)]">Website</div>
                    {selected["Website URL"] ? (
                      <a
                        className="max-w-[220px] truncate font-medium text-[var(--foreground)] underline underline-offset-4"
                        href={selected["Website URL"]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </a>
                    ) : (
                      <div className="font-medium text-[var(--foreground)]">-</div>
                    )}
                  </div>
                </div>
              </Section>

              <Section
                title="Care & services"
                icon={<Stethoscope className="h-4 w-4" />}
              >
                <div className="space-y-3">
                  {selected["Services offered"] ? (
                    <div className="whitespace-pre-wrap text-sm text-[color:var(--foreground)]">
                      {selected["Services offered"]}
                    </div>
                  ) : (
                    <div className="text-sm text-[var(--muted)]">
                      No services listed.
                    </div>
                  )}

                  {selected["Categories"] ? (
                    <div className="text-sm text-[var(--muted)]">
                      <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                        Categories
                      </div>
                      <div className="mt-1 text-[color:var(--foreground)]">
                        {selected["Categories"]}
                      </div>
                    </div>
                  ) : null}
                </div>
              </Section>

              <Section
                title="Audience & languages"
                icon={<Users className="h-4 w-4" />}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Users className="mt-0.5 h-4 w-4 text-[var(--muted)]" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                        Primary audience
                      </div>
                      <div className="mt-1 text-sm text-[color:var(--foreground)]">
                        {selected["Primary Audience"] || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="h-4 w-4">
                      <Languages className="mt-0.5 h-4 w-4 text-[var(--muted)]" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                        Languages (clinical)
                      </div>
                      <div className="mt-1 text-sm text-[color:var(--foreground)]">
                        {selected["Languages Offered (clinical)"] || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            </div>

            <Section
              title="Access & support"
              icon={<ShieldCheck className="h-4 w-4" />}
            >
              <div className="flex flex-wrap gap-2">
                <Badge
                  tone={
                    ynTone(
                      selected[
                        "Availability of Professional Interpreters (Y/N)"
                      ],
                    )
                  }
                >
                  Interpreters:{" "}
                  {selected[
                    "Availability of Professional Interpreters (Y/N)"
                  ] || "-"}
                </Badge>
                <Badge tone={ynTone(selected["Telehealth (Y/N)"])}>
                  Telehealth: {selected["Telehealth (Y/N)"] || "-"}
                </Badge>
                <Badge
                  tone={ynTone(selected["Financial Assistance (Y/N)"])}
                >
                  Financial Aid: {selected["Financial Assistance (Y/N)"] || "-"}
                </Badge>
                <Badge tone={ynTone(selected["Transportation (Y/N)"])}>
                  Transportation: {selected["Transportation (Y/N)"] || "-"}
                </Badge>
              </div>
            </Section>

            {selected["Notes for Indian / South Asian Patients"] ? (
              <Section title="Notes" icon={<StickyNote className="h-4 w-4" />}>
                <div className="whitespace-pre-wrap text-sm text-[color:var(--foreground)]">
                  {selected["Notes for Indian / South Asian Patients"]}
                </div>
              </Section>
            ) : null}
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
