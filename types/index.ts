export type Role = "admin" | "customer";
export type ServiceStatus = "active" | "inactive";
export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

export interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: ServiceStatus;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

export interface CustomerLite {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string | null;
}

export interface Customer extends CustomerLite {
  address?: string | null;
  role: Role;
  isBlocked: boolean;
  createdAt: string;
}

export interface CustomerDetail extends Customer {
  appointmentStats?: { total: number; pending: number; confirmed: number; cancelled: number };
}

export interface Appointment {
  _id: string;
  serviceId: string | null;
  customerId: string | null;
  service: Pick<Service, "_id" | "serviceName" | "category" | "image" | "duration" | "status"> | null;
  customer: CustomerLite | null;
  appointmentDate: string;
  timeSlot: string;
  message: string;
  servicePrice: number;
  paymentStatus: PaymentStatus;
  status: AppointmentStatus;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
  appointment: { _id: string; appointmentDate: string; timeSlot: string } | null;
  service: { _id: string; serviceName: string; image: string } | null;
  customer: CustomerLite | null;
}

export interface CustomerStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
}

export interface AdminStats {
  customers: number;
  activeServices: number;
  totalAppointments: number;
  pending: number;
  confirmed: number;
  successfulPayments: number;
  revenue: number;
}

export interface SlotInfo {
  time: string;
  available: boolean;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  isBlocked: boolean;
  phone?: string | null;
}
