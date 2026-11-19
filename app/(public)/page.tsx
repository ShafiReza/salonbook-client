import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Droplets,
  Flower2,
  Gem,
  Hand,
  Heart,
  Scissors,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { buttonClasses, LinkButton } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/Feedback";
import { SafeImage } from "@/components/ui/Media";
import { ServiceCard } from "@/components/services/ServiceCard";
import { HERO_IMAGE, PROMO_IMAGE } from "@/lib/constants";
import { fetchFeaturedServices } from "@/services/server";

export const dynamic = "force-dynamic";

const categories: { name: string; icon: LucideIcon; blurb: string }[] = [
  {
    name: "Haircut & Styling",
    icon: Scissors,
    blurb: "Cuts, blow-dries and event styling",
  },
  {
    name: "Hair Coloring",
    icon: Droplets,
    blurb: "Balayage, root colour and gloss",
  },
  {
    name: "Hair Treatment",
    icon: Sparkles,
    blurb: "Repair, smoothing and scalp care",
  },
  {
    name: "Facial & Skincare",
    icon: Flower2,
    blurb: "Cleansing, glow and hydration",
  },
  { name: "Makeup", icon: Heart, blurb: "Day, evening and bridal looks" },
  {
    name: "Manicure & Pedicure",
    icon: Hand,
    blurb: "Shape, polish and gel finishes",
  },
  {
    name: "Spa & Massage",
    icon: Waves,
    blurb: "Slow down with aromatic massage",
  },
];

const reasons = [
  {
    icon: UserCheck,
    title: "Professional stylists",
    text: "Experienced specialists for every service, from precision cuts to bridal beauty.",
  },
  {
    icon: CalendarCheck,
    title: "Easy online booking",
    text: "Pick a service, a day and a time slot. No calls, no waiting for a reply.",
  },
  {
    icon: Gem,
    title: "Flexible scheduling",
    text: "Eight daily slots, live availability, and free cancellation while a request is pending.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    text: "Pay by card through Stripe once your appointment is confirmed.",
  },
];

const steps = [
  {
    title: "Choose a service",
    text: "Browse by category, search by name and compare price and duration.",
  },
  {
    title: "Request a time",
    text: "Select a date and an open slot. The salon reviews and confirms it.",
  },
  {
    title: "Pay and arrive",
    text: "Pay securely online after confirmation, then just show up and enjoy.",
  },
];

export default async function HomePage() {
  const { services, error } = await fetchFeaturedServices(6);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-charcoal-950">
        <SafeImage
          src={HERO_IMAGE}
          alt="Stylist working in a bright salon"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal-950 via-charcoal-950/70 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="hero-rise max-w-2xl">
            <h1 className="!text-white text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Your next appointment, booked in a minute.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
              Hair, skin, makeup, nails and spa. Choose a service you love,
              reserve a time that suits you and pay securely online.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <LinkButton href="/services" size="lg">
                Explore Services <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <Link
                href="/register"
                className={buttonClasses(
                  "outline",
                  "lg",
                  "!border-white/40 !bg-transparent !text-white hover:!bg-white/10 hover:!border-white",
                )}
              >
                <span className="!text-white">Create a free account</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl">Featured salon services</h2>
            <p className="mt-2 max-w-xl text-charcoal-600">
              Fresh from our menu. Every price and duration is shown up front.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blush-700 hover:underline"
          >
            See all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10">
          {error ? (
            <ErrorState message="The services list is temporarily unavailable. Please refresh in a moment." />
          ) : services.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-charcoal-900/15 bg-white p-10 text-center text-charcoal-600">
              New services are coming soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <h2 className="text-4xl">Find your kind of treatment</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ name, icon: Icon, blurb }) => (
            <Link
              key={name}
              href={`/services?category=${encodeURIComponent(name)}`}
              className="group rounded-3xl border border-sand-200 bg-white p-6 transition-colors hover:border-blush-300 hover:bg-blush-50"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blush-100 text-blush-700 transition-colors group-hover:bg-blush-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-sans text-lg font-semibold">{name}</h3>
              <p className="mt-1 text-sm text-charcoal-600">{blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why choose */}
      <section className="mt-24 bg-sand-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="max-w-xl text-4xl">Why people choose SalonBook</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-900 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-sans text-lg font-semibold">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works: a real sequence, so numbered steps are appropriate */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <h2 className="text-4xl">How booking works</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="rounded-3xl border border-sand-200 bg-white p-7"
            >
              <span className="font-display text-5xl text-blush-300">
                {i + 1}
              </span>
              <h3 className="mt-3 font-sans text-lg font-semibold">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Promo */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-charcoal-900">
          <SafeImage
            src={PROMO_IMAGE}
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
          />
          <div className="px-8 py-16 sm:px-14 sm:py-20">
            <h2 className="max-w-xl text-4xl text-white sm:text-5xl">
              Treat yourself this week.
            </h2>
            <p className="mt-4 max-w-lg text-white/80">
              Create an account, request a slot and cancel for free any time
              before the salon confirms it.
            </p>
            <LinkButton href="/register" size="lg" className="mt-8">
              Book your first visit
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
