import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="surface-sand border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-serif text-3xl tracking-[0.22em] uppercase text-ink">Remansa</p>
            <p className="lede mt-5 max-w-xs text-base">
              Tres casas frente al Mediterráneo, cuidadas de una en una. Sin prisa, sin ruido.
            </p>
          </div>

          <div>
            <p className="eyebrow">Las villas</p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/villa-azahar" className="transition-colors hover:text-sea">
                  Villa Azahar
                </Link>
              </li>
              <li>
                <Link to="/villa-poniente" className="transition-colors hover:text-sea">
                  Villa Poniente
                </Link>
              </li>
              <li>
                <Link to="/villa-salobre" className="transition-colors hover:text-sea">
                  Villa Salobre
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Contacto</p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-olive" />
                hola@remansa.es
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-olive" />
                +34 965 __ __ __
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="size-4 text-olive" />
                @remansa.villas
              </li>
              <li className="pt-2 leading-relaxed">
                Cap de la Nau, Jávea
                <br />
                Alicante, España
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Idioma</p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="text-foreground">Español</li>
              <li className="opacity-60">English</li>
              <li className="opacity-60">Deutsch</li>
              <li className="opacity-60">Français</li>
            </ul>
          </div>
        </div>

        <div className="rule-hair mt-16" />
        <div className="mt-8 flex flex-col gap-3 text-xs tracking-wide text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Remansa. Alquiler vacacional en la costa mediterránea.</p>
          <p className="flex gap-6">
            <span>Aviso legal</span>
            <span>Privacidad</span>
            <span>Condiciones de reserva</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
