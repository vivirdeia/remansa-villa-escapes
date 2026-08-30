import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, HandHeart, KeyRound, Leaf } from "lucide-react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";

import heroImg from "@/assets/hero-collective.jpg";
import azaharCard from "@/assets/azahar-card.jpg";
import ponienteCard from "@/assets/villa-poniente.jpg";
import salobreCard from "@/assets/villa-salobre.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Remansa — Tres refugios frente al Mediterráneo" },
      {
        name: "description",
        content:
          "Tres villas de alquiler con carácter propio en la costa mediterránea. Luz, sal y calma para desconectar de verdad.",
      },
      { property: "og:title", content: "Remansa — Tres refugios frente al Mediterráneo" },
      {
        property: "og:description",
        content:
          "Villas boutique en la costa mediterránea: Azahar, Poniente y Salobre. Pensadas para desconectar de verdad.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const villas = [
  {
    name: "Villa Azahar",
    tagline: "Donde el aire huele a azahar",
    note: "La más luminosa · Jardín de cítricos · Familias",
    img: azaharCard,
    accent: "bg-azahar",
    to: "/villa-azahar" as const,
    ready: true,
  },
  {
    name: "Villa Poniente",
    tagline: "Un atardecer distinto cada noche",
    note: "La más romántica · Vistas al ocaso · Parejas",
    img: ponienteCard,
    accent: "bg-poniente",
    to: null,
    ready: false,
  },
  {
    name: "Villa Salobre",
    tagline: "A un paso del mar, lejos de todo lo demás",
    note: "La más salvaje · Acceso a cala · Grupos",
    img: salobreCard,
    accent: "bg-salobre",
    to: null,
    ready: false,
  },
];

const pilares = [
  {
    icon: HandHeart,
    title: "Cada villa se cuida como si fuera la única",
    text: "No gestionamos un catálogo. Somos tres casas y un equipo pequeño que las conoce de memoria: qué ventana coge la brisa, a qué hora da el sol en la piscina.",
  },
  {
    icon: Compass,
    title: "Guía local hecha a mano",
    text: "Un cuaderno escrito por quienes viven aquí: la cala sin gente, el horno que abre a las siete, el vino de la cooperativa. Nada patrocinado.",
  },
  {
    icon: KeyRound,
    title: "Check-in sin fricciones",
    text: "Llegas y entras. Te recibimos en persona si te apetece, o encuentras la casa abierta, fresca y con la nevera con lo básico si prefieres el silencio.",
  },
  {
    icon: Leaf,
    title: "Ritmo lento, huella corta",
    text: "Lino lavado en la comarca, jabones de aceite de oliva, huerta de temporada. Lo bonito y lo sensato suelen coincidir.",
  },
];

const lugares = [
  { villa: "Villa Azahar", x: 26, y: 42, color: "var(--azahar)" },
  { villa: "Villa Poniente", x: 55, y: 28, color: "var(--poniente)" },
  { villa: "Villa Salobre", x: 74, y: 58, color: "var(--salobre)" },
];

