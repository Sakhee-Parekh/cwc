"use client";

import * as React from "react";
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
  Check,
} from "lucide-react";

import type { Provider } from "../lib/providers";

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
  const cls =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 active:scale-[0.99]";
  if (href) {
    return (
      <a className={cls} href={href} target="_blank" rel="noreferrer">
        {icon}
        {children}
      </a>
    );
  }
  return (
    <button className={cls} onClick={onClick} type="button">
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
    <section className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="text-zinc-500">{icon}</span>
        <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
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
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : tone === "warn"
        ? "bg-amber-50 text-amber-800 ring-amber-100"
        : tone === "info"
          ? "bg-blue-50 text-blue-700 ring-blue-100"
          : "bg-zinc-50 text-zinc-700 ring-zinc-100";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles,
      )}
    >
      {children}
    </span>
  );
}

function ynTone(v: string) {
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
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      window.addEventListener("keydown", onKey);
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onMouseDown={onClose}
    >
      <div
        className="
      relative
      w-full bg-white shadow-xl ring-1 ring-black/5
      sm:max-w-3xl sm:rounded-2xl
      h-[92vh] sm:h-auto
      rounded-2xl
      overflow-hidden
    "
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="
        absolute right-4 top-4
        inline-flex h-9 w-9 items-center justify-center
        rounded-full
        text-zinc-500
        hover:bg-zinc-100 hover:text-zinc-900
        focus:outline-none focus:ring-2 focus:ring-zinc-400/30
        active:scale-95
      "
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable content */}
        <div className="p-5 pt-14 overflow-y-auto h-[calc(92vh-56px)] sm:h-auto">
          {children}
        </div>
      </div>
    </div>
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

  // ─────────────────────────────────────────────
  // MOBILE: direct call (no dialog)
  // ─────────────────────────────────────────────
  if (isMobile) {
    return (
      <a
        href={telHref}
        onClick={(e) => stopPropagationOnly(e)}
        className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 active:scale-[0.99]"
      >
        <Phone className="h-4 w-4" />
        Call
      </a>
    );
  }

  // ─────────────────────────────────────────────
  // DESKTOP: open dialog
  // ─────────────────────────────────────────────
  return (
    <>
      <button
        onMouseDown={(e) => stopAll(e)}
        onClick={(e) => {
          stopAll(e);
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 active:scale-[0.99]"
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
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Phone number
            </div>
            <div className="mt-1 text-lg font-semibold text-zinc-900">
              {phone}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={copy}
              className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Copy number
            </button>

            <a
              onClick={(e) => stopPropagationOnly(e)}
              href={telHref}
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              title="May open FaceTime/Skype/phone app depending on your computer"
            >
              Try calling from this device
            </a>
          </div>

          <p className="text-sm text-zinc-500">
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
        <div className="min-w-[280px]">
          <div className="font-medium text-zinc-900">{name}</div>
          <div className="mt-0.5 text-xs text-zinc-500">{sys}</div>
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
      <span className="text-sm text-zinc-800">{String(getValue() || "")}</span>
    ),
  },
  {
    accessorKey: "Address",
    header: "Location",
    cell: ({ getValue }) => (
      <div className="min-w-[280px] text-sm text-zinc-700">
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
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-100">
            <Star className="h-3.5 w-3.5" />
            {r ?? "—"}
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
              ynTone(
                y("Availability of Professional Interpreters (Y/N)"),
              ) as any
            }
          >
            Interpreters:
            {y("Availability of Professional Interpreters (Y/N)")}
          </Badge>
          <Badge tone={ynTone(y("Telehealth (Y/N)")) as any}>
            Telehealth: {y("Telehealth (Y/N)")}
          </Badge>
          <Badge tone={ynTone(y("Financial Assistance (Y/N)")) as any}>
            Financial Aid: {y("Financial Assistance (Y/N)")}
          </Badge>
          <Badge tone={ynTone(y("Transportation (Y/N)")) as any}>
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
        <div className="flex justify-end gap-2">
          <a
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
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
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm active:scale-[0.99]"
      onClick={() => onOpen(p)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-zinc-900">
            {p["Provider Name"]}
          </div>
          <div className="mt-0.5 truncate text-sm text-zinc-500">
            {p["System / Network Name"]}
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-100">
          <Star className="h-3.5 w-3.5" />
          {rating ?? "—"}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {cats.map((c) => (
          <Badge key={c} tone="info">
            {c}
          </Badge>
        ))}
      </div>

      <div className="mt-3 text-sm text-zinc-700">
        <div
          className="text-sm text-zinc-700"
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
        <Badge tone={ynTone(p["Telehealth (Y/N)"]) as any}>
          Telehealth: {p["Telehealth (Y/N)"]}
        </Badge>
        <Badge tone={ynTone(p["Financial Assistance (Y/N)"]) as any}>
          Aid: {p["Financial Assistance (Y/N)"]}
        </Badge>
        <Badge tone={ynTone(p["Transportation (Y/N)"]) as any}>
          Transport: {p["Transportation (Y/N)"]}
        </Badge>
      </div>

      {/* actions */}
      <div className="mt-4 flex gap-2">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
        >
          <ExternalLink className="h-4 w-4" />
          Website
        </a>

        {phone && phone !== "N/A" ? (
          <a
            href={formatPhoneHref(phone)}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
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
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
          >
            Details
          </button>
        )}
      </div>
    </div>
  );
}

export function ProvidersTable({ data }: { data: Provider[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "Customer review rating", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      Address: true,
      "Organization Type": true,
      Categories: true,
      access: true,
    });

  const [selected, setSelected] = React.useState<Provider | null>(null);
  const [columnsOpen, setColumnsOpen] = React.useState(false);

  const isMobile = useMediaQuery("(max-width: 640px)");

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

  const visibleProviders = table.getRowModel().rows.map((r) => r.original);
  const filteredRows = table.getFilteredRowModel().rows.map((r) => r.original);

  return (
    <div className="space-y-4">
      {/* Header / Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900"></h1>
          <p className="mt-1 text-sm text-zinc-500"></p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search providers, location, services..."
              className="w-full rounded-2xl border border-zinc-200 bg-white py-2 pl-10 pr-3 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100 sm:w-[340px]"
            />
          </div>

          {!isMobile && (
            <button
              onClick={() => setColumnsOpen((v) => !v)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Manage columns
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            </button>
          )}
          <button
            onClick={() => exportRowsToCSV(filteredRows)}
            className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
          >
            Export filtered
          </button>
        </div>
      </div>

      {/* Column menu */}
      {columnsOpen ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-900">Columns</div>
            <button
              onClick={() => setColumnsOpen(false)}
              className="rounded-full p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
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
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4"
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
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm">
              No matches. Try adjusting your search.
            </div>
          ) : null}

          <div className="flex gap-3 border-t border-zinc-100 px-4 py-3 items-center justify-between">
            <div className="text-sm text-zinc-500">
              Showing{" "}
              <span className="font-medium text-zinc-900">
                {table.getRowModel().rows.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-zinc-900">{data.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <div className="text-sm text-zinc-600">
                Page{" "}
                <span className="font-medium text-zinc-900">
                  {table.getState().pagination.pageIndex + 1}
                </span>{" "}
                of{" "}
                <span className="font-medium text-zinc-900">
                  {table.getPageCount()}
                </span>
              </div>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="max-h-[70vh] overflow-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead className="sticky top-0 z-10 bg-white">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const sortDir = header.column.getIsSorted();

                      return (
                        <th
                          key={header.id}
                          className={clsx(
                            "border-b border-zinc-100 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500",
                            canSort &&
                              "cursor-pointer select-none hover:text-zinc-700",
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
                              <span className="text-[10px] text-zinc-400">
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
                    className="group cursor-pointer hover:bg-zinc-50 pointer-events-auto"
                    onClick={() => setSelected(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border-b border-zinc-100 px-4 py-3 align-top text-sm text-zinc-800"
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
                      className="px-4 py-10 text-center text-sm text-zinc-500"
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
          <div className="flex flex-col gap-3 border-t border-zinc-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-zinc-500">
              Showing{" "}
              <span className="font-medium text-zinc-900">
                {table.getRowModel().rows.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-zinc-900">{data.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <div className="text-sm text-zinc-600">
                Page{" "}
                <span className="font-medium text-zinc-900">
                  {table.getState().pagination.pageIndex + 1}
                </span>{" "}
                of{" "}
                <span className="font-medium text-zinc-900">
                  {table.getPageCount()}
                </span>
              </div>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm disabled:opacity-50"
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
            {/* Top summary card */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="text-lg font-semibold text-zinc-900 truncate">
                    {selected["Provider Name"]}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
                    {selected["System / Network Name"] ? (
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span className="truncate">
                          {selected["System / Network Name"]}
                        </span>
                      </span>
                    ) : null}
                    {selected["Organization Type"] ? (
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4" />
                        {selected["Organization Type"]}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Rating pill */}
                <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900">
                  <Star className="h-4 w-4" />
                  <span>
                    {parseRating(selected["Customer review rating"]) ?? "—"}
                  </span>
                  <span className="text-zinc-500 font-normal">rating</span>
                </div>
              </div>

              {/* Quick actions */}
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
                    {/* Reuse your existing CallButton (opens your nicer call dialog) */}
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

            {/* Grid sections */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Section title="Location" icon={<MapPin className="h-4 w-4" />}>
                {selected["Address"] ? (
                  <div className="text-sm text-zinc-800">
                    {selected["Address"]}
                  </div>
                ) : (
                  <div className="text-sm text-zinc-500">
                    No address listed.
                  </div>
                )}
              </Section>

              <Section title="Contact" icon={<Phone className="h-4 w-4" />}>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-zinc-500">Phone</div>
                    <div className="font-medium text-zinc-900">
                      {selected["Phone number"] || "—"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-zinc-500">Website</div>
                    {selected["Website URL"] ? (
                      <a
                        className="font-medium text-zinc-900 underline underline-offset-4 truncate max-w-[220px]"
                        href={selected["Website URL"]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </a>
                    ) : (
                      <div className="font-medium text-zinc-900">—</div>
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
                    <div className="text-sm text-zinc-800 whitespace-pre-wrap">
                      {selected["Services offered"]}
                    </div>
                  ) : (
                    <div className="text-sm text-zinc-500">
                      No services listed.
                    </div>
                  )}

                  {selected["Categories"] ? (
                    <div className="text-sm text-zinc-600">
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Categories
                      </div>
                      <div className="mt-1 text-zinc-800">
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
                    <Users className="h-4 w-4 mt-0.5 text-zinc-500" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Primary audience
                      </div>
                      <div className="mt-1 text-sm text-zinc-800">
                        {selected["Primary Audience"] || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Languages className="h-4 w-4 mt-0.5 text-zinc-500" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Languages (clinical)
                      </div>
                      <div className="mt-1 text-sm text-zinc-800">
                        {selected["Languages Offered (clinical)"] || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            </div>

            {/* Access chips */}
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
                    ) as any
                  }
                >
                  Interpreters:{" "}
                  {selected[
                    "Availability of Professional Interpreters (Y/N)"
                  ] || "—"}
                </Badge>
                <Badge tone={ynTone(selected["Telehealth (Y/N)"]) as any}>
                  Telehealth: {selected["Telehealth (Y/N)"] || "—"}
                </Badge>
                <Badge
                  tone={ynTone(selected["Financial Assistance (Y/N)"]) as any}
                >
                  Financial Aid: {selected["Financial Assistance (Y/N)"] || "—"}
                </Badge>
                <Badge tone={ynTone(selected["Transportation (Y/N)"]) as any}>
                  Transportation: {selected["Transportation (Y/N)"] || "—"}
                </Badge>
              </div>
            </Section>

            {/* Notes */}
            {selected["Notes for Indian / South Asian Patients"] ? (
              <Section title="Notes" icon={<StickyNote className="h-4 w-4" />}>
                <div className="text-sm text-zinc-800 whitespace-pre-wrap">
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
