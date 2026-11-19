"use client";

import { CreditCard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState, ErrorState, Skeleton, StatusBadge } from "@/components/ui/Feedback";
import { Select } from "@/components/ui/Form";
import { SafeImage } from "@/components/ui/Media";
import { ConfirmDialog, DetailRow, Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { useAsync } from "@/hooks/useAsync";
import { formatAppointmentDate, formatDateTime, formatPrice } from "@/lib/utils";
import { appointmentsApi, paymentsApi } from "@/services/endpoints";
import type { Appointment, AppointmentStatus } from "@/types";

export default function MyAppointmentsPage() {
  const [status, setStatus] = useState<AppointmentStatus | "">("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Appointment | null>(null);
  const [toCancel, setToCancel] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const { data, loading, error, reload } = useAsync(() => appointmentsApi.mine({ status, page, limit: 8 }), [status, page]);

  async function cancel() {
    if (!toCancel) return;
    setCancelling(true);
    try {
      await appointmentsApi.cancel(toCancel._id);
      toast.success("Appointment cancelled");
      setToCancel(null);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not cancel the appointment");
    } finally {
      setCancelling(false);
    }
  }

  async function pay(a: Appointment) {
    setPayingId(a._id);
    try {
      const { url } = await paymentsApi.checkout(a._id);
      window.location.href = url; // hand over to Stripe Checkout
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start the payment");
      setPayingId(null);
    }
  }

  return (
    <>
      <PageHeader
        title="My appointments"
        description="Cancel pending requests, and pay once the salon confirms."
        action={
          <Select aria-label="Filter by status" className="w-44" value={status} onChange={(e) => { setStatus(e.target.value as AppointmentStatus | ""); setPage(1); }}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !data ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : data && data.items.length === 0 ? (
        <EmptyState
          title={status ? `No ${status} appointments` : "No appointments yet"}
          description="When you request a service, it will show up here."
          action={<LinkButton href="/services">Browse services</LinkButton>}
        />
      ) : (
        <>
          <div className={`space-y-4 ${loading ? "opacity-60" : ""}`}>
            {data?.items.map((a) => (
              <article key={a._id} className="flex flex-col gap-5 rounded-3xl border border-sand-200 bg-white p-4 sm:flex-row sm:p-5">
                <SafeImage src={a.service?.image} alt={a.service?.serviceName ?? "Service"} className="h-36 w-full shrink-0 rounded-2xl object-cover sm:h-32 sm:w-40" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-sans text-lg font-semibold">{a.service?.serviceName ?? "Service no longer available"}</h3>
                      <p className="text-sm text-charcoal-600">{a.service?.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <StatusBadge status={a.status} />
                      <StatusBadge status={a.paymentStatus} />
                    </div>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
                    <div><dt className="text-charcoal-500">Date</dt><dd className="font-medium">{formatAppointmentDate(a.appointmentDate)}</dd></div>
                    <div><dt className="text-charcoal-500">Time</dt><dd className="font-medium">{a.timeSlot}</dd></div>
                    <div><dt className="text-charcoal-500">Price</dt><dd className="font-medium">{formatPrice(a.servicePrice)}</dd></div>
                    <div><dt className="text-charcoal-500">Requested</dt><dd className="font-medium">{formatDateTime(a.createdAt)}</dd></div>
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setDetail(a)}>View Details</Button>
                    {a.status === "pending" && (
                      <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setToCancel(a)}>Cancel request</Button>
                    )}
                    {a.status === "confirmed" && a.paymentStatus === "unpaid" && (
                      <Button size="sm" onClick={() => pay(a)} loading={payingId === a._id}>
                        <CreditCard className="h-4 w-4" /> Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
          {data && <Pagination pagination={data.pagination} onChange={setPage} />}
        </>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Appointment details">
        {detail && (
          <dl>
            <DetailRow label="Service">{detail.service?.serviceName ?? "Unavailable"}</DetailRow>
            <DetailRow label="Category">{detail.service?.category ?? "-"}</DetailRow>
            <DetailRow label="Date">{formatAppointmentDate(detail.appointmentDate)}</DetailRow>
            <DetailRow label="Time slot">{detail.timeSlot}</DetailRow>
            <DetailRow label="Price">{formatPrice(detail.servicePrice)}</DetailRow>
            <DetailRow label="Status"><StatusBadge status={detail.status} /></DetailRow>
            <DetailRow label="Payment status"><StatusBadge status={detail.paymentStatus} /></DetailRow>
            <DetailRow label="Requested on">{formatDateTime(detail.createdAt)}</DetailRow>
            <DetailRow label="Your message">{detail.message || "None"}</DetailRow>
          </dl>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toCancel}
        title="Cancel this request?"
        message="Your time slot will be released. This can't be undone."
        confirmLabel="Cancel request"
        danger
        loading={cancelling}
        onConfirm={cancel}
        onClose={() => setToCancel(null)}
      />
    </>
  );
}
