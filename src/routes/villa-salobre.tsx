import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bath,
  BedDouble,
  Car,
  ChefHat,
  Flame,
  Footprints,
  Music,
  Snowflake,
  Users,
  Waves,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CondicionesCasa } from "@/components/site/CondicionesCasa";
import { useContenidoVilla } from "@/lib/remansa-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import heroImg from "@/assets/salobre-hero.jpg";
import terraceImg from "@/assets/salobre-terrace.jpg";
import bedroomImg from "@/assets/salobre-bedroom.jpg";
import kitchenImg from "@/assets/salobre-kitchen.jpg";
import coveImg from "@/assets/salobre-cove.jpg";
import villaImg from "@/assets/villa-salobre.jpg";
import calaImg from "@/assets/near-cala.jpg";
import chiringuitoImg from "@/assets/near-chiringuito.jpg";
import senderoImg from "@/assets/near-sendero.jpg";

export const Route = createFileRoute("/villa-salobre")({
  head: () => ({
    meta: [
      { title: "Villa Salobre — A un paso del mar, lejos de todo lo demás | Remansa" },
      {
        name: "description",
        content:
          "Villa Salobre: 6 habitaciones, mesa larga bajo la pérgola y escaleras propias hasta una cala. La casa de Remansa para grupos de amigos.",
      },
      { property: "og:title", content: "Villa Salobre — A un paso del mar, lejos de todo lo demás" },
      {
        property: "og:description",
        content:
          "Piedra, pino y sal. Una casa grande sobre una cala privada, hasta 12 huéspedes, pensada para grupos de amigos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VillaSalobre,
});

const iconosFicha = [BedDouble, Bath, Users, Waves, Flame, Car, Footprints];

const amenities = [
  { icon: Wifi, label: "Wifi de fibra", nota: "600 Mb, repetidor en la casa de invitados" },
  { icon: Waves, label: "Cala privada", nota: "Escalera de piedra propia, kayaks y snorkel incluidos" },
  { icon: Flame, label: "Brasa y horno de leña", nota: "Bajo la pérgola, con mesa para catorce" },
  { icon: Snowflake, label: "Aire acondicionado", nota: "En dormitorios; los muros de piedra hacen el resto" },
  { icon: ChefHat, label: "Cocina para cocinar en grupo", nota: "Doble fregadero, dos hornos, nevera de bodega" },
  { icon: Music, label: "Equipo de sonido exterior", nota: "Sonos en la terraza, con corte a la una de la mañana" },
];

const galeria = [
  { img: terraceImg, espacio: "Pérgola", pie: "La mesa donde acaba cayendo todo el mundo" },
  { img: bedroomImg, espacio: "Dormitorios", pie: "Muros de metro y medio, ventana al azul" },
  { img: kitchenImg, espacio: "Cocina", pie: "Sitio de sobra para cuatro cocineros" },
  { img: villaImg, espacio: "Exterior", pie: "La casa vista desde el sendero" },
  { img: coveImg, espacio: "La cala", pie: "Noventa escalones y ni un alma" },
];


const cerca = [
  {
    img: calaImg,
    titulo: "Cala del Salobre",
    tipo: "El agua",
    text: "La cala de la casa: grava, roca y una posidonia que se ve desde arriba. No aparece señalizada en ninguna carretera, así que casi nunca hay nadie que no venga de la villa.",
  },
  {
    img: chiringuitoImg,
    titulo: "Puerto de Xàbia, tarde-noche",
    tipo: "Salir",
    text: "Quince minutos en coche o taxi. Terrazas junto a los barcos, música hasta las dos y sitios donde cenar tarde sin reserva. Guardad el número del taxista de guardia.",
  },
  {
    img: senderoImg,
    titulo: "Sendero de los Molinos",
    tipo: "Naturaleza",
    text: "Dos horas ida y vuelta por el filo del acantilado, con molinos de viento en ruinas al final. Salid pronto, llevad agua y no lo intentéis en chanclas.",
  },
];

const resenas = [
  {
    text: "Éramos diez y nadie tuvo que hacer cola para nada. Desayunábamos por tandas y a la una ya estábamos todos abajo en la cala.",
    autor: "La cuadrilla de Bilbao",
    detalle: "Diez amigos · Julio",
  },
  {
    text: "El primer día bajamos las escaleras con miedo y el último las subíamos hablando por teléfono. La cala es real y es vuestra.",
    autor: "Guille y compañía",
    detalle: "Ocho amigos · Junio",
  },
  {
    text: "Cocinamos las cinco noches en esa mesa enorme. No pisamos un restaurante y no lo echamos de menos ni un minuto.",
    autor: "Grupo Larrea",
    detalle: "Doce personas · Septiembre",
  },
];

const meses = [
  { nombre: "Junio", dias: 30, inicio: 0, ocupado: [1, 2, 3, 4, 5, 6, 7, 22, 23, 24, 25, 26, 27, 28] },
  { nombre: "Julio", dias: 31, inicio: 2, ocupado: [10, 11, 12, 13, 14, 15, 16, 24, 25, 26, 27, 28, 29, 30] },
  { nombre: "Agosto", dias: 31, inicio: 5, ocupado: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 21, 22, 23, 24, 25, 26, 27] },
];

function VillaSalobre() {
  const contenido = useContenidoVilla("salobre");
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

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    entrada: "",
    salida: "",
    huespedes: "8",
    mensaje: "",
  });

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Solicitud enviada", {
      description: `Gracias, ${form.nombre || "de nuevo"}. Te respondemos en menos de 24 h con la confirmación y el presupuesto.`,
    });
    setForm({ nombre: "", email: "", entrada: "", salida: "", huespedes: "8", mensaje: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader transparent />

      {/* Hero */}
      <section className="relative h-[92svh] min-h-[600px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Villa Salobre, casa de piedra sobre un acantilado con acceso a una cala"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="veil absolute inset-0" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-24 md:px-12 md:pb-28">
          <div className="reveal-up flex items-center gap-3">
            <span className="size-2 rounded-full bg-salobre" />
            <p className="eyebrow text-background/80">Remansa · Villa 03</p>
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
              Pensado para que doce personas convivan sin estorbarse.
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
                        : "bg-salobre/20 text-ink",
                    )}
                  >
                    {dia}
                  </span>
                ),
              )}
            </div>

            <div className="mt-8 flex gap-8 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-salobre/40" /> Libre
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
              {contenido.fianza} € devuelta a las 48 h de la salida. Grupos de más de doce personas
              y despedidas: consúltanos antes de reservar.
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

          <form onSubmit={enviar} className="space-y-6 border border-border bg-card p-8 md:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="eyebrow">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0"
                  placeholder="Guillermo Sáez"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="eyebrow">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0"
                  placeholder="guille@correo.es"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entrada" className="eyebrow">
                  Entrada
                </Label>
                <Input
                  id="entrada"
                  type="date"
                  required
                  value={form.entrada}
                  onChange={(e) => setForm({ ...form, entrada: e.target.value })}
                  className="rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salida" className="eyebrow">
                  Salida
                </Label>
                <Input
                  id="salida"
                  type="date"
                  required
                  value={form.salida}
                  onChange={(e) => setForm({ ...form, salida: e.target.value })}
                  className="rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="huespedes" className="eyebrow">
                Huéspedes
              </Label>
              <Input
                id="huespedes"
                type="number"
                min={1}
                max={12}
                value={form.huespedes}
                onChange={(e) => setForm({ ...form, huespedes: e.target.value })}
                className="rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensaje" className="eyebrow">
                Cuéntanos algo
              </Label>
              <Textarea
                id="mensaje"
                rows={4}
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                className="resize-none rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0"
                placeholder="Somos diez y llegamos en tres coches…"
              />
            </div>

            <Button type="submit" variant="sea" size="editorial" className="w-full">
              Solicitar reserva
            </Button>
            <p className="text-center text-[0.7rem] leading-relaxed text-muted-foreground">
              Solicitud sin compromiso. Todavía no se realiza ningún cargo.
            </p>
          </form>
        </div>
      </section>

      {/* Qué hay cerca */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="eyebrow">Qué hay cerca</p>
          <h2 className="display-lg mt-5 max-w-xl text-ink">
            Tres sitios que recomendaríamos a un amigo
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
              <Link to="/villa-poniente">Villa Poniente</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
