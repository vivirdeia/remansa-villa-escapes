import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { eur, villas, type VillaId } from "@/lib/remansa-data";

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

/* ---------------- datos de ejemplo ---------------- */

type Estado = "confirmada" | "bloqueo" | "pendiente";

type Booking = {
  id: string;
  villa: VillaId;
  huesped: string;
  desde: number; // día del mes (septiembre 2026)
  hasta: number;
  estado: Estado;
  total: number;
  canal: string;
};

const bookings: Booking[] = [
  { id: "R-1041", villa: "azahar", huesped: "Lucía Ferrer", desde: 1, hasta: 8, estado: "confirmada", total: 2380, canal: "Directa" },
  { id: "R-1052", villa: "azahar", huesped: "Familia Roig", desde: 12, hasta: 19, estado: "confirmada", total: 2660, canal: "Directa" },
  { id: "B-0031", villa: "azahar", huesped: "Mantenimiento piscina", desde: 24, hasta: 26, estado: "bloqueo", total: 0, canal: "Bloqueo" },
  { id: "R-1063", villa: "poniente", huesped: "Andrés y Clara", desde: 3, hasta: 9, estado: "confirmada", total: 1980, canal: "Directa" },
  { id: "R-1070", villa: "poniente", huesped: "Marion Leclerc", desde: 14, hasta: 18, estado: "pendiente", total: 1320, canal: "Web" },
  { id: "R-1074", villa: "poniente", huesped: "Pau i Berta", desde: 20, hasta: 27, estado: "confirmada", total: 2310, canal: "Directa" },
  { id: "R-1088", villa: "salobre", huesped: "Grupo Nerea", desde: 2, hasta: 6, estado: "confirmada", total: 2160, canal: "Directa" },
  { id: "B-0035", villa: "salobre", huesped: "Revisión escalera cala", desde: 9, hasta: 10, estado: "bloqueo", total: 0, canal: "Bloqueo" },
  { id: "R-1093", villa: "salobre", huesped: "Cuadrilla Bilbao", desde: 11, hasta: 18, estado: "confirmada", total: 3780, canal: "Web" },
  { id: "R-1099", villa: "salobre", huesped: "Reunión Casals", desde: 22, hasta: 28, estado: "pendiente", total: 3240, canal: "Web" },
];

type Limpieza = {
  id: string;
  villa: VillaId;
  fecha: string;
  franja: string;
  equipo: string;
  nota: string;
  hecha: boolean;
};

const limpiezasIniciales: Limpieza[] = [
  { id: "L-201", villa: "azahar", fecha: "8 sep", franja: "11:00 – 15:00", equipo: "Rosa y Amal", nota: "Salida de 6 huéspedes con perro. Aspirar sofás.", hecha: true },
  { id: "L-202", villa: "poniente", fecha: "9 sep", franja: "11:30 – 14:00", equipo: "Rosa", nota: "Reponer leña y velas de la terraza.", hecha: true },
  { id: "L-203", villa: "salobre", fecha: "6 sep", franja: "10:30 – 16:00", equipo: "Equipo completo", nota: "Grupo de 10. Limpieza de brasa y ducha exterior.", hecha: true },
  { id: "L-204", villa: "azahar", fecha: "12 sep", franja: "11:00 – 15:00", equipo: "Rosa y Amal", nota: "Entrada familiar: cuna y trona montadas.", hecha: false },
  { id: "L-205", villa: "salobre", fecha: "18 sep", franja: "10:30 – 16:00", equipo: "Equipo completo", nota: "Cambio entre dos grupos, margen ajustado.", hecha: false },
  { id: "L-206", villa: "poniente", fecha: "18 sep", franja: "11:30 – 14:00", equipo: "Amal", nota: "Revisar filtro de la piscina desbordante.", hecha: false },
  { id: "L-207", villa: "azahar", fecha: "19 sep", franja: "11:00 – 14:30", equipo: "Rosa", nota: "Salida sin entrada posterior: limpieza a fondo.", hecha: false },
];

type Incidencia = {
  id: string;
  villa: VillaId;
  titulo: string;
  fecha: string;
  prioridad: "alta" | "media" | "baja";
  estado: "abierta" | "en curso" | "resuelta";
};

const incidenciasIniciales: Incidencia[] = [
  { id: "I-118", villa: "salobre", titulo: "Peldaño suelto en el acceso a la cala", fecha: "05 sep 2026", prioridad: "alta", estado: "en curso" },
  { id: "I-119", villa: "azahar", titulo: "Persiana del dormitorio norte atascada", fecha: "07 sep 2026", prioridad: "media", estado: "abierta" },
  { id: "I-120", villa: "poniente", titulo: "Luz sumergida de la piscina fundida", fecha: "08 sep 2026", prioridad: "media", estado: "abierta" },
  { id: "I-115", villa: "azahar", titulo: "Riego por goteo del jardín de cítricos", fecha: "28 ago 2026", prioridad: "baja", estado: "resuelta" },
  { id: "I-116", villa: "salobre", titulo: "Wifi inestable en el dormitorio 5", fecha: "30 ago 2026", prioridad: "media", estado: "resuelta" },
];

type Mensaje = {
  id: string;
  huesped: string;
  villa: VillaId;
  ultimo: string;
  hora: string;
  sinLeer: number;
};

