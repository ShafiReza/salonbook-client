import type {
  AdminStats,
  Appointment,
  AppointmentStatus,
  Customer,
  CustomerDetail,
  CustomerStats,
  Paginated,
  Service,
  ServiceStatus,
  SlotInfo,
  Transaction,
} from "@/types";
import { apiFetch } from "./api";

export interface ServiceBody {
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: ServiceStatus;
}

export interface ServiceListParams {
  search?: string;
  category?: string;
  sort?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const servicesApi = {
  list: (query: ServiceListParams) => apiFetch<Paginated<Service>>("/services", { auth: false, query: { ...query } }),
  adminList: (query: ServiceListParams) => apiFetch<Paginated<Service>>("/services/admin/list", { query: { ...query } }),
  get: (id: string) => apiFetch<Service>(`/services/${id}`, { auth: false }),
  create: (body: ServiceBody) => apiFetch<Service>("/services", { method: "POST", body }),
  update: (id: string, body: ServiceBody) => apiFetch<Service>(`/services/${id}`, { method: "PUT", body }),
  setStatus: (id: string, status: ServiceStatus) =>
    apiFetch<Service>(`/services/${id}/status`, { method: "PATCH", body: { status } }),
  remove: (id: string) => apiFetch<null>(`/services/${id}`, { method: "DELETE" }),
};

export interface AppointmentListParams {
  search?: string;
  status?: AppointmentStatus | "";
  page?: number;
  limit?: number;
}

export const appointmentsApi = {
  create: (body: { serviceId: string; appointmentDate: string; timeSlot: string; message?: string }) =>
    apiFetch<Appointment>("/appointments", { method: "POST", body }),
  mine: (query: AppointmentListParams) => apiFetch<Paginated<Appointment>>("/appointments/my", { query: { ...query } }),
  all: (query: AppointmentListParams) => apiFetch<Paginated<Appointment>>("/appointments", { query: { ...query } }),
  get: (id: string) => apiFetch<Appointment>(`/appointments/${id}`),
  cancel: (id: string) => apiFetch<Appointment>(`/appointments/${id}/cancel`, { method: "PATCH" }),
  confirm: (id: string) => apiFetch<Appointment>(`/appointments/${id}/confirm`, { method: "PATCH" }),
  availability: (date: string) => apiFetch<{ date: string; slots: SlotInfo[] }>("/appointments/availability", { query: { date } }),
};

export interface ProfileBody {
  name?: string;
  image?: string;
  phone?: string;
  address?: string;
}

export const usersApi = {
  me: () => apiFetch<Customer>("/users/me"),
  updateProfile: (body: ProfileBody) => apiFetch<Customer>("/users/profile", { method: "PATCH", body }),
  list: (query: { search?: string; blocked?: string; page?: number; limit?: number }) =>
    apiFetch<Paginated<Customer>>("/users", { query: { ...query } }),
  get: (id: string) => apiFetch<CustomerDetail>(`/users/${id}`),
  block: (id: string) => apiFetch<Customer>(`/users/${id}/block`, { method: "PATCH" }),
  unblock: (id: string) => apiFetch<Customer>(`/users/${id}/unblock`, { method: "PATCH" }),
};

export const transactionsApi = {
  all: (query: { search?: string; status?: string; page?: number; limit?: number }) =>
    apiFetch<Paginated<Transaction>>("/transactions", { query: { ...query } }),
  mine: (query: { page?: number; limit?: number }) => apiFetch<Paginated<Transaction>>("/transactions/my", { query: { ...query } }),
};

export const paymentsApi = {
  checkout: (appointmentId: string) =>
    apiFetch<{ url: string; sessionId: string }>("/payments/checkout", { method: "POST", body: { appointmentId } }),
  sessionStatus: (sessionId: string) =>
    apiFetch<{ status: "paid" | "pending"; appointmentId?: string }>(`/payments/session/${sessionId}`),
};

export const statsApi = {
  customer: () => apiFetch<CustomerStats>("/stats/customer"),
  admin: () => apiFetch<AdminStats>("/stats/admin"),
};

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const { url } = await apiFetch<{ url: string }>("/uploads/image", { method: "POST", body: form, auth: false });
  return url;
}
