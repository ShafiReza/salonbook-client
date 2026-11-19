import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-8xl text-blush-300">404</p>
        <h1 className="mt-2 text-4xl">We can&apos;t find that page</h1>
        <p className="mt-3 max-w-md text-charcoal-600">The link may be broken or the page may have moved.</p>
        <div className="mt-8 flex gap-3">
          <LinkButton href="/">Back to home</LinkButton>
          <LinkButton href="/services" variant="outline">
            Browse services
          </LinkButton>
        </div>
      </div>
      <Footer />
    </>
  );
}
