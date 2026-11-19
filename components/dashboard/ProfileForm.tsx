"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zodResolver";
import { toast } from "sonner";
import { ImageInput, type ImageValue } from "@/components/auth/ImageInput";
import { Button } from "@/components/ui/Button";
import { ErrorState, Skeleton } from "@/components/ui/Feedback";
import { Field, Input } from "@/components/ui/Form";
import { useAuth } from "@/contexts/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { uploadImage, usersApi } from "@/services/endpoints";
import { profileSchema, type ProfileValues } from "@/utils/validation";
import type { Customer } from "@/types";

function Form({ profile }: { profile: Customer }) {
  const { refreshUser } = useAuth();
  const [image, setImage] = useState<ImageValue>({ file: null, url: profile.image ?? "" });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile.name ?? "", phone: profile.phone ?? "", address: profile.address ?? "" },
  });

  async function onSubmit(values: ProfileValues) {
    try {
      let imageUrl = image.url.trim();
      if (imageUrl && !/^https?:\/\//i.test(imageUrl)) return void toast.error("Image URL must start with http:// or https://");
      if (image.file) imageUrl = await uploadImage(image.file);
      // Only these four fields are sent. role / isBlocked are never part of the request and the API rejects them.
      await usersApi.updateProfile({ name: values.name, phone: values.phone, address: values.address, image: imageUrl });
      await refreshUser();
      setImage({ file: null, url: imageUrl });
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update your profile");
    }
  }

  const imageChanged = image.file !== null || image.url !== (profile.image ?? "");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6 rounded-3xl border border-sand-200 bg-white p-6 sm:p-8" noValidate>
      <div>
        <p className="mb-2 text-sm font-medium">Profile image</p>
        <ImageInput value={image} onChange={setImage} />
      </div>
      <Field label="Full name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field label="Email" htmlFor="email" hint="Your email is your sign-in and can't be changed here.">
        <Input id="email" value={profile.email} disabled readOnly />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Phone number" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" placeholder="+880 1XXX XXXXXX" invalid={!!errors.phone} {...register("phone")} />
        </Field>
        <Field label="Address" htmlFor="address" error={errors.address?.message}>
          <Input id="address" invalid={!!errors.address} {...register("address")} />
        </Field>
      </div>
      <Button type="submit" size="lg" loading={isSubmitting} disabled={!isDirty && !imageChanged}>
        Save changes
      </Button>
    </form>
  );
}

export function ProfileForm() {
  const { data, loading, error, reload } = useAsync(() => usersApi.me(), []);
  if (loading && !data) return <Skeleton className="h-96 max-w-2xl rounded-3xl" />;
  if (error || !data) return <ErrorState message={error ?? "Could not load your profile"} onRetry={reload} />;
  return <Form profile={data} />;
}
