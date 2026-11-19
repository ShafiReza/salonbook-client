"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { appointmentsApi } from "@/services/endpoints";
import type { Service, SlotInfo } from "@/types";
import { cn, formatPrice, todayString } from "@/lib/utils";
import { Button } from "../ui/Button";
import { Field, Input, Textarea } from "../ui/Form";
import { Spinner } from "../ui/Feedback";

export function BookingForm({ service }: { service: Service }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [message, setMessage] = useState("");
  const [slots, setSlots] = useState<SlotInfo[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ date?: string; slot?: string }>({});

  useEffect(() => {
    if (!date) {
      setSlots(null);
      return;
    }
    let cancelled = false;
    setLoadingSlots(true);
    setSlotsError(null);
    setSlot("");
    appointmentsApi
      .availability(date)
      .then((r) => !cancelled && setSlots(r.slots))
      .catch((e: Error) => !cancelled && setSlotsError(e.message))
      .finally(() => !cancelled && setLoadingSlots(false));
    return () => {
      cancelled = true;
    };
  }, [date]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!date) next.date = "Choose an appointment date";
    else if (date < todayString()) next.date = "You cannot book a past date";
    if (!slot) next.slot = "Choose an available time slot";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await appointmentsApi.create({ serviceId: service._id, appointmentDate: date, timeSlot: slot, message: message.trim() || undefined });
      toast.success("Appointment request sent. We'll confirm it shortly.");
      router.push("/dashboard/appointments");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create the appointment");
      // refresh slots in case someone just took it
      if (date) appointmentsApi.availability(date).then((r) => setSlots(r.slots)).catch(() => undefined);
      setSlot("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field label="Appointment date" htmlFor="date" error={errors.date}>
        <Input id="date" type="date" min={todayString()} value={date} onChange={(e) => setDate(e.target.value)} invalid={!!errors.date} />
      </Field>

      <div>
        <p className="mb-1.5 text-sm font-medium text-charcoal-800">Available time slots</p>
        {!date ? (
          <p className="rounded-xl bg-sand-100 px-4 py-3 text-sm text-charcoal-600">Pick a date to see open slots.</p>
        ) : loadingSlots ? (
          <div className="flex items-center gap-2 py-3 text-sm text-charcoal-600">
            <Spinner /> Checking availability…
          </div>
        ) : slotsError ? (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {slotsError}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {slots?.map((s) => (
              <button
                key={s.time}
                type="button"
                disabled={!s.available}
                onClick={() => setSlot(s.time)}
                aria-pressed={slot === s.time}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                  slot === s.time ? "border-blush-600 bg-blush-600 text-white" : "border-charcoal-900/15 bg-white hover:border-blush-400",
                  !s.available && "cursor-not-allowed bg-sand-100 text-charcoal-400 line-through hover:border-charcoal-900/15",
                )}
              >
                {s.time}
              </button>
            ))}
          </div>
        )}
        {errors.slot && (
          <p role="alert" className="mt-1.5 text-xs text-red-600">
            {errors.slot}
          </p>
        )}
      </div>

      <Field label="Additional message (optional)" htmlFor="message" hint="Share anything the stylist should know.">
        <Textarea id="message" maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hair length, allergies, inspiration…" />
      </Field>

      <div className="flex items-center justify-between border-t border-sand-200 pt-5">
        <div>
          <p className="text-xs text-charcoal-500">Total</p>
          <p className="font-display text-3xl text-blush-700">{formatPrice(service.price)}</p>
        </div>
        <Button type="submit" size="lg" loading={submitting}>
          Request appointment
        </Button>
      </div>
      <p className="text-xs text-charcoal-500">You pay only after the salon confirms your appointment.</p>
    </form>
  );
}
