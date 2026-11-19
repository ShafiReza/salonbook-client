import Link from "next/link";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="mt-24 bg-charcoal-950 text-charcoal-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Book hair, skin, makeup, nail and spa appointments with trusted stylists, and pay securely online.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: Instagram, label: "Instagram" },
              { Icon: Twitter, label: "Twitter" },
            ].map(({ Icon, label }) => (
              <a key={label} href="#" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-800 text-white transition-colors hover:bg-blush-600">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-sans text-base font-semibold text-white">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["Home", "/"],
              ["Browse Services", "/services"],
              ["Sign In", "/login"],
              ["Create an account", "/register"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-base font-semibold text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blush-400" /> House 12, Road 5, Gulshan, Dhaka 1212
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blush-400" /> +880 1700 000000
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blush-400" /> hello@salonbook.com
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-base font-semibold text-white">Opening hours</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-blush-400" /> Sat – Thu: 9:00 AM – 6:00 PM
            </li>
            <li className="pl-7">Friday: Closed</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-charcoal-800 py-5 text-center text-xs">© {new Date().getFullYear()} SalonBook. All rights reserved.</div>
    </footer>
  );
}
