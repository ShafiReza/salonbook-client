"use client";

import Link from "next/link";
import { Pencil, Power, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader, TableWrap } from "@/components/dashboard/DashboardShell";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState, ErrorState, Skeleton, StatusBadge } from "@/components/ui/Feedback";
import { Input, Select } from "@/components/ui/Form";
import { SafeImage } from "@/components/ui/Media";
import { ConfirmDialog } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { formatDuration, formatPrice } from "@/lib/utils";
import { servicesApi } from "@/services/endpoints";
import type { Service } from "@/types";

export default function ManageServicesPage() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput.trim(), 400);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => setPage(1), [search, category, status]);
  const { data, loading, error, reload } = useAsync(
    () => servicesApi.adminList({ search, category, status, page, limit: 10, sort: "newest" }),
    [search, category, status, page],
  );

  async function toggle(s: Service) {
    setTogglingId(s._id);
    try {
      await servicesApi.setStatus(s._id, s.status === "active" ? "inactive" : "active");
      toast.success(s.status === "active" ? "Service deactivated" : "Service activated");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update the service");
    } finally {
      setTogglingId(null);
    }
  }

  async function remove() {
    if (!toDelete) return;
    setBusy(true);
    try {
      await servicesApi.remove(toDelete._id);
      toast.success("Service deleted");
      setToDelete(null);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete the service");
      setToDelete(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Manage services" description="Edit the menu, switch services on or off and remove unused ones." action={<LinkButton href="/admin/services/new">Add service</LinkButton>} />

      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_200px_160px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <Input aria-label="Search services" className="pl-10" placeholder="Search by name" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        </div>
        <Select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {SERVICE_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
        <Select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !data ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : data && data.items.length === 0 ? (
        <EmptyState title="No services found" description="Adjust the filters or add a new service." action={<LinkButton href="/admin/services/new">Add service</LinkButton>} />
      ) : (
        <>
          <TableWrap>
            <table className={`w-full min-w-[760px] text-left text-sm ${loading ? "opacity-60" : ""}`}>
              <thead className="border-b border-sand-200 bg-sand-50 text-charcoal-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((s) => (
                  <tr key={s._id} className="border-b border-sand-100 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <SafeImage src={s.image} alt={s.serviceName} className="h-12 w-12 rounded-xl object-cover" />
                        <Link href={`/services/${s._id}`} className="font-medium hover:text-blush-700">
                          {s.serviceName}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-charcoal-600">{s.category}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(s.price)}</td>
                    <td className="px-4 py-3 text-charcoal-600">{formatDuration(s.duration)}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <LinkButton href={`/admin/services/${s._id}/edit`} variant="outline" size="sm" aria-label={`Edit ${s.serviceName}`}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </LinkButton>
                        <Button variant="ghost" size="sm" onClick={() => toggle(s)} loading={togglingId === s._id}>
                          <Power className="h-3.5 w-3.5" /> {s.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setToDelete(s)} aria-label={`Delete ${s.serviceName}`}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
          {data && <Pagination pagination={data.pagination} onChange={setPage} />}
        </>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this service?"
        message={`"${toDelete?.serviceName}" will be removed permanently. Services that already have appointments can't be deleted. Deactivate them instead.`}
        confirmLabel="Delete service"
        danger
        loading={busy}
        onConfirm={remove}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
