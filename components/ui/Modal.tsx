"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Button } from "./Button";

export function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-charcoal-950/50" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:max-w-xl sm:rounded-3xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-2xl">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-charcoal-500 hover:bg-sand-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  danger,
  loading,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Keep it
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-charcoal-700">{message}</p>
    </Modal>
  );
}

export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-6 border-b border-sand-200 py-2.5 text-sm last:border-0">
      <dt className="text-charcoal-500">{label}</dt>
      <dd className="text-right font-medium text-charcoal-900">{children}</dd>
    </div>
  );
}
