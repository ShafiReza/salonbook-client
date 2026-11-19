import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination as PaginationData } from "@/types";
import { cn } from "@/lib/utils";

export function Pagination({ pagination, onChange }: { pagination: PaginationData; onChange: (page: number) => void }) {
  const { page, totalPages, total } = pagination;
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let p = Math.max(1, page - 2); p <= Math.min(totalPages, page + 2); p++) pages.push(p);

  const btn = "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm transition-colors";
  return (
    <nav className="mt-8 flex flex-wrap items-center justify-between gap-3" aria-label="Pagination">
      <p className="text-sm text-charcoal-500">
        Page {page} of {totalPages} · {total} results
      </p>
      <div className="flex items-center gap-1">
        <button className={cn(btn, "hover:bg-sand-100 disabled:opacity-40")} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p) => (
          <button key={p} onClick={() => onChange(p)} aria-current={p === page ? "page" : undefined} className={cn(btn, p === page ? "bg-charcoal-900 text-white" : "hover:bg-sand-100")}>
            {p}
          </button>
        ))}
        <button className={cn(btn, "hover:bg-sand-100 disabled:opacity-40")} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
