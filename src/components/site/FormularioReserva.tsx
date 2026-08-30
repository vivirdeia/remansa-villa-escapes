import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { eur, formatoFecha, villas, type VillaId } from "@/lib/remansa-data";
import { crearSolicitudReserva, type Booking } from "@/lib/remansa-storage";

const campo =
  "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0";

export function FormularioReserva({
  villa,
  huespedesMax,
  placeholderMensaje,
}: {
  villa: VillaId;
  huespedesMax: number;
  placeholderMensaje?: string;
}) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    entrada: "",
    salida: "",
    huespedes: String(Math.min(2, huespedesMax)),
    mensaje: "",
  });
  const [reserva, setReserva] = useState<Booking | null>(null);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(form.salida) <= new Date(form.entrada)) {
      toast.error("Revisa las fechas", {
        description: "La salida tiene que ser posterior a la entrada.",
      });
      return;
    }
    const creada = crearSolicitudReserva({
      villa,
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      entrada: form.entrada,
      salida: form.salida,
      huespedes: Number(form.huespedes) || 1,
      mensaje: form.mensaje,
    });
    setReserva(creada);
    toast.success("Solicitud recibida", {
      description: `Tu código de acceso es ${creada.codigo}.`,
    });
  };

  if (reserva) {
    return (
      <div className="border border-border bg-card p-8 md:p-10">
        <p className="eyebrow">Solicitud recibida</p>
        <h3 className="display-md mt-4 text-ink">
          Gracias, {reserva.huesped}. Ya tenemos tus fechas.
        </h3>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Tu solicitud de reserva en {villas[villa].name} está pendiente de confirmación. La
          revisamos y te escribimos con el presupuesto cerrado. Guarda este código: es tu llave para
          entrar al portal del huésped.
        </p>

        <div className="mt-8 border border-border bg-background p-6 text-center">
          <p className="eyebrow">Tu código de acceso</p>
          <p className="mt-3 font-mono text-xl tracking-[0.18em] text-ink sm:text-2xl">
            {reserva.codigo}
          </p>
        </div>

        <dl className="mt-8 space-y-3 text-sm">
          <Fila t="Llegada" v={formatoFecha(reserva.llegada!)} />
          <Fila t="Salida" v={formatoFecha(reserva.salida!)} />
          <Fila t="Huéspedes" v={String(reserva.huespedes)} />
          <Fila t="Estimación" v={eur(reserva.total)} />
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="sea" size="editorial" className="w-full sm:w-auto">
            <Link to="/mi-estancia">Ir a mi portal de huésped</Link>
          </Button>
          <Button
            variant="outline"
            size="editorial"
            className="w-full sm:w-auto"
            onClick={() => {
              setReserva(null);
              setForm({
                nombre: "",
                email: "",
                entrada: "",
                salida: "",
                huespedes: String(Math.min(2, huespedesMax)),
                mensaje: "",
              });
            }}
          >
            Hacer otra solicitud
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="space-y-6 border border-border bg-card p-8 md:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${villa}-nombre`} className="eyebrow">
            Nombre
          </Label>
          <Input
            id={`${villa}-nombre`}
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className={campo}
            placeholder="Marta Ferrer"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${villa}-email`} className="eyebrow">
            Email
          </Label>
          <Input
            id={`${villa}-email`}
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={campo}
            placeholder="marta@correo.es"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${villa}-entrada`} className="eyebrow">
            Entrada
          </Label>
          <Input
            id={`${villa}-entrada`}
            type="date"
            required
            value={form.entrada}
            onChange={(e) => setForm({ ...form, entrada: e.target.value })}
            className={campo}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${villa}-salida`} className="eyebrow">
            Salida
          </Label>
          <Input
            id={`${villa}-salida`}
            type="date"
            required
            value={form.salida}
            onChange={(e) => setForm({ ...form, salida: e.target.value })}
            className={campo}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${villa}-huespedes`} className="eyebrow">
          Huéspedes
        </Label>
        <Input
          id={`${villa}-huespedes`}
          type="number"
          min={1}
          max={huespedesMax}
          value={form.huespedes}
          onChange={(e) => setForm({ ...form, huespedes: e.target.value })}
          className={campo}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${villa}-mensaje`} className="eyebrow">
          Cuéntanos algo
        </Label>
        <Textarea
          id={`${villa}-mensaje`}
          rows={4}
          value={form.mensaje}
          onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
          className={`resize-none ${campo}`}
          placeholder={placeholderMensaje ?? "Venimos con dos niños pequeños…"}
        />
      </div>

      <Button type="submit" variant="sea" size="editorial" className="w-full">
        Solicitar reserva
      </Button>
      <p className="text-center text-[0.7rem] leading-relaxed text-muted-foreground">
        Solicitud sin compromiso. Todavía no se realiza ningún cargo.
      </p>
    </form>
  );
}

function Fila({ t, v }: { t: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
      <dt className="text-muted-foreground">{t}</dt>
      <dd className="text-right text-ink">{v}</dd>
    </div>
  );
}
