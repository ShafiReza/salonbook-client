"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState } from "@/components/ui/Feedback";
import { Input, Select } from "@/components/ui/Form";
import { Pagination } from "@/components/ui/Pagination";
import { ServiceCard, ServiceCardSkeleton } from "@/components/services/ServiceCard";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { servicesApi } from "@/services/endpoints";

const PAGE_SIZE = 9;

function Browse() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = sp.get("search") ?? "";
  const category = sp.get("category") ?? "";
  const sort = sp.get("sort") ?? "newest";
  const page = Math.max(1, Number(sp.get("page")) || 1);

  const [input, setInput] = useState(search);
  const debounced = useDebounce(input, 400);

  function update(patch: Record<string, string | null>) {
    const p = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  useEffect(() => {
    if (debounced.trim() !== search) update({ search: debounced.trim() || null, page: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const { data, loading, error, reload } = useAsync(
    () => servicesApi.list({ search, category, sort, page, limit: PAGE_SIZE }),
    [search, category, sort, page],
  );

  const filtered = Boolean(search || category);
  const clear = () => {
    setInput("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl">Browse services</h1>
      <p className="mt-3 max-w-xl text-charcoal-600">Search the menu, narrow by category and sort by price.</p>

      <div className="mt-8 grid gap-3 rounded-3xl border border-sand-200 bg-white p-4 md:grid-cols-[1fr_220px_200px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <Input aria-label="Search services" placeholder="Search by service name" className="pl-10" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <Select aria-label="Filter by category" value={category} onChange={(e) => update({ category: e.target.value || null, page: null })}>
          <option value="">All categories</option>
          {SERVICE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select aria-label="Sort by price" value={sort} onChange={(e) => update({ sort: e.target.value === "newest" ? null : e.target.value, page: null })}>
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </Select>
      </div>

      <div className="mt-8">
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading && !data ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : data && data.items.length === 0 ? (
          <EmptyState
            title={filtered ? "No services match your search" : "No services available yet"}
            description={filtered ? "Try a different name or clear the filters." : "Please check back soon."}
            action={filtered ? <Button onClick={clear}>Clear filters</Button> : undefined}
          />
        ) : (
          <>
            <div className={`grid gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
              {data?.items.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
            {data && <Pagination pagination={data.pagination} onChange={(p) => update({ page: p > 1 ? String(p) : null })} />}
          </>
        )}
      </div>
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12">Loading services…</div>}>
      <Browse />
    </Suspense>
  );
}
