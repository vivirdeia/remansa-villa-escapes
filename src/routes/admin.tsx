import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { LogOut, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ContenidoWeb } from "@/components/admin/ContenidoWeb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { eur, villas, type VillaId } from "@/lib/remansa-data";
import {
  añadirMensaje,
  restablecerDemo,
  sembrarSiHaceFalta,
  useBookings,
  useConversaciones,
  useIncidencias,
  useLimpiezas,
  type Booking,
} from "@/lib/remansa-storage";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Backoffice — Gestión de las villas | Remansa" },
      {
        name: "description",
        content:
          "Área privada de Remansa: calendario multi-propiedad, limpiezas, incidencias, ocupación e ingresos y mensajería con huéspedes.",
      },
      { property: "og:title", content: "Backoffice Remansa" },
      { property: "og:description", content: "Gestión operativa de las tres villas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

/* ---------------- indicadores ---------------- */


const ocupacion: { villa: VillaId; noches: number; disponibles: number; ingresos: number; adr: number }[] = [
  { villa: "azahar", noches: 22, disponibles: 30, ingresos: 8420, adr: 383 },
  { villa: "poniente", noches: 19, disponibles: 30, ingresos: 6140, adr: 323 },
  { villa: "salobre", noches: 24, disponibles: 30, ingresos: 12960, adr: 540 },
];

const secciones = [
  { id: "calendario", label: "Calendario" },
  { id: "limpiezas", label: "Limpiezas" },
  { id: "incidencias", label: "Incidencias" },
  { id: "ingresos", label: "Ocupación e ingresos" },
  { id: "mensajes", label: "Mensajería" },
  { id: "contenido", label: "Contenido web" },
] as const;

type SeccionId = (typeof secciones)[number]["id"];

/* ---------------- pantalla ---------------- */

function Admin() {
  const [dentro, setDentro] = useState(false);
  const [seccion, setSeccion] = useState<SeccionId>("calendario");

  useEffect(() => {
    sembrarSiHaceFalta();
  }, []);

  if (!dentro) return <Login onEntrar={() => setDentro(true)} />;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-[1500px] px-4 py-3 sm:px-6 sm:py-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:flex lg:flex-wrap lg:justify-between">
            <div className="flex min-w-0 items-baseline gap-3">
              <Link to="/" className="font-serif text-lg tracking-[0.22em] uppercase text-ink sm:text-xl">
                Remansa
              </Link>
              <span className="truncate text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                Backoffice
              </span>
            </div>

            <nav className="hidden lg:order-2 lg:flex lg:flex-wrap lg:gap-1">
              {secciones.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSeccion(s.id)}
                  className={cn(
                    "px-3 py-2 text-xs uppercase tracking-[0.14em] transition-colors",
                    seccion === s.id
                      ? "bg-ink text-background"
                      : "text-muted-foreground hover:text-ink",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-1 sm:gap-3 lg:order-3">
              <button
                onClick={() => {
                  restablecerDemo();
                  toast.success("Datos restablecidos");
                }}
                className="inline-flex h-11 items-center gap-2 px-2 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
                title="Borra el estado guardado en este navegador y vuelve a cargar los datos originales"
              >
                <RotateCcw className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Restablecer datos</span>
                <span className="sr-only sm:hidden">Restablecer datos</span>
              </button>
              <button
                onClick={() => setDentro(false)}
                className="inline-flex h-11 items-center gap-2 px-2 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Salir</span>
                <span className="sr-only sm:hidden">Salir</span>
              </button>
            </div>
          </div>

          {/* Navegación mobile: pestañas con scroll horizontal */}
          <nav
            aria-label="Secciones del backoffice"
            className="-mx-4 mt-3 overflow-x-auto px-4 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max gap-1 pb-1">
              {secciones.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSeccion(s.id)}
                  aria-current={seccion === s.id ? "page" : undefined}
                  className={cn(
                    "h-11 shrink-0 border px-4 text-xs whitespace-nowrap uppercase tracking-[0.14em] transition-colors",
                    seccion === s.id
                      ? "border-ink bg-ink text-background"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 sm:py-10">
        {seccion === "calendario" && <Calendario />}
        {seccion === "limpiezas" && <Limpiezas />}
        {seccion === "incidencias" && <Incidencias />}
        {seccion === "ingresos" && <Ingresos />}
        {seccion === "mensajes" && <Mensajeria />}
        {seccion === "contenido" && <ContenidoWeb />}
      </main>
    </div>
  );
}

function Login({ onEntrar }: { onEntrar: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onEntrar();
          toast.success("Sesión iniciada");
        }}
        className="w-full max-w-sm border border-border bg-card p-10"
      >
        <Link to="/" className="font-serif text-2xl tracking-[0.22em] uppercase text-ink">
          Remansa
        </Link>
        <p className="eyebrow mt-2">Área privada</p>

        <div className="mt-8 space-y-4">
          <div>
            <Label htmlFor="user">Usuario</Label>
            <Input id="user" defaultValue="marta@remansa.es" className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="pass">Contraseña</Label>
            <Input id="pass" type="password" defaultValue="remansa2026" className="mt-2 h-11" />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
          <p className="text-xs text-muted-foreground">
            Acceso restringido al equipo de Remansa.
          </p>
        </div>
      </form>
    </div>
  );
}

/* ---------------- calendario ---------------- */

const dias = Array.from({ length: 30 }, (_, i) => i + 1);

function Calendario() {
  const [filtro, setFiltro] = useState<"todas" | VillaId>("todas");
  const [bookings, setBookings] = useBookings();
  const lista = (Object.keys(villas) as VillaId[]).filter((v) => filtro === "todas" || v === filtro);

  const crearBloqueo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const villa = datos.get("villa") as VillaId;
    const desde = Number(datos.get("desde"));
    const hasta = Number(datos.get("hasta"));
    const motivo = String(datos.get("motivo") || "").trim();

    if (!villa || !motivo || !desde || !hasta || desde < 1 || hasta > 30 || hasta < desde) {
      toast.error("Revisa los datos del bloqueo", {
        description: "Los días deben estar entre 1 y 30 y la salida no puede ser anterior a la entrada.",
      });
      return;
    }

    const nuevo: Booking = {
      id: `B-${Date.now().toString().slice(-4)}`,
      villa,
      huesped: motivo,
      desde,
      hasta,
      estado: "bloqueo",
      total: 0,
      canal: "Bloqueo",
    };
    setBookings([...bookings, nuevo]);
    toast.success("Bloqueo añadido al calendario");
    e.currentTarget.reset();
  };

  return (
    <section>
      <Encabezado
        titulo="Calendario · Septiembre 2026"
        sub="Reservas confirmadas, solicitudes pendientes y bloqueos manuales."
      />

      <div className="mt-6 flex flex-wrap gap-1">
        {(["todas", "azahar", "poniente", "salobre"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={cn(
              "h-11 border px-4 text-xs uppercase tracking-[0.14em] transition-colors",
              filtro === f ? "border-ink bg-ink text-background" : "border-border text-muted-foreground hover:text-ink",
            )}
          >
            {f === "todas" ? "Todas" : villas[f].name}
          </button>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto border border-border bg-card">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] border-b border-border">
            <div className="px-4 py-3 text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              Villa
            </div>
            <div className="grid grid-cols-30">
              {dias.map((d) => (
                <div
                  key={d}
                  className="border-l border-border/60 py-3 text-center text-[0.6rem] text-muted-foreground"
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          {lista.map((v) => (
            <div key={v} className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] border-b border-border last:border-b-0">
              <div className="px-4 py-5">
                <p className="text-sm text-ink">{villas[v].name}</p>
                <p className="text-xs text-muted-foreground">Hasta {villas[v].huespedesMax} pax</p>
              </div>
              <div className="relative grid grid-cols-30">
                {dias.map((d) => (
                  <div key={d} className="h-16 border-l border-border/60" />
                ))}
                {bookings
                  .filter((b) => b.villa === v)
                  .map((b) => (
                    <div
                      key={b.id}
                      title={`${b.huesped} · ${b.desde}–${b.hasta} sep`}
                      className={cn(
                        "absolute top-4 flex h-8 items-center overflow-hidden px-2 text-[0.65rem] whitespace-nowrap",
                        b.estado === "bloqueo" && "bg-muted text-muted-foreground line-through",
                        b.estado === "pendiente" && "border border-dashed border-ink/40 text-ink",
                        b.estado === "confirmada" && "text-background",
                      )}
                      style={{
                        left: `${((b.desde - 1) / 30) * 100}%`,
                        width: `${((b.hasta - b.desde + 1) / 30) * 100}%`,
                        backgroundColor:
                          b.estado === "confirmada" ? villas[v].accentVar : undefined,
                      }}
                    >
                      {b.huesped}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-6 text-xs text-muted-foreground">
        <Leyenda color="var(--azahar)" texto="Confirmada (color de la villa)" />
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-6 border border-dashed border-ink/40" /> Pendiente de confirmar
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-6 bg-muted" /> Bloqueo manual
        </span>
      </div>

      <form
        onSubmit={crearBloqueo}
        className="mt-10 grid gap-4 border border-border bg-card p-6 md:grid-cols-[1fr_100px_100px_1.4fr_auto] md:items-end"
      >
        <div>
          <Label htmlFor="bl-villa" className="eyebrow">Villa</Label>
          <select
            id="bl-villa"
            name="villa"
            defaultValue="azahar"
            className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm text-ink"
          >
            {(Object.keys(villas) as VillaId[]).map((v) => (
              <option key={v} value={v}>
                {villas[v].name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="bl-desde" className="eyebrow">Del día</Label>
          <Input id="bl-desde" name="desde" type="number" min={1} max={30} defaultValue={1} className="mt-2 h-11" />
        </div>
        <div>
          <Label htmlFor="bl-hasta" className="eyebrow">Al día</Label>
          <Input id="bl-hasta" name="hasta" type="number" min={1} max={30} defaultValue={2} className="mt-2 h-11" />
        </div>
        <div>
          <Label htmlFor="bl-motivo" className="eyebrow">Motivo del bloqueo</Label>
          <Input id="bl-motivo" name="motivo" placeholder="Mantenimiento de la piscina" className="mt-2" required />
        </div>
        <Button type="submit">Añadir bloqueo</Button>
      </form>



      <div className="mt-10 overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              <th className="px-4 py-3">Ref.</th>
              <th className="px-4 py-3">Villa</th>
              <th className="px-4 py-3">Huésped</th>
              <th className="px-4 py-3">Fechas</th>
              <th className="px-4 py-3">Canal</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Importe</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-border/60 last:border-b-0">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{b.id}</td>
                <td className="px-4 py-3">{villas[b.villa].name}</td>
                <td className="px-4 py-3 text-ink">{b.huesped}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {b.desde}–{b.hasta} sep
                </td>
                <td className="px-4 py-3 text-muted-foreground">{b.canal}</td>
                <td className="px-4 py-3">
                  <Pill estado={b.estado} />
                </td>
                <td className="px-4 py-3 text-right">{b.total ? eur(b.total) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Leyenda({ color, texto }: { color: string; texto: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-3 w-6" style={{ backgroundColor: color }} />
      {texto}
    </span>
  );
}

function Pill({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    confirmada: "border-olive text-olive",
    pendiente: "border-terracotta text-terracotta",
    bloqueo: "border-border text-muted-foreground",
    abierta: "border-terracotta text-terracotta",
    "en curso": "border-sea text-sea",
    resuelta: "border-olive text-olive",
    alta: "border-destructive text-destructive",
    media: "border-terracotta text-terracotta",
    baja: "border-border text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-block border px-2 py-1 text-[0.6rem] uppercase tracking-[0.14em]",
        map[estado] ?? "border-border text-muted-foreground",
      )}
    >
      {estado}
    </span>
  );
}

function Encabezado({ titulo, sub }: { titulo: string; sub: string }) {
  return (
    <div>
      <h1 className="font-serif text-2xl text-ink sm:text-3xl">{titulo}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

/* ---------------- limpiezas ---------------- */

function Limpiezas() {
  const [items, setItems] = useLimpiezas();
  const pendientes = items.filter((i) => !i.hecha).length;

  const alternar = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, hecha: !i.hecha } : i)),
    );
    const item = items.find((i) => i.id === id);
    toast.success(item?.hecha ? "Marcada como pendiente" : "Limpieza completada");
  };

  return (
    <section>
      <Encabezado
        titulo="Limpiezas entre estancias"
        sub={`${pendientes} tareas pendientes de ${items.length} programadas.`}
      />
      <div className="mt-8 overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Villa</th>
              <th className="px-4 py-3">Franja</th>
              <th className="px-4 py-3">Equipo</th>
              <th className="px-4 py-3">Nota</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr
                key={i.id}
                className={cn("border-b border-border/60 last:border-b-0", i.hecha && "opacity-55")}
              >
                <td className="px-4 py-3">
                  <Pill estado={i.hecha ? "resuelta" : "pendiente"} />
                </td>
                <td className="px-4 py-3 text-ink">{i.fecha}</td>
                <td className="px-4 py-3">{villas[i.villa].name}</td>
                <td className="px-4 py-3 text-muted-foreground">{i.franja}</td>
                <td className="px-4 py-3 text-muted-foreground">{i.equipo}</td>
                <td className="px-4 py-3 text-muted-foreground">{i.nota}</td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => alternar(i.id)}>
                    {i.hecha ? "Reabrir" : "Marcar hecha"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------------- incidencias ---------------- */

function Incidencias() {
  const [items, setItems] = useIncidencias();
  const [filtro, setFiltro] = useState<"todas" | VillaId>("todas");
  const visibles = items.filter((i) => filtro === "todas" || i.villa === filtro);

  const avanzar = (id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              estado:
                i.estado === "abierta" ? "en curso" : i.estado === "en curso" ? "resuelta" : "abierta",
            }
          : i,
      ),
    );
    toast.success("Estado actualizado");
  };

  return (
    <section>
      <Encabezado
        titulo="Incidencias y mantenimiento"
        sub={`${items.filter((i) => i.estado !== "resuelta").length} incidencias abiertas o en curso.`}
      />

      <div className="mt-6 flex flex-wrap gap-1">
        {(["todas", "azahar", "poniente", "salobre"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={cn(
              "h-11 border px-4 text-xs uppercase tracking-[0.14em] transition-colors",
              filtro === f ? "border-ink bg-ink text-background" : "border-border text-muted-foreground hover:text-ink",
            )}
          >
            {f === "todas" ? "Todas" : villas[f].name}
          </button>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              <th className="px-4 py-3">Ref.</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Villa</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Prioridad</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((i) => (
              <tr key={i.id} className="border-b border-border/60 last:border-b-0">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{i.id}</td>
                <td className="px-4 py-3 text-ink">{i.titulo}</td>
                <td className="px-4 py-3">{villas[i.villa].name}</td>
                <td className="px-4 py-3 text-muted-foreground">{i.fecha}</td>
                <td className="px-4 py-3">
                  <Pill estado={i.prioridad} />
                </td>
                <td className="px-4 py-3">
                  <Pill estado={i.estado} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => avanzar(i.id)}>
                    Cambiar estado
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------------- ingresos ---------------- */

function Ingresos() {
  const totales = useMemo(() => {
    const ingresos = ocupacion.reduce((a, o) => a + o.ingresos, 0);
    const noches = ocupacion.reduce((a, o) => a + o.noches, 0);
    const disponibles = ocupacion.reduce((a, o) => a + o.disponibles, 0);
    return { ingresos, noches, disponibles, ocupacion: Math.round((noches / disponibles) * 100) };
  }, []);

  return (
    <section>
      <Encabezado
        titulo="Ocupación e ingresos · Septiembre 2026"
        sub="Datos consolidados de las tres villas, según los precios por temporada publicados."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Ingresos del mes", v: eur(totales.ingresos) },
          { l: "Ocupación media", v: `${totales.ocupacion}%` },
          { l: "Noches vendidas", v: `${totales.noches} / ${totales.disponibles}` },
          { l: "ADR medio", v: eur(Math.round(totales.ingresos / totales.noches)) },
        ].map((k) => (
          <div key={k.l} className="border border-border bg-card p-6">
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">{k.l}</p>
            <p className="mt-3 font-serif text-3xl text-ink">{k.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              <th className="px-4 py-3">Villa</th>
              <th className="px-4 py-3">Ocupación</th>
              <th className="px-4 py-3">Noches</th>
              <th className="px-4 py-3 text-right">ADR</th>
              <th className="px-4 py-3 text-right">Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {ocupacion.map((o) => {
              const pct = Math.round((o.noches / o.disponibles) * 100);
              return (
                <tr key={o.villa} className="border-b border-border/60 last:border-b-0">
                  <td className="px-4 py-4 text-ink">{villas[o.villa].name}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-40 bg-muted">
                        <div
                          className="h-full"
                          style={{ width: `${pct}%`, backgroundColor: villas[o.villa].accentVar }}
                        />
                      </div>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {o.noches} / {o.disponibles}
                  </td>
                  <td className="px-4 py-4 text-right">{eur(o.adr)}</td>
                  <td className="px-4 py-4 text-right text-ink">{eur(o.ingresos)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {(Object.keys(villas) as VillaId[]).map((v) => (
          <div key={v} className="border border-border bg-card p-6">
            <p className="font-serif text-xl text-ink">{villas[v].name}</p>
            <p className="eyebrow mt-4">Tarifas por temporada</p>
            <ul className="mt-3 space-y-2 text-sm">
              {villas[v].temporadas.map((t) => (
                <li key={t.nombre} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{t.nombre}</span>
                  <span className="text-ink">{eur(t.precio)} / noche</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- mensajería ---------------- */

function Mensajeria() {
  const [conversaciones, setConversaciones] = useConversaciones();
  const [activo, setActivo] = useState<string | null>(null);
  const conv = conversaciones.find((m) => m.id === activo) ?? conversaciones[0];

  const marcarLeida = (id: string) => {
    setActivo(id);
    setConversaciones((prev) => prev.map((c) => (c.id === id ? { ...c, sinLeer: 0 } : c)));
  };

  const responder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!conv) return;
    const form = e.currentTarget;
    const texto = String(new FormData(form).get("respuesta") || "").trim();
    if (!texto) return;
    añadirMensaje({ huesped: conv.huesped, villa: conv.villa, de: "host", texto });
    toast.success("Respuesta enviada");
    form.reset();
  };

  if (!conv) {
    return (
      <section>
        <Encabezado titulo="Mensajería" sub="Todavía no hay conversaciones guardadas." />
      </section>
    );
  }

  return (
    <section>
      <Encabezado
        titulo="Mensajería"
        sub="Conversaciones con huéspedes activos de las tres villas."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <ul className="divide-y divide-border border border-border bg-card">
          {conversaciones.map((m) => {
            const ultimo = m.mensajes[m.mensajes.length - 1];
            return (
              <li key={m.id}>
                <button
                  onClick={() => marcarLeida(m.id)}
                  className={cn(
                    "w-full px-5 py-4 text-left transition-colors",
                    conv.id === m.id ? "bg-sand" : "hover:bg-sand/60",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-ink">{m.huesped}</p>
                    <span className="text-xs text-muted-foreground">{ultimo?.hora}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{ultimo?.texto}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="h-2 w-2"
                      style={{ backgroundColor: villas[m.villa].accentVar }}
                      aria-hidden
                    />
                    <span className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {villas[m.villa].name}
                    </span>
                    {m.sinLeer > 0 && (
                      <span className="ml-auto bg-ink px-2 py-0.5 text-[0.6rem] text-background">
                        {m.sinLeer}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <p className="text-sm text-ink">{conv.huesped}</p>
            <p className="text-xs text-muted-foreground">{villas[conv.villa].name}</p>
          </div>
          <div className="flex-1 space-y-4 px-6 py-6">
            {conv.mensajes.map((m) => (
              <Burbuja key={m.id} quien={m.de}>
                {m.texto}
              </Burbuja>
            ))}
          </div>
          <form onSubmit={responder} className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row">
            <Input name="respuesta" placeholder="Escribe una respuesta…" className="h-11" required />
            <Button type="submit">Enviar</Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Burbuja({ quien, children }: { quien: "host" | "huesped"; children: React.ReactNode }) {
  return (
    <div className={cn("flex", quien === "host" ? "justify-end" : "justify-start")}>
      <p
        className={cn(
          "max-w-md px-4 py-3 text-sm",
          quien === "host" ? "bg-ink text-background" : "bg-sand text-ink",
        )}
      >
        {children}
      </p>
    </div>
  );
}
