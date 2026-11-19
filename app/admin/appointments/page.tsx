"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader, TableWrap } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, Skeleton, StatusBadge } from "@/components/ui/Feedback";
import { Input, Select } from "@/components/ui/Form";
import { Avatar } from "@/components/ui/Media";
import { ConfirmDialog, DetailRow, Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import { formatAppointmentDate, formatDateTime, formatPrice } from "@/lib/utils";
import { appointmentsApi } from "@/services/endpoints";
import type { Appointment, AppointmentStatus } from "@/types";

export default function ManageAppointmentsPage() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput.trim(), 400);
  const [status, setStatus] = useState<AppointmentStatus | "">("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Appointment | null>(null);
  const [toCancel, setToCancel] = useState<Appointment | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => setPage(1), [search, status]);
  const { data, loading, error, reload } = useAsync(() => appointmentsApi.all({ search, status, page, limit: 10 }), [search, status, page]);

  async function confirm(a: Appointment) {
    setBusyId(a._id);
    try {
      await appointmentsApi.confirm(a._id);
      toast.success("Appointment confirmed");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not confirm the appointment");
    } finally {
      setBusyId(null);
    }
  }

  async function cancel() {
    if (!toCancel) return;
    setBusyId(toCancel._id);
    try {
      await appointmentsApi.cancel(toCancel._id);
      toast.success("Appointment cancelled");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not cancel the appointment");
    } finally {
      setBusyId(null);
      setToCancel(null);
    }
  }

  return (
    <>
      <PageHeader title="Manage appointments" description="Review requests, confirm them and keep the schedule tidy." />
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <Input aria-label="Search appointments" className="pl-10" placeholder="Search by customer name, email or service" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        </div>
        <Select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value as AppointmentStatus | "")}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !data ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : data && data.items.length === 0 ? (
        <EmptyState title="No appointments found" description="Try a different search or status filter." />
      ) : (
        <>
          <TableWrap>
            <table className={`w-full min-w-[900px] text-left text-sm ${loading ? "opacity-60" : ""}`}>
              <thead className="border-b border-sand-200 bg-sand-50 text-charcoal-600">
                <tr>
                  {["Customer", "Service", "Date & time", "Price", "Status", "Payment", "Actions"].map((h) => (
                    <th key={h} className={`px-4 py-3 font-medium ${h === "Actions" ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.items.map((a) => (
                  <tr key={a._id} className="border-b border-sand-100 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={a.customer?.image} name={a.customer?.name} />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{a.customer?.name ?? "Deleted user"}</p>
                          <p className="truncate text-xs text-charcoal-500">{a.customer?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{a.service?.serviceName ?? "Unavailable"}</td>
                    <td className="px-4 py-3">
                      <p>{formatAppointmentDate(a.appointmentDate)}</p>
                      <p className="text-xs text-charcoal-500">{a.timeSlot}</p>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatPrice(a.servicePrice)}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3"><StatusBadge status={a.paymentStatus} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Button size="sm" variant="outline" onClick={() => setDetail(a)}>Details</Button>
                        {a.status === "pending" && (
                          <Button size="sm" onClick={() => confirm(a)} loading={busyId === a._id}>Confirm</Button>
                        )}
                        {(a.status === "pending" || a.status === "confirmed") && a.paymentStatus === "unpaid" && (
                          <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setToCancel(a)}>Cancel</Button>
                        )}
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

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Appointment details">
        {detail && (
          <dl>
            <DetailRow label="Customer">{detail.customer?.name ?? "Deleted user"}</DetailRow>
            <DetailRow label="Email">{detail.customer?.email ?? "-"}</DetailRow>
            <DetailRow label="Phone">{detail.customer?.phone || "Not provided"}</DetailRow>
            <DetailRow label="Service">{detail.service?.serviceName ?? "Unavailable"}</DetailRow>
            <DetailRow label="Date">{formatAppointmentDate(detail.appointmentDate)}</DetailRow>
            <DetailRow label="Time slot">{detail.timeSlot}</DetailRow>
            <DetailRow label="Price">{formatPrice(detail.servicePrice)}</DetailRow>
            <DetailRow label="Status"><StatusBadge status={detail.status} /></DetailRow>
            <DetailRow label="Payment"><StatusBadge status={detail.paymentStatus} /></DetailRow>
            <DetailRow label="Booked on">{formatDateTime(detail.createdAt)}</DetailRow>
            <DetailRow label="Customer message">{detail.message || "None"}</DetailRow>
          </dl>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toCancel}
        title="Cancel this appointment?"
        message="The customer's time slot will be released."
        confirmLabel="Cancel appointment"
        danger
        loading={!!busyId}
        onConfirm={cancel}
        onClose={() => setToCancel(null)}
      />
    </>
  );
}
