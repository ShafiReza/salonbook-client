import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[a-z]/, "Include at least one lowercase letter");

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  password: passwordSchema,
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || /^[+\d][\d\s()-]{5,19}$/.test(v), "Enter a valid phone number"),
  address: z.string().trim().max(200, "Address is too long"),
});

export const serviceFormSchema = z.object({
  serviceName: z.string().trim().min(2, "Service name is required").max(120),
  category: z.string().min(1, "Choose a category"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(3000),
  price: z.number({ error: "Enter a price" }).positive("Price must be positive").max(100000),
  duration: z
    .number({ error: "Enter the duration in minutes" })
    .int("Use whole minutes")
    .positive("Duration must be positive")
    .max(720),
  status: z.enum(["active", "inactive"]),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
