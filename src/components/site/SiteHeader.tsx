import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Las villas", to: "/", hash: "villas" },
  { label: "Por qué Remansa", to: "/", hash: "filosofia" },
  { label: "Dónde estamos", to: "/", hash: "ubicacion" },
];

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const light = transparent && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-700",
        scrolled ? "bg-background/85 backdrop-blur-md py-4 shadow-[0_1px_0_var(--border)]" : "py-7",
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-12">
        <Link
          to="/"
          className={cn(
            "font-serif text-2xl tracking-[0.22em] uppercase transition-colors duration-500",
            light ? "text-background drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)]" : "text-ink",
          )}
        >
          Remansa
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={`${l.to}#${l.hash}`}
              className={cn(
                "text-[0.7rem] uppercase tracking-[0.2em] transition-opacity duration-300 hover:opacity-60",
                light ? "text-background drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]" : "text-muted-foreground",
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="/villa-azahar#reservar"
          className={cn(
            "border px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-500",
            light
              ? "border-background/70 text-background backdrop-blur-[2px] hover:bg-background hover:text-ink"
              : "border-border text-foreground hover:border-sea hover:text-sea",
          )}
        >
          Reservar
        </a>
      </div>
    </header>
  );
}