const mensajes: Mensaje[] = [
  { id: "M-1", huesped: "Lucía Ferrer", villa: "azahar", ultimo: "¿Podemos dejar las maletas después del check-out?", hora: "09:41", sinLeer: 2 },
  { id: "M-2", huesped: "Andrés y Clara", villa: "poniente", ultimo: "Reservado en La Terraza del Faro, ¡gracias!", hora: "Ayer", sinLeer: 0 },
  { id: "M-3", huesped: "Cuadrilla Bilbao", villa: "salobre", ultimo: "Somos 11 al final, ¿hay problema con la cama extra?", hora: "Ayer", sinLeer: 1 },
  { id: "M-4", huesped: "Marion Leclerc", villa: "poniente", ultimo: "Bonjour, quelle est l'heure d'arrivée ?", hora: "Lun", sinLeer: 0 },
  { id: "M-5", huesped: "Grupo Nerea", villa: "salobre", ultimo: "Todo perfecto, dejamos las llaves en la caja.", hora: "3 sep", sinLeer: 0 },
];

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
] as const;

type SeccionId = (typeof secciones)[number]["id"];

/* ---------------- pantalla ---------------- */

function Admin() {
  const [dentro, setDentro] = useState(false);
  const [seccion, setSeccion] = useState<SeccionId>("calendario");

  if (!dentro) return <Login onEntrar={() => setDentro(true)} />;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-baseline gap-4">
            <Link to="/" className="font-serif text-xl tracking-[0.22em] uppercase text-ink">
              Remansa
            </Link>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              Backoffice
            </span>
          </div>
          <nav className="flex flex-wrap gap-1">
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
          <button
            onClick={() => setDentro(false)}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
          >
            <LogOut className="h-3.5 w-3.5" /> Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-6 py-10">
        {seccion === "calendario" && <Calendario />}
        {seccion === "limpiezas" && <Limpiezas />}
        {seccion === "incidencias" && <Incidencias />}
        {seccion === "ingresos" && <Ingresos />}
        {seccion === "mensajes" && <Mensajeria />}
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
          toast.success("Sesión iniciada (demo)");
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
            <Input id="user" defaultValue="marta@remansa.es" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="pass">Contraseña</Label>
            <Input id="pass" type="password" defaultValue="demo1234" className="mt-2" />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
          <p className="text-xs text-muted-foreground">
            Acceso simulado: cualquier credencial es válida en esta demo.
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
  const lista = (Object.keys(villas) as VillaId[]).filter((v) => filtro === "todas" || v === filtro);

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
              "border px-3 py-2 text-xs uppercase tracking-[0.14em] transition-colors",
              filtro === f ? "border-ink bg-ink text-background" : "border-border text-muted-foreground hover:text-ink",
            )}
          >
            {f === "todas" ? "Todas" : villas[f].name}
          </button>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto border border-border bg-card">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[180px_1fr] border-b border-border">
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
            <div key={v} className="grid grid-cols-[180px_1fr] border-b border-border last:border-b-0">
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

      <div className="mt-10 overflow-x-auto border border-border bg-card">
        <table className="w-full text-sm">
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
      <h1 className="font-serif text-3xl text-ink">{titulo}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

/* ---------------- limpiezas ---------------- */

function Limpiezas() {
  const [items, setItems] = useState(limpiezasIniciales);
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
        <table className="w-full text-sm">
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
  const [items, setItems] = useState(incidenciasIniciales);
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
              "border px-3 py-2 text-xs uppercase tracking-[0.14em] transition-colors",
              filtro === f ? "border-ink bg-ink text-background" : "border-border text-muted-foreground hover:text-ink",
            )}
          >
            {f === "todas" ? "Todas" : villas[f].name}
          </button>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto border border-border bg-card">
        <table className="w-full text-sm">
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
        <table className="w-full text-sm">
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
  const [activo, setActivo] = useState(mensajes[0]!.id);
  const conv = mensajes.find((m) => m.id === activo)!;

  return (
    <section>
      <Encabezado
        titulo="Mensajería"
        sub="Conversaciones con huéspedes activos de las tres villas."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <ul className="divide-y divide-border border border-border bg-card">
          {mensajes.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => setActivo(m.id)}
                className={cn(
                  "w-full px-5 py-4 text-left transition-colors",
                  activo === m.id ? "bg-sand" : "hover:bg-sand/60",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-ink">{m.huesped}</p>
                  <span className="text-xs text-muted-foreground">{m.hora}</span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{m.ultimo}</p>
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
          ))}
        </ul>

        <div className="flex flex-col border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <p className="text-sm text-ink">{conv.huesped}</p>
            <p className="text-xs text-muted-foreground">{villas[conv.villa].name}</p>
          </div>
          <div className="flex-1 space-y-4 px-6 py-6">
            <Burbuja quien="huesped">{conv.ultimo}</Burbuja>
            <Burbuja quien="host">
              Hola, ahora mismo lo miro y te confirmo en un momento. Gracias por avisar.
            </Burbuja>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Respuesta enviada (demo)");
              (e.target as HTMLFormElement).reset();
            }}
            className="flex gap-3 border-t border-border p-4"
          >
            <Input name="respuesta" placeholder="Escribe una respuesta…" required />
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