const resenas = [
  {
    text: "Volvimos a casa con la sensación de haber dormido más horas de las que en realidad dormimos. Eso lo hace el sitio, no el reloj.",
    autor: "Marta y Julián",
    detalle: "Villa Azahar · Junio",
  },
  {
    text: "Nos escribieron tres días antes para preguntar a qué hora llegaba nuestro vuelo. Cuando entramos había pan, aceite y naranjas del jardín.",
    autor: "Familia Oliveira",
    detalle: "Villa Azahar · Agosto",
  },
  {
    text: "He alquilado muchas casas en la costa. Es la primera que no parecía alquilada, sino prestada por alguien con buen gusto.",
    autor: "Anne K.",
    detalle: "Villa Poniente · Septiembre",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader transparent />

      {/* Hero */}
      <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Villa mediterránea sobre el mar a la luz dorada del atardecer"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="veil absolute inset-0" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-24 md:px-12 md:pb-32">
          <p className="eyebrow reveal-up text-background/80">Costa mediterránea · Alicante</p>
          <h1 className="display-xl reveal-up mt-6 max-w-4xl text-background">
            Tres refugios frente al Mediterráneo
          </h1>
          <p className="reveal-up mt-7 max-w-xl text-lg font-light leading-relaxed text-background/85">
            Villas con carácter propio, pensadas para desconectar de verdad.
          </p>
          <div className="reveal-up mt-11">
            <Button asChild variant="onImage" size="editorial">
              <a href="#villas">Descubre tu villa</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-6 py-28 text-center md:py-36">
        <p className="eyebrow">Remansa</p>
        <p className="display-md mt-8 text-balance leading-snug text-ink">
          Un remanso es el punto donde la corriente afloja y el agua se queda quieta. Buscábamos ese
          sitio en la costa. Al no encontrarlo, lo hicimos tres veces.
        </p>
      </section>

      {/* Villas */}
      <section id="villas" className="scroll-mt-24 surface-sand py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">01 — El portfolio</p>
              <h2 className="display-lg mt-5 text-ink">Tres casas, tres formas de parar</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Comparten el mar y el equipo. En todo lo demás, no se parecen en nada.
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {villas.map((v) => (
              <article key={v.name} className="group flex flex-col">
                <div className="media-frame aspect-[4/5]">
                  <img
                    src={v.img}
                    alt={v.name}
                    width={1200}
                    height={1500}
                    loading="lazy"
                    className={v.ready ? "" : "opacity-80 saturate-[0.85]"}
                  />
                </div>
                <div className="mt-7 flex items-center gap-3">
                  <span className={`size-2 rounded-full ${v.accent}`} />
                  <p className="eyebrow">{v.note}</p>
                </div>
                <h3 className="display-md mt-4 text-ink">{v.name}</h3>
                <p className="mt-3 font-serif text-xl italic text-muted-foreground">{v.tagline}</p>
                <div className="mt-7">
                  {v.ready && v.to ? (
                    <Button asChild variant="quiet" size="editorial">
                      <Link to={v.to}>Conocer {v.name.replace("Villa ", "Villa ")}</Link>
                    </Button>
                  ) : (
                    <span className="inline-flex h-12 items-center border border-dashed border-border px-9 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      Próximamente
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Filosofía */}
      <section id="filosofia" className="scroll-mt-24 py-28 md:py-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="eyebrow">02 — Por qué Remansa</p>
          <h2 className="display-lg mt-5 max-w-2xl text-ink">
            Lo que no se ve en las fotos, pero se nota al segundo día
          </h2>

          <div className="mt-16 grid gap-x-14 gap-y-14 md:grid-cols-2">
            {pilares.map((p) => (
              <div key={p.title} className="border-t border-border pt-8">
                <p.icon className="size-6 text-olive" strokeWidth={1.25} />
                <h3 className="mt-6 font-serif text-2xl leading-snug text-ink">{p.title}</h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section id="ubicacion" className="scroll-mt-24 surface-sand py-24 md:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-[1fr_1.3fr] md:px-12">
          <div>
            <p className="eyebrow">03 — Dónde estamos</p>
            <h2 className="display-lg mt-5 text-ink">Entre el cabo y los naranjos</h2>
            <p className="lede mt-7">
              Las tres villas están a menos de veinte minutos entre sí, en la franja de costa que va
              del Cap de la Nau a las calas del norte. Aeropuerto de Alicante a 1 h 10 min; Valencia,
              a 1 h 25 min.
            </p>
            <ul className="mt-10 space-y-4 text-sm text-muted-foreground">
              {[
                ["Cala del Portitxol", "12 min en coche"],
                ["Mercado de Jávea", "9 min a pie desde Azahar"],
                ["Puerto y lonja de pescado", "15 min en coche"],
                ["Parque Natural del Montgó", "20 min en coche"],
              ].map(([lugar, dist]) => (
                <li
                  key={lugar}
                  className="flex items-baseline justify-between gap-6 border-b border-border pb-3"
                >
                  <span className="text-foreground">{lugar}</span>
                  <span className="text-xs uppercase tracking-[0.14em]">{dist}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mapa ilustrativo */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-border bg-card">
            <svg viewBox="0 0 100 75" className="absolute inset-0 size-full" role="img" aria-label="Mapa ilustrativo de la costa con la ubicación de las tres villas">
              <rect width="100" height="75" fill="var(--card)" />
              <path
                d="M0 58 C 18 52, 30 60, 44 50 C 58 40, 66 46, 78 36 C 88 28, 94 30, 100 24 L100 75 L0 75 Z"
                fill="var(--sea)"
                opacity="0.16"
              />
              <path
                d="M0 58 C 18 52, 30 60, 44 50 C 58 40, 66 46, 78 36 C 88 28, 94 30, 100 24"
                fill="none"
                stroke="var(--sea)"
                strokeWidth="0.5"
              />
              {[64, 68, 72].map((y) => (
                <path
                  key={y}
                  d={`M0 ${y} C 25 ${y - 3}, 50 ${y + 3}, 100 ${y - 2}`}
                  fill="none"
                  stroke="var(--sea)"
                  strokeWidth="0.25"
                  opacity="0.35"
                />
              ))}
              {Array.from({ length: 22 }).map((_, i) => (
                <circle
                  key={i}
                  cx={4 + ((i * 37) % 92)}
                  cy={8 + ((i * 53) % 34)}
                  r="0.9"
                  fill="var(--olive)"
                  opacity="0.3"
                />
              ))}
              {lugares.map((l) => (
                <g key={l.villa}>
                  <circle cx={l.x} cy={l.y} r="3.4" fill="var(--sand)" stroke="var(--border)" strokeWidth="0.3" />
                  <circle cx={l.x} cy={l.y} r="1.5" fill={l.color} />
                </g>
              ))}
            </svg>
            <div className="pointer-events-none absolute inset-0">
              {lugares.map((l) => (
                <span
                  key={l.villa}
                  className="absolute -translate-x-1/2 whitespace-nowrap font-serif text-[0.7rem] tracking-wide text-ink md:text-xs"
                  style={{ left: `${l.x}%`, top: `calc(${l.y}% + 4%)` }}
                >
                  {l.villa}
                </span>
              ))}
              <span className="absolute bottom-4 right-5 text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">
                Mar Mediterráneo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Reseñas */}
      <section className="py-28 md:py-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="eyebrow">04 — Quienes ya han vuelto</p>
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {resenas.map((r) => (
              <figure key={r.autor} className="border-t border-border pt-8">
                <blockquote className="font-serif text-xl leading-relaxed text-ink md:text-2xl">
                  «{r.text}»
                </blockquote>
                <figcaption className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {r.autor} — {r.detalle}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-32 text-center">
        <h2 className="display-lg text-ink">¿Y si este año paras de verdad?</h2>
        <p className="lede mt-6">
          Escríbenos y te contamos cuál de las tres encaja contigo. Sin formularios eternos.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild variant="sea" size="editorial">
            <Link to="/villa-azahar">Ver Villa Azahar</Link>
          </Button>
          <Button asChild variant="quiet" size="editorial">
            <a href="mailto:hola@remansa.es">hola@remansa.es</a>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
