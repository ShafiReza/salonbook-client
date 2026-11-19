"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader, TableWrap } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, Skeleton, StatusBadge } from "@/components/ui/Feedback";
import { Input } from "@/components/ui/Form";
import { Avatar } from "@/components/ui/Media";
import { ConfirmDialog, DetailRow, Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/utils";
import { usersApi } from "@/services/endpoints";
import type { Customer } from "@/types";

function CustomerDetails({ id }: { id: string }) {
  const { data, loading, error } = useAsync(() => usersApi.get(id), [id]);
  if (loading) return <Skeleton className="h-52" />;
  if (error || !data) return <p className="text-sm text-red-600">{error ?? "Could not load customer"}</p>;
  return (
    <dl>
      <DetailRow label="Name">{data.name}</DetailRow>
      <DetailRow label="Email">{data.email}</DetailRow>
      <DetailRow label="Phone">{data.phone || "Not provided"}</DetailRow>
      <DetailRow label="Address">{data.address || "Not provided"}</DetailRow>
      <DetailRow label="Joined">{formatDate(data.createdAt)}</DetailRow>
      <DetailRow label="Account">{data.isBlocked ? <StatusBadge status="blocked" /> : <StatusBadge status="active" />}</DetailRow>
      <DetailRow label="Appointments">
        {data.appointmentStats?.total ?? 0} total · {data.appointmentStats?.pending ?? 0} pending · {data.appointmentStats?.confirmed ?? 0} confirmed · {data.appointmentStats?.cancelled ?? 0} cancelled
      </DetailRow>
    </dl>
  );
}

export default function ManageCustomersPage() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput.trim(), 400);
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [target, setTarget] = useState<Customer | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => setPage(1), [search]);
  const { data, loading, error, reload } = useAsync(() => usersApi.list({ search, page, limit: 10 }), [search, page]);

  async function toggleBlock() {
    if (!target) return;
    setBusy(true);
    try {
      if (target.isBlocked) await usersApi.unblock(target._id);
      else await usersApi.block(target._id);
      toast.success(target.isBlocked ? "Customer unblocked" : "Customer blocked");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update the customer");
    } finally {
      setBusy(false);
      setTarget(null);
    }
  }

  return (
    <>
      <PageHeader title="Manage customers" description="Blocked customers can't book, pay or use their dashboard." />
      <div className="relative mb-5 max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
        <Input aria-label="Search customers" className="pl-10" placeholder="Search by name, email or phone" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !data ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : data && data.items.length === 0 ? (
        <EmptyState title="No customers found" description={search ? "Try a different search." : "Customers appear here after they sign up."} />
      ) : (
        <>
          <TableWrap>
            <table className={`w-full min-w-[720px] text-left text-sm ${loading ? "opacity-60" : ""}`}>
              <thead className="border-b border-sand-200 bg-sand-50 text-charcoal-600">
                <tr>
                  {["Customer", "Phone", "Joined", "Status", "Actions"].map((h) => (
                    <th key={h} className={`px-4 py-3 font-medium ${h === "Actions" ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.items.map((c) => (
                  <tr key={c._id} className="border-b border-sand-100 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={c.image} name={c.name} />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{c.name}</p>
                          <p className="truncate text-xs text-charcoal-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-charcoal-600">{c.phone || "-"}</td>
                    <td className="px-4 py-3 text-charcoal-600">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3">{c.isBlocked ? <StatusBadge status="blocked" /> : <StatusBadge status="active" />}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Button size="sm" variant="outline" onClick={() => setDetailId(c._id)}>Details</Button>
                        <Button size="sm" variant={c.isBlocked ? "primary" : "ghost"} className={c.isBlocked ? "" : "text-red-600 hover:bg-red-50"} onClick={() => setTarget(c)}>
                          {c.isBlocked ? "Unblock" : "Block"}
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

      <Modal open={!!detailId} onClose={() => setDetailId(null)} title="Customer details">
        {detailId && <CustomerDetails id={detailId} />}
      </Modal>

      <ConfirmDialog
        open={!!target}
        title={target?.isBlocked ? "Unblock this customer?" : "Block this customer?"}
        message={target?.isBlocked ? `${target?.name} will be able to book and pay again.` : `${target?.name} will be signed out and won't be able to book or pay.`}
        confirmLabel={target?.isBlocked ? "Unblock" : "Block customer"}
        danger={!target?.isBlocked}
        loading={busy}
        onConfirm={toggleBlock}
        onClose={() => setTarget(null)}
      />
    </>
  );
}
