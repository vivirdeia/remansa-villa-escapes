import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bath,
  BedDouble,
  Car,
  ChefHat,
  Dog,
  Footprints,
  Snowflake,
  Sprout,
  Users,
  Waves,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import heroImg from "@/assets/villa-azahar.jpg";
import poolImg from "@/assets/azahar-pool.jpg";
import bedroomImg from "@/assets/azahar-bedroom.jpg";
import kitchenImg from "@/assets/azahar-kitchen.jpg";
import livingImg from "@/assets/azahar-living.jpg";
import detailImg from "@/assets/azahar-detail.jpg";
import calaImg from "@/assets/near-cala.jpg";
import restImg from "@/assets/near-restaurant.jpg";
import marketImg from "@/assets/near-market.jpg";

export const Route = createFileRoute("/villa-azahar")({
  head: () => ({
    meta: [
      { title: "Villa Azahar — Donde el aire huele a azahar | Remansa" },
      {
        name: "description",
        content:
          "Villa Azahar: 4 habitaciones, piscina privada y jardín de naranjos a 8 minutos a pie de la playa. Reserva directa con Remansa.",
      },
      { property: "og:title", content: "Villa Azahar — Donde el aire huele a azahar" },
      {
        property: "og:description",
        content:
          "Un jardín de naranjos, una piscina que mira al mar y habitaciones pensadas para el silencio. Hasta 8 huéspedes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VillaAzahar,
});

const iconosFicha = [BedDouble, Bath, Users, Waves, Sprout, Car, Footprints];

const amenities = [
  { icon: Wifi, label: "Wifi de fibra", nota: "600 Mb, cobertura en el jardín" },
  { icon: Waves, label: "Piscina privada", nota: "10 × 4 m, climatizada en temporada baja" },
  { icon: Snowflake, label: "Aire acondicionado", nota: "Frío y calor en todas las estancias" },
  { icon: ChefHat, label: "Cocina equipada", nota: "Horno, lavavajillas, cafetera de espresso" },
  { icon: Dog, label: "Mascotas admitidas", nota: "Sin suplemento, con jardín vallado" },
  { icon: Car, label: "Parking", nota: "Dos plazas a cubierto dentro de la parcela" },
];

const galeria = [
  { img: poolImg, espacio: "Exterior", pie: "La piscina al final de la tarde" },
  { img: livingImg, espacio: "Salón", pie: "Arcos abiertos al mar" },
  { img: bedroomImg, espacio: "Dormitorios", pie: "Persianas de madera, lino lavado" },
  { img: kitchenImg, espacio: "Cocina", pie: "Mesa larga y fruta del jardín" },
  { img: detailImg, espacio: "Jardín", pie: "El azahar, en marzo y otra vez en septiembre" },
];

const temporadas = [
  { nombre: "Temporada baja", meses: "Noviembre – marzo", precio: "290 €", min: "3 noches" },
  { nombre: "Media", meses: "Abril, mayo, octubre", precio: "410 €", min: "4 noches" },
  { nombre: "Alta", meses: "Junio, septiembre", precio: "560 €", min: "5 noches" },
  { nombre: "Muy alta", meses: "Julio y agosto", precio: "740 €", min: "7 noches" },
];

const cerca = [
  {
    img: calaImg,
    titulo: "Cala Sardinera",
    tipo: "Baño",
    text: "Grava clara y agua transparente. Se llega por un camino de pinos: 12 minutos en coche y otros diez andando. Mejor antes de las once.",
  },
  {
    img: restImg,
    titulo: "Casa Manuela",
    tipo: "Mesa",
    text: "Cuatro mesas sobre las rocas y lo que haya traído la lonja. Pide el gallo de San Pedro y déjales elegir el vino. Reservan por teléfono, no por internet.",
  },
  {
    img: marketImg,
    titulo: "Mercado de Jávea",
    tipo: "Despensa",
    text: "Jueves por la mañana. Tomate valenciano, olivas partidas, almendra marcona. Salir con la bolsa llena cuesta menos de veinte euros.",
  },
];

const resenas = [
  {
    text: "Los niños desayunaban bajo el naranjo y nosotros no miramos el móvil en cinco días. La casa hace ese trabajo por ti.",
    autor: "Elena y Diego",
    detalle: "Cuatro adultos, dos niños · Julio",
  },
  {
    text: "El olor entra por las ventanas a primera hora. Nos llevamos a casa una bolsita de flor seca y aún la conservamos.",
    autor: "Sophie D.",
    detalle: "Pareja · Abril",
  },
  {
    text: "Cocina de verdad, con espacio para cocinar de verdad. Cenamos los seis en la mesa del jardín todas las noches.",
    autor: "Los Peris",
    detalle: "Grupo familiar · Septiembre",
  },
];

const meses = [
  { nombre: "Junio", dias: 30, inicio: 0, ocupado: [6, 7, 8, 9, 10, 11, 12, 20, 21, 22] },
  { nombre: "Julio", dias: 31, inicio: 2, ocupado: [1, 2, 3, 4, 5, 6, 7, 15, 16, 17, 18, 19, 20, 21] },
  { nombre: "Agosto", dias: 31, inicio: 5, ocupado: [8, 9, 10, 11, 12, 13, 14, 25, 26, 27, 28, 29, 30, 31] },
];

function VillaAzahar() {
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
    huespedes: "4",
    mensaje: "",
  });

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Solicitud enviada", {
      description: `Gracias, ${form.nombre || "de nuevo"}. Te respondemos en menos de 24 h con la confirmación y el presupuesto.`,
    });
    setForm({ nombre: "", email: "", entrada: "", salida: "", huespedes: "4", mensaje: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader transparent />

      {/* Hero */}
      <section className="relative h-[92svh] min-h-[600px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Fachada de Villa Azahar con jardín de naranjos a la luz de la mañana"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="veil absolute inset-0" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-24 md:px-12 md:pb-28">
          <div className="reveal-up flex items-center gap-3">
            <span className="size-2 rounded-full bg-azahar" />
            <p className="eyebrow text-background/80">Remansa · Villa 01</p>
          </div>
          <h1 className="display-xl reveal-up mt-6 text-background">Villa Azahar</h1>
          <p className="reveal-up mt-5 font-serif text-2xl italic text-background/90 md:text-3xl">
            Donde el aire huele a azahar
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
          Hay casas que se visitan y casas que se recuerdan. Villa Azahar es de las segundas.
        </p>
        <p className="lede mt-8 text-center">
          Un jardín de naranjos que perfuma cada mañana, una piscina que mira al mar y habitaciones
          pensadas para que el silencio también forme parte de las vacaciones.
        </p>
      </section>

      {/* Ficha práctica */}
      <section className="surface-sand py-20 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="eyebrow">Ficha práctica</p>
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4 lg:grid-cols-7">
            {ficha.map((f) => (
              <div key={f.label} className="border-t border-border pt-5">
                <f.icon className="size-5 text-olive" strokeWidth={1.25} />
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
              Nada de listas infinitas: solo lo que de verdad usarás.
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
                <div className={cn("media-frame", i === 0 ? "aspect-[16/10]" : i === 1 ? "aspect-[3/4]" : "aspect-[4/3]")}>
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
                <span key={d} className="pb-3 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
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
                        : "bg-azahar/25 text-ink",
                    )}
                  >
                    {dia}
                  </span>
                ),
              )}
            </div>

            <div className="mt-8 flex gap-8 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-azahar/40" /> Libre
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
              {temporadas.map((t) => (
                <li
                  key={t.nombre}
                  className="flex items-baseline justify-between gap-6 border-b border-border py-5"
                >
                  <div>
                    <p className="font-serif text-xl text-ink">{t.nombre}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {t.meses} · mínimo {t.min}
                    </p>
                  </div>
                  <p className="whitespace-nowrap font-serif text-2xl text-sea">{t.precio}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              Limpieza final 140 €. Ropa de cama y toallas incluidas. Fianza 500 € devuelta a las 48
              h de la salida. Estancias largas (más de 14 noches): consúltanos.
            </p>
          </div>
        </div>
      </section>

      {/* Reserva */}
      <section id="reservar" className="scroll-mt-24 surface-sand py-24 md:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-[1fr_1.1fr] md:px-12">
          <div>
            <p className="eyebrow">Reserva directa</p>
            <h2 className="display-lg mt-5 text-ink">Dinos cuándo y lo miramos hoy mismo</h2>
            <p className="lede mt-7">
              Nada de pagos automáticos ni respuestas de robot. Recibimos tu solicitud, comprobamos
              el calendario y te escribimos con el presupuesto cerrado.
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
                  placeholder="Marta Ferrer"
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
                  placeholder="marta@correo.es"
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
                max={8}
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
                placeholder="Venimos con un perro y dos niños pequeños…"
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
          <div className="mt-16">
            <Button asChild variant="quiet" size="editorial">
              <Link to="/">Ver las otras villas</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
