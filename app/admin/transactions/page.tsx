"use client";


import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader, TableWrap } from "@/components/dashboard/DashboardShell";
import { EmptyState, ErrorState, Skeleton, StatusBadge } from "@/components/ui/Feedback";
import { Input, Select } from "@/components/ui/Form";
import { Pagination } from "@/components/ui/Pagination";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import { formatAppointmentDate, formatDateTime, formatPrice } from "@/lib/utils";
import { transactionsApi } from "@/services/endpoints";

export default function TransactionsPage() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput.trim(), 400);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [search, status]);
  const { data, loading, error, reload } = useAsync(() => transactionsApi.all({ search, status, page, limit: 10 }), [search, status, page]);

  return (
    <>
      <PageHeader title="Transactions" description="Payments verified with Stripe. They are read-only." />
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <Input aria-label="Search transactions" className="pl-10" placeholder="Search by customer or Stripe session ID" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        </div>
        <Select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any status</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </Select>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !data ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : data && data.items.length === 0 ? (
        <EmptyState title="No transactions yet" description="Paid appointments will appear here once Stripe confirms them." />
      ) : (
        <>
          <TableWrap>
            <table className={`w-full min-w-[980px] text-left text-sm ${loading ? "opacity-60" : ""}`}>
              <thead className="border-b border-sand-200 bg-sand-50 text-charcoal-600">
                <tr>
                  {["Customer", "Service", "Appointment", "Amount", "Currency", "Stripe session", "Status", "Date"].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.items.map((t) => (
                  <tr key={t._id} className="border-b border-sand-100 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{t.customer?.name ?? "Deleted user"}</p>
                      <p className="text-xs text-charcoal-500">{t.customer?.email}</p>
                    </td>
                    <td className="px-4 py-3">{t.service?.serviceName ?? "Unavailable"}</td>
                    <td className="px-4 py-3">
                      {t.appointment ? (
                        <>
                          <p>{formatAppointmentDate(t.appointment.appointmentDate)}</p>
                          <p className="text-xs text-charcoal-500">{t.appointment.timeSlot}</p>
                        </>
                      ) : "-"}
                    </td>
                    <td className="px-4 py-3 font-medium">{formatPrice(t.amount, t.currency)}</td>
                    <td className="px-4 py-3 uppercase text-charcoal-600">{t.currency}</td>
                    <td className="max-w-48 px-4 py-3"><code className="block truncate text-xs text-charcoal-600" title={t.stripeSessionId}>{t.stripeSessionId}</code></td>
                    <td className="px-4 py-3"><StatusBadge status={t.status === "paid" ? "paid" : "failed"} /></td>
                    <td className="px-4 py-3 text-charcoal-600">{formatDateTime(t.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
          {data && <Pagination pagination={data.pagination} onChange={setPage} />}
        </>
      )}
    </>
  );
}
