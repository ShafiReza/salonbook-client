import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LinkButton } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-8xl text-blush-300">403</p>
        <h1 className="mt-2 text-4xl">You don&apos;t have access</h1>
        <p className="mt-3 max-w-md text-charcoal-600">Your account doesn&apos;t have permission to view this page.</p>
        <div className="mt-8 flex gap-3">
          <LinkButton href="/">Back to home</LinkButton>
          <LinkButton href="/login" variant="outline">
            Sign in
          </LinkButton>
        </div>
      </div>
      <Footer />
    </>
  );
}
