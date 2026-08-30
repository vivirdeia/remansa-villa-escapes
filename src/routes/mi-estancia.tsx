import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Home,
  KeyRound,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  buscarReserva,
  diasHasta,
  formatoFecha,
  villas,
  type Reserva,
} from "@/lib/remansa-data";

export const Route = createFileRoute("/mi-estancia")({
  head: () => ({
    meta: [
      { title: "Mi estancia — Portal del huésped | Remansa" },
      {
        name: "description",
        content:
          "Accede con tu código de reserva a la guía de la casa, el check-in sin contacto y las recomendaciones de tu villa Remansa.",
      },
      { property: "og:title", content: "Mi estancia — Portal del huésped Remansa" },
      {
        property: "og:description",
        content: "Wifi, llegada, normas y recomendaciones de tu villa, en un solo sitio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MiEstancia,
});

function MiEstancia() {
  const [codigo, setCodigo] = useState("");
  const [reserva, setReserva] = useState<Reserva | null>(null);

  const entrar = (e: React.FormEvent) => {
    e.preventDefault();
    const encontrada = buscarReserva(codigo);
    if (!encontrada) {
      toast.error("No encontramos ese código", {
        description: "Prueba con AZAHAR-2026, PONIENTE-2026 o SALOBRE-2026.",
      });
      return;
    }
    setReserva(encontrada);
    toast.success(`Bienvenida a ${villas[encontrada.villa].name}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      {reserva ? (
        <Estancia reserva={reserva} onSalir={() => setReserva(null)} />
      ) : (
        <Acceso codigo={codigo} setCodigo={setCodigo} onSubmit={entrar} />
      )}
      <SiteFooter />
    </div>
  );
}

function Acceso({
  codigo,
  setCodigo,
  onSubmit,
}: {
  codigo: string;
  setCodigo: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-[1400px] items-center px-6 pt-40 pb-24 md:px-12">
      <div className="mx-auto w-full max-w-xl">
        <p className="eyebrow">Portal del huésped</p>
        <h1 className="display-lg mt-4 text-ink">Tu estancia, en un solo sitio</h1>
        <p className="lede mt-5">
          Introduce el código que te enviamos por correo al confirmar la reserva. No necesitas crear
          ninguna cuenta.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-4">
          <div>
            <Label htmlFor="codigo" className="eyebrow">
              Código de reserva
            </Label>
            <Input
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="AZAHAR-2026"
              className="mt-3 h-14 text-lg tracking-[0.16em] uppercase"
              autoComplete="off"
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Entrar
          </Button>
        </form>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Códigos de demostración
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["AZAHAR-2026", "PONIENTE-2026", "SALOBRE-2026"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCodigo(c)}
                className="border border-border px-3 py-2 text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-sea hover:text-sea"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function Estancia({ reserva, onSalir }: { reserva: Reserva; onSalir: () => void }) {
  const villa = villas[reserva.villa];
  const dias = Math.max(diasHasta(reserva.llegada), 0);
  const noches = Math.round(
    (new Date(reserva.salida).getTime() - new Date(reserva.llegada).getTime()) / 86400000,
  );

  const enviarMensaje = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = new FormData(form);
    const asunto = String(datos.get("asunto") || "").trim();
    const mensaje = String(datos.get("mensaje") || "").trim();

    añadirMensaje({
      huesped: reserva.huesped,
      villa: reserva.villa,
      de: "huesped",
      texto: asunto ? `${asunto}: ${mensaje}` : mensaje,
    });

    toast.success("Mensaje enviado a Marta", {
      description: "Te responderá en menos de una hora (demo, no se envía nada real).",
    });
    form.reset();
  };

  return (
    <main className="pb-24">
      {/* Bienvenida */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <img
          src={villa.hero}
          alt={villa.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="veil absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-12 md:pb-24">
          <button
            onClick={onSalir}
            className="mb-8 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-background/80 transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Otro código
          </button>
          <p
            className="inline-block h-1.5 w-16"
            style={{ backgroundColor: villa.accentVar }}
            aria-hidden
          />
          <h1 className="display-xl mt-6 text-background">Hola, {reserva.huesped}</h1>
          <p className="mt-4 max-w-2xl text-lg font-light text-background/85">
            Quedan <strong className="font-normal">{dias} días</strong> para tu estancia en{" "}
            {villa.name}. {noches} noches, {reserva.huespedes} huéspedes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { n: dias, l: "días" },
              { n: noches, l: "noches" },
              { n: reserva.huespedes, l: "huéspedes" },
            ].map((b) => (
              <div
                key={b.l}
                className="min-w-24 border border-background/40 px-5 py-3 text-center backdrop-blur-[2px]"
              >
                <p className="font-serif text-3xl text-background">{b.n}</p>
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-background/75">{b.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        {/* Fechas */}
        <section className="grid gap-8 border-b border-border py-14 md:grid-cols-3">
          {[
            { icon: CalendarDays, t: "Llegada", d: formatoFecha(reserva.llegada), s: villa.checkIn },
            { icon: CalendarDays, t: "Salida", d: formatoFecha(reserva.salida), s: villa.checkOut },
            { icon: Home, t: "Reserva", d: reserva.codigo, s: villa.direccion },
          ].map((c) => (
            <div key={c.t} className="flex gap-4">
              <c.icon className="mt-1 h-5 w-5 shrink-0 text-sea" />
              <div>
                <p className="eyebrow">{c.t}</p>
                <p className="mt-2 font-serif text-xl text-ink capitalize">{c.d}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.s}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Check-in sin contacto */}
        <section className="grid gap-12 border-b border-border py-16 md:grid-cols-2">
          <div>
            <p className="eyebrow">Check-in sin contacto</p>
            <h2 className="display-md mt-4 text-ink">Entrar es así de simple</h2>
            <div className="mt-8 space-y-6">
              <Dato icon={KeyRound} titulo="Código de la caja fuerte">
                <p className="font-serif text-4xl tracking-[0.3em] text-ink">{villa.caja}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  La caja está a la derecha de la puerta principal. Devuelve las llaves al salir y
                  gira la rueda.
                </p>
              </Dato>
              <Dato icon={Clock} titulo="Horarios">
                <p className="text-sm text-muted-foreground">
                  Entrada: {villa.checkIn}. Salida: {villa.checkOut}. Si necesitas flexibilidad,
                  escríbenos con un día de antelación.
                </p>
              </Dato>
              <Dato icon={MapPin} titulo="Cómo llegar">
                <p className="text-sm text-muted-foreground">{villa.llegada}</p>
                <p className="mt-2 text-sm text-ink">{villa.direccion}</p>
              </Dato>
            </div>
          </div>

          <div className="surface-sand p-8 md:p-10">
            <p className="eyebrow">Guía de la casa</p>
            <div className="mt-6 border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Wifi className="h-5 w-5 text-sea" />
                <p className="eyebrow">Wifi</p>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Red</dt>
                  <dd className="font-mono text-ink">{villa.wifi.red}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Contraseña</dt>
                  <dd className="font-mono text-ink">{villa.wifi.clave}</dd>
                </div>
              </dl>
            </div>

            <p className="eyebrow mt-10">Electrodomésticos</p>
            <ul className="mt-4 divide-y divide-border">
              {villa.electrodomesticos.map((e) => (
                <li key={e.titulo} className="py-4">
                  <p className="text-sm text-ink">{e.titulo}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.detalle}</p>
                </li>
              ))}
            </ul>

            <p className="eyebrow mt-10">Normas de la casa</p>
            <ul className="mt-4 space-y-3">
              {villa.normas.map((n) => (
                <li key={n} className="flex gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Recomendaciones */}
        <section className="border-b border-border py-16">
          <p className="eyebrow">Cerca de {villa.name}</p>
          <h2 className="display-md mt-4 text-ink">Lo que recomendamos de verdad</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {villa.cerca.map((c) => (
              <article key={c.titulo}>
                <div className="media-frame aspect-4/3">
                  <img src={c.img} alt={c.titulo} loading="lazy" />
                </div>
                <p className="eyebrow mt-5">{c.tipo}</p>
                <h3 className="mt-2 font-serif text-2xl text-ink">{c.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.texto}</p>
              </article>
            ))}
          </div>
          <Link
            to={villa.to}
            className="mt-10 inline-block text-[0.7rem] uppercase tracking-[0.2em] text-sea hover:opacity-70"
          >
            Ver la ficha completa de {villa.name}
          </Link>
        </section>

        {/* Contacto */}
        <section className="grid gap-12 py-16 md:grid-cols-2">
          <div>
            <p className="eyebrow">Anfitriona</p>
            <h2 className="display-md mt-4 text-ink">
              {villa.anfitrion.nombre} está a un mensaje
            </h2>
            <p className="lede mt-4 text-base">
              Vive a diez minutos de la casa. Si algo no funciona o quieres una reserva en algún
              sitio, escríbele sin reparo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a
                  href={`https://wa.me/${villa.anfitrion.whatsapp}?text=${encodeURIComponent(
                    `Hola ${villa.anfitrion.nombre}, soy ${reserva.huesped} (${reserva.codigo}).`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={`tel:${villa.anfitrion.telefono.replace(/\s/g, "")}`}>
                  <Phone className="h-4 w-4" /> {villa.anfitrion.telefono}
                </a>
              </Button>
            </div>
          </div>

          <form onSubmit={enviarMensaje} className="surface-sand space-y-4 p-8 md:p-10">
            <p className="eyebrow">Mensaje rápido</p>
            <div>
              <Label htmlFor="asunto">Asunto</Label>
              <Input id="asunto" name="asunto" placeholder="Llegada tardía, toallas extra…" className="mt-2" required />
            </div>
            <div>
              <Label htmlFor="mensaje">Mensaje</Label>
              <Textarea id="mensaje" name="mensaje" rows={5} className="mt-2" required />
            </div>
            <Button type="submit" className="w-full">
              Enviar a {villa.anfitrion.nombre}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}

function Dato({
  icon: Icon,
  titulo,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <Icon className="mt-1 h-5 w-5 shrink-0 text-sea" />
      <div>
        <p className="eyebrow">{titulo}</p>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
