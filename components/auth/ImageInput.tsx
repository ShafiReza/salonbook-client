"use client";

import { Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "../ui/Form";
import { SafeImage } from "../ui/Media";

export interface ImageValue {
  file: File | null;
  url: string;
}

const MAX_BYTES = 5 * 1024 * 1024;

export function ImageInput({ value, onChange, allowUrl = true, shape = "round" }: { value: ImageValue; onChange: (v: ImageValue) => void; allowUrl?: boolean; shape?: "round" | "wide" }) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => (value.file ? URL.createObjectURL(value.file) : value.url), [value.file, value.url]);
  useEffect(() => {
    return () => {
      if (value.file && preview) URL.revokeObjectURL(preview);
    };
  }, [value.file, preview]);

  function pick(file?: File) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) return void toast.error("Choose a JPG, PNG, WEBP or GIF image");
    if (file.size > MAX_BYTES) return void toast.error("Image must be 5MB or smaller");
    onChange({ file, url: "" });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <SafeImage src={preview} alt="Preview" className={cn("shrink-0 object-cover", shape === "round" ? "h-20 w-20 rounded-full" : "h-24 w-36 rounded-2xl")} />
        <div className="min-w-0 flex-1 space-y-2">
          {allowUrl && (
            <div className="inline-flex rounded-full bg-sand-100 p-1 text-xs font-medium">
              {(["upload", "url"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)} className={cn("rounded-full px-3 py-1", mode === m ? "bg-white shadow-sm" : "text-charcoal-600")}>
                  {m === "upload" ? "Upload" : "Image URL"}
                </button>
              ))}
            </div>
          )}
          {mode === "upload" || !allowUrl ? (
            <div className="flex flex-wrap items-center gap-2">
              <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
              <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-charcoal-900/20 bg-white px-4 py-2 text-sm font-medium hover:bg-sand-100">
                <Upload className="h-4 w-4" /> {value.file ? "Change image" : "Choose image"}
              </button>
              {value.file && (
                <button type="button" onClick={() => onChange({ file: null, url: "" })} className="inline-flex items-center gap-1 text-xs text-charcoal-600 hover:text-red-600">
                  <X className="h-3.5 w-3.5" /> Remove
                </button>
              )}
              <span className="w-full truncate text-xs text-charcoal-500">{value.file ? value.file.name : "JPG, PNG, WEBP or GIF up to 5MB"}</span>
            </div>
          ) : (
            <Input type="url" placeholder="https://example.com/photo.jpg" value={value.url} onChange={(e) => onChange({ file: null, url: e.target.value })} />
          )}
        </div>
      </div>
    </div>
  );
}
