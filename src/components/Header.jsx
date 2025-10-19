import { LogIn } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b border-neutral-200/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-serif text-2xl tracking-tight text-neutral-900">
          Parallel
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-700">
          <a href="#principles" className="hover:text-neutral-900 transition-colors">Principles</a>
          <a href="#testimonials" className="hover:text-neutral-900 transition-colors">Testimonials</a>
          <a href="#forum" className="hover:text-neutral-900 transition-colors">Forum</a>
        </nav>
        <a
          href="/login"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-50 transition-colors"
          aria-label="Log in to the private forum"
        >
          <LogIn className="h-4 w-4" />
          <span>Log in</span>
        </a>
      </div>
    </header>
  );
}
