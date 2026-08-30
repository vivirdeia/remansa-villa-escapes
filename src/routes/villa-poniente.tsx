import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bath,
  BedDouble,
  Car,
  ChefHat,
  Flame,
  Footprints,
  Snowflake,
  Sun,
  Users,
  Waves,
  Wifi,
} from "lucide-react";
import { FormularioReserva } from "@/components/site/FormularioReserva";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CondicionesCasa } from "@/components/site/CondicionesCasa";
import { useContenidoVilla } from "@/lib/remansa-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import heroImg from "@/assets/villa-poniente.jpg";
import terraceImg from "@/assets/poniente-terrace.jpg";
import bedroomImg from "@/assets/poniente-bedroom.jpg";
import poolImg from "@/assets/poniente-pool.jpg";
import livingImg from "@/assets/poniente-living.jpg";
import detailImg from "@/assets/poniente-detail.jpg";
import miradorImg from "@/assets/near-mirador.jpg";
import romanticImg from "@/assets/near-romantic.jpg";
import restImg from "@/assets/near-restaurant.jpg";

export const Route = createFileRoute("/villa-poniente")({
  head: () => ({
    meta: [
      { title: "Villa Poniente — Un atardecer distinto cada noche | Remansa" },
      {
        name: "description",
        content:
          "Villa Poniente: 2 habitaciones, piscina desbordante y una terraza orientada al ocaso. Una casa íntima para parejas en la costa de Jávea.",
      },
      { property: "og:title", content: "Villa Poniente — Un atardecer distinto cada noche" },
      {
        property: "og:description",
        content:
          "La más romántica de las tres. Terraza al oeste, piscina sobre el mar y silencio de verdad. Hasta 4 huéspedes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VillaPoniente,
});

const iconosFicha = [BedDouble, Bath, Users, Sun, Waves, Car, Footprints];

const amenities = [
  { icon: Wifi, label: "Wifi de fibra", nota: "400 Mb, cobertura también en la terraza" },
  { icon: Waves, label: "Piscina desbordante", nota: "8 × 3 m, orientada al oeste, climatizada" },
  { icon: Flame, label: "Chimenea de leña", nota: "En el salón, con leña de almendro incluida" },
  { icon: Snowflake, label: "Aire acondicionado", nota: "Frío y calor, silencioso en dormitorios" },
  { icon: ChefHat, label: "Cocina de autor", nota: "Vitro de inducción, vinoteca y cafetera italiana" },
  { icon: Car, label: "Parking", nota: "Una plaza cubierta bajo la pérgola" },
];

const galeria = [
  { img: terraceImg, espacio: "Terraza", pie: "El sitio donde acaba el día" },
  { img: bedroomImg, espacio: "Dormitorio", pie: "Puertas abiertas, sin cortinas" },
  { img: poolImg, espacio: "Piscina", pie: "El agua se queda naranja media hora" },
  { img: livingImg, espacio: "Salón", pie: "Chimenea encendida en marzo" },
  { img: detailImg, espacio: "Detalle", pie: "Dos copas y nada más que hacer" },
];


const cerca = [
  {
    img: miradorImg,
    titulo: "Mirador del Cap Negre",
    tipo: "Ocaso",
    text: "Siete minutos en coche y un banco de piedra que mira al oeste. Llevad una manta: cuando el sol baja, el viento cambia. Es el único plan que repite casi todo el mundo.",
  },
  {
    img: romanticImg,
    titulo: "La Terraza del Faro",
    tipo: "Cena",
    text: "Ocho mesas con vela sobre el acantilado. Cocina de mercado, carta corta y un moscatel de la casa que sirven sin que lo pidas. Reservad con dos días.",
  },
  {
    img: restImg,
    titulo: "Paseo del Portitxol",
    tipo: "Caminar",
    text: "Cuarenta minutos de sendero llano entre casas blancas y agua turquesa. A media tarde no hay nadie y se oye el mar contra las rocas todo el rato.",
  },
];

const resenas = [
  {
    text: "Cenamos en la terraza las cinco noches. Ninguna puesta de sol se pareció a la anterior, y eso que mirábamos exactamente al mismo sitio.",
    autor: "Clara y Nacho",
    detalle: "Pareja · Mayo",
  },
  {
    text: "Pedimos venir por nuestro aniversario y nos dejaron flores del campo y una nota escrita a mano. Nadie hace ya eso.",
    autor: "Hannah y Peter",
    detalle: "Pareja · Octubre",
  },
  {
    text: "Casa pequeña, decisión acertada. Todo estaba donde tenía que estar y no sobraba una sola habitación.",
    autor: "Lucía R.",
    detalle: "Escapada de dos · Marzo",
  },
];

const meses = [
  { nombre: "Junio", dias: 30, inicio: 0, ocupado: [3, 4, 5, 6, 17, 18, 19, 26, 27, 28] },
  { nombre: "Julio", dias: 31, inicio: 2, ocupado: [8, 9, 10, 11, 12, 22, 23, 24, 25, 26] },
  { nombre: "Agosto", dias: 31, inicio: 5, ocupado: [1, 2, 3, 4, 5, 14, 15, 16, 17, 18, 19, 20] },
];

function VillaPoniente() {
  const contenido = useContenidoVilla("poniente");
  const ficha = useMemo(
    () =>
      [
        `${contenido.habitaciones} habitaciones`,
        `${contenido.banos} baños`,
        `Hasta ${contenido.huespedesMax} huéspedes`,
        ...contenido.fichaExtra,
      ]
        .filter(Boolean)
        .map((label, i) => ({ label, Icon: iconosFicha[Math.min(i, iconosFicha.length - 1)]! })),
    [contenido],
  );
  const [mesActivo, setMesActivo] = useState(0);
  const mes = meses[mesActivo]!;
  const celdas = useMemo(
    () => [
      ...Array.from({ length: mes.inicio }, () => null),
      ...Array.from({ length: mes.dias }, (_, i) => i + 1),
    ],
    [mes],
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader transparent />

      {/* Hero */}
      <section className="relative h-[92svh] min-h-[600px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Villa Poniente con la terraza orientada al mar durante el atardecer"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="veil absolute inset-0" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-24 md:px-12 md:pb-28">
          <div className="reveal-up flex items-center gap-3">
            <span className="size-2 rounded-full bg-poniente" />
            <p className="eyebrow text-background/80">Remansa · Villa 02</p>
          </div>
          <h1 className="display-xl reveal-up mt-6 text-background">{contenido.nombre}</h1>
          <p className="reveal-up mt-5 font-serif text-2xl italic text-background/90 md:text-3xl">
            {contenido.tagline}
          </p>
          <div className="reveal-up mt-10 flex flex-wrap gap-4">
            <Button asChild variant="onImage" size="editorial">
              <a href="#reservar">Consultar fechas</a>
            </Button>
            <Button asChild variant="onImage" size="editorial">
              <a href="#galeria">Ver la casa</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Descripción */}
      <section className="mx-auto max-w-3xl px-6 py-28 md:py-36">
        <p className="eyebrow text-center">La casa</p>
        <p className="display-md mt-8 text-balance text-center leading-snug text-ink">
          {contenido.descripcionTitulo}
        </p>
        <p className="lede mt-8 text-center">{contenido.descripcion}</p>
      </section>

      {/* Ficha práctica */}
      <section className="surface-sand py-20 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="eyebrow">Ficha práctica</p>
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4 lg:grid-cols-7">
            {ficha.map((f) => (
              <div key={f.label} className="border-t border-border pt-5">
                <f.Icon className="size-5 text-olive" strokeWidth={1.25} />
                <p className="mt-4 text-sm leading-snug text-foreground">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="display-lg text-ink">Lo que encontrarás dentro</h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Una casa pequeña obliga a elegir bien. Esto es lo que quedó.
            </p>
          </div>
          <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {amenities.map((a) => (
              <div key={a.label} className="flex gap-5 border-t border-border pt-7">
                <a.icon className="mt-1 size-5 shrink-0 text-sea" strokeWidth={1.25} />
                <div>
                  <p className="font-serif text-xl text-ink">{a.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.nota}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" className="scroll-mt-24 surface-sand py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="eyebrow">Galería · por espacios</p>
          <h2 className="display-lg mt-5 text-ink">Recorrido por la casa</h2>

          <div className="mt-14 grid gap-6 md:grid-cols-6">
            {galeria.map((g, i) => (
              <figure
                key={g.pie}
                className={cn(
                  "group",
                  i === 0 && "md:col-span-4",
                  i === 1 && "md:col-span-2",
                  i === 2 && "md:col-span-2",
                  i === 3 && "md:col-span-2",
                  i === 4 && "md:col-span-2",
                )}
              >
                <div
                  className={cn(
                    "media-frame",
                    i === 0 ? "aspect-[16/10]" : i === 1 ? "aspect-[3/4]" : "aspect-[4/3]",
                  )}
                >
                  <img src={g.img} alt={g.pie} width={1400} height={1000} loading="lazy" />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {g.espacio}
                  </span>
                  <span className="font-serif text-base italic text-ink">{g.pie}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Calendario y precios */}
      <section className="py-24 md:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-2 md:px-12">
          <div>
            <p className="eyebrow">Disponibilidad</p>
            <h2 className="display-lg mt-5 text-ink">Temporada 2026</h2>
            <div className="mt-9 flex gap-2">
              {meses.map((m, i) => (
                <button
                  key={m.nombre}
                  onClick={() => setMesActivo(i)}
                  className={cn(
                    "border px-5 py-2 text-xs uppercase tracking-[0.16em] transition-colors duration-300",
                    i === mesActivo
                      ? "border-sea bg-sea text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-sea hover:text-sea",
                  )}
                >
                  {m.nombre}
                </button>
              ))}
            </div>

            <div className="mt-9 grid grid-cols-7 gap-y-2 text-center">
              {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                <span
                  key={d}
                  className="pb-3 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground"
                >
                  {d}
                </span>
              ))}
              {celdas.map((dia, i) =>
                dia === null ? (
                  <span key={`v-${i}`} />
                ) : (
                  <span
                    key={dia}
                    className={cn(
                      "mx-auto flex size-9 items-center justify-center rounded-full text-sm transition-colors",
                      mes.ocupado.includes(dia)
                        ? "bg-muted text-muted-foreground line-through decoration-terracotta/60"
                        : "bg-poniente/25 text-ink",
                    )}
                  >
                    {dia}
                  </span>
                ),
              )}
            </div>

            <div className="mt-8 flex gap-8 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-poniente/40" /> Libre
              </span>
              <span className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-muted" /> Reservado
              </span>
            </div>
          </div>

          <div>
            <p className="eyebrow">Precios por noche</p>
            <h2 className="display-lg mt-5 text-ink">Sin comisiones de portal</h2>
            <ul className="mt-9">
              {contenido.temporadas.map((t) => (
                <li
                  key={t.nombre}
                  className="flex items-baseline justify-between gap-6 border-b border-border py-5"
                >
                  <div>
                    <p className="font-serif text-xl text-ink">{t.nombre}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {t.meses} · mínimo {t.minNoches} noches
                    </p>
                  </div>
                  <p className="whitespace-nowrap font-serif text-2xl text-sea">{t.precio} €</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              Limpieza final {contenido.limpiezaFinal} €. Ropa de cama y toallas incluidas. Fianza{" "}
              {contenido.fianza} € devuelta a las 48 h de la salida. Escapadas de dos noches
              disponibles fuera de temporada alta.
            </p>
          </div>
        </div>
      </section>

      <CondicionesCasa contenido={contenido} />


      {/* Reserva */}
      <section id="reservar" className="scroll-mt-24 surface-sand py-24 md:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-[1fr_1.1fr] md:px-12">
          <div>
            <p className="eyebrow">Reserva directa</p>
            <h2 className="display-lg mt-5 text-ink">Dinos cuándo y lo miramos hoy mismo</h2>
            <p className="lede mt-7">
              Nada de pagos automáticos ni respuestas de robot. Recibimos tu solicitud, comprobamos el
              calendario y te escribimos con el presupuesto cerrado.
            </p>
            <div className="rule-hair mt-10" />
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              ¿Prefieres hablar? <span className="text-foreground">+34 965 __ __ __</span>
              <br />
              Marina y Toni · Lunes a sábado, 9:00 – 20:00
            </p>
          </div>

          <FormularioReserva villa="poniente" huespedesMax={contenido.huespedesMax} placeholderMensaje="Es nuestro aniversario, cualquier detalle suma…" />
        </div>
      </section>

      {/* Qué hay cerca */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="eyebrow">Qué hay cerca</p>
          <h2 className="display-lg mt-5 max-w-xl text-ink">
            Tres planes para las horas de luz que quedan
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {cerca.map((c) => (
              <article key={c.titulo} className="group">
                <div className="media-frame aspect-[4/3]">
                  <img src={c.img} alt={c.titulo} width={1200} height={900} loading="lazy" />
                </div>
                <p className="eyebrow mt-6">{c.tipo}</p>
                <h3 className="mt-3 font-serif text-2xl text-ink">{c.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Reseñas */}
      <section className="surface-sand py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="eyebrow">Han dormido aquí</p>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
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
          <div className="mt-16 flex flex-wrap gap-4">
            <Button asChild variant="quiet" size="editorial">
              <Link to="/">Ver las otras villas</Link>
            </Button>
            <Button asChild variant="quiet" size="editorial">
              <Link to="/villa-salobre">Villa Salobre</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
