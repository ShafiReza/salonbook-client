"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zodResolver";
import { toast } from "sonner";
import { ImageInput, type ImageValue } from "@/components/auth/ImageInput";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Form";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { servicesApi, uploadImage } from "@/services/endpoints";
import type { Service } from "@/types";
import { serviceFormSchema, type ServiceFormValues } from "@/utils/validation";

export function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter();
  const [image, setImage] = useState<ImageValue>({ file: null, url: service?.image ?? "" });
  const [imageError, setImageError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      serviceName: service?.serviceName ?? "",
      category: service?.category ?? "",
      description: service?.description ?? "",
      price: service?.price as number,
      duration: service?.duration as number,
      status: service?.status ?? "active",
    },
  });

  async function onSubmit(values: ServiceFormValues) {
    if (!image.file && !image.url) {
      setImageError("Upload a service image");
      return;
    }
    setImageError(null);
    try {
      // Upload to ImgBB through the API, then store the returned URL in MongoDB with the service
      const imageUrl = image.file ? await uploadImage(image.file) : image.url;
      const body = { ...values, image: imageUrl };
      if (service) await servicesApi.update(service._id, body);
      else await servicesApi.create(body);
      toast.success(service ? "Service updated" : "Service created");
      router.push("/admin/services");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save the service");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6 rounded-3xl border border-sand-200 bg-white p-6 sm:p-8" noValidate>
      <Field label="Service name" htmlFor="serviceName" error={errors.serviceName?.message}>
        <Input id="serviceName" invalid={!!errors.serviceName} {...register("serviceName")} />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Category" htmlFor="category" error={errors.category?.message}>
          <Select id="category" invalid={!!errors.category} {...register("category")}>
            <option value="">Select a category</option>
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status" htmlFor="status">
          <Select id="status" {...register("status")}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </Field>
        <Field label="Price" htmlFor="price" error={errors.price?.message}>
          <Input id="price" type="number" step="0.01" min="0" invalid={!!errors.price} {...register("price", { valueAsNumber: true })} />
        </Field>
        <Field label="Estimated duration (minutes)" htmlFor="duration" error={errors.duration?.message}>
          <Input id="duration" type="number" step="1" min="1" invalid={!!errors.duration} {...register("duration", { valueAsNumber: true })} />
        </Field>
      </div>
      <Field label="Description" htmlFor="description" error={errors.description?.message}>
        <Textarea id="description" className="min-h-36" invalid={!!errors.description} {...register("description")} />
      </Field>
      <div>
        <p className="mb-2 text-sm font-medium">Service image</p>
        <ImageInput value={image} onChange={setImage} allowUrl={false} shape="wide" />
        {imageError && (
          <p role="alert" className="mt-1.5 text-xs text-red-600">
            {imageError}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Button type="submit" size="lg" loading={isSubmitting}>
          {service ? "Save changes" : "Create service"}
        </Button>
        <Button variant="outline" size="lg" onClick={() => router.push("/admin/services")} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
