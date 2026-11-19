import { XCircle } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export const metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
        <XCircle className="h-9 w-9 text-red-600" />
      </div>
      <h1 className="text-3xl">Payment cancelled</h1>
      <p className="mt-3 text-charcoal-600">No money was taken. Your appointment is still confirmed, so you can pay whenever you&apos;re ready.</p>
      <div className="mt-8 flex gap-3">
        <LinkButton href="/dashboard/appointments">Back to my appointments</LinkButton>
        <LinkButton href="/services" variant="outline">
          Browse services
        </LinkButton>
      </div>
    </div>
  );
}
