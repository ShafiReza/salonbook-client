import { HERO_IMAGE } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";
import { SafeImage } from "@/components/ui/Media";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="relative hidden overflow-hidden bg-charcoal-950 lg:block">
        <SafeImage src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/30 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Logo light />
          <p className="max-w-md font-display text-4xl leading-tight text-white">Beautiful hair, skin and nails start with a simple booking.</p>
        </div>
      </div>
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">{children}</div>
      </div>
    </div>
  );
}
