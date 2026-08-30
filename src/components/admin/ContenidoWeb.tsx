import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { villas, type VillaId } from "@/lib/remansa-data";
import {
  guardarContenido,
  useContenidos,
  type ContenidoVilla,
} from "@/lib/remansa-storage";

const campoClase =
  "mt-2 rounded-none border-border bg-background text-sm shadow-none focus-visible:ring-0";

export function ContenidoWeb() {
  const [contenidos] = useContenidos();
  const [villa, setVilla] = useState<VillaId>("azahar");
  const guardado = contenidos.find((c) => c.villa === villa);
  const [borrador, setBorrador] = useState<ContenidoVilla | null>(guardado ?? null);

  // Al cambiar de villa (o al rehidratar desde localStorage) recargamos el borrador.
  useEffect(() => {
    if (guardado) setBorrador(guardado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [villa, guardado?.villa, contenidos]);

  if (!borrador) return null;
  const b = borrador;
  const set = (parcial: Partial<ContenidoVilla>) => setBorrador({ ...b, ...parcial });

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    guardarContenido(b);
    toast.success("Contenido guardado", {
      description: `${b.nombre} se ha actualizado en su landing pública.`,
    });
  };

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink">Contenido web</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edita los textos, precios y políticas que se publican en las landings de cada villa.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-1">
        {(Object.keys(villas) as VillaId[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVilla(v)}
            className={cn(
              "border px-3 py-2 text-xs uppercase tracking-[0.14em] transition-colors",
              villa === v
                ? "border-ink bg-ink text-background"
                : "border-border text-muted-foreground hover:text-ink",
            )}
          >
            {villas[v].name}
          </button>
        ))}
      </div>

      <form onSubmit={guardar} className="mt-8 space-y-8">
        {/* 1. Info general */}
        <Bloque titulo="1 · Info general">
          <div className="grid gap-6 md:grid-cols-2">
            <Campo id="nombre" label="Nombre de la villa">
              <Input
                id="nombre"
                value={b.nombre}
                onChange={(e) => set({ nombre: e.target.value })}
                className={campoClase}
              />
            </Campo>
            <Campo id="tagline" label="Tagline">
              <Input
                id="tagline"
                value={b.tagline}
                onChange={(e) => set({ tagline: e.target.value })}
                className={campoClase}
              />
            </Campo>
          </div>

          <Campo id="destacado" label="Frase destacada de “La casa”">
            <Textarea
              id="destacado"
              rows={2}
              value={b.descripcionTitulo}
              onChange={(e) => set({ descripcionTitulo: e.target.value })}
              className={campoClase}
            />
          </Campo>

          <Campo id="descripcion" label="Descripción emocional">
            <Textarea
              id="descripcion"
              rows={5}
              value={b.descripcion}
              onChange={(e) => set({ descripcion: e.target.value })}
              className={campoClase}
            />
          </Campo>

          <div className="grid gap-6 sm:grid-cols-3">
            <Campo id="habitaciones" label="Habitaciones">
              <Input
                id="habitaciones"
                type="number"
                min={1}
                value={b.habitaciones}
                onChange={(e) => set({ habitaciones: Number(e.target.value) })}
                className={campoClase}
              />
            </Campo>
            <Campo id="banos" label="Baños">
              <Input
                id="banos"
                type="number"
                min={1}
                value={b.banos}
                onChange={(e) => set({ banos: Number(e.target.value) })}
                className={campoClase}
              />
            </Campo>
            <Campo id="huespedes" label="Huéspedes máximo">
              <Input
                id="huespedes"
                type="number"
                min={1}
                value={b.huespedesMax}
                onChange={(e) => set({ huespedesMax: Number(e.target.value) })}
                className={campoClase}
              />
            </Campo>
          </div>

          <ListaEditable
            label="Resto de la ficha práctica"
            items={b.fichaExtra}
            placeholder="Piscina privada"
            onChange={(fichaExtra) => set({ fichaExtra })}
          />
        </Bloque>

        {/* 2. Precios y temporadas */}
        <Bloque titulo="2 · Precios y temporadas">
          <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border bg-sand/60 text-left text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="px-4 py-3 font-normal">Temporada</th>
                  <th className="px-4 py-3 font-normal">Meses</th>
                  <th className="px-4 py-3 font-normal">€ / noche</th>
                  <th className="px-4 py-3 font-normal">Mín. noches</th>
                </tr>
              </thead>
              <tbody>
                {b.temporadas.map((t, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 text-ink">{t.nombre}</td>
                    <td className="px-4 py-3">
                      <Input
                        value={t.meses}
                        onChange={(e) =>
                          set({
                            temporadas: b.temporadas.map((x, j) =>
                              j === i ? { ...x, meses: e.target.value } : x,
                            ),
                          })
                        }
                        className="mt-0 rounded-none border-border bg-background text-sm shadow-none focus-visible:ring-0"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        min={0}
                        value={t.precio}
                        onChange={(e) =>
                          set({
                            temporadas: b.temporadas.map((x, j) =>
                              j === i ? { ...x, precio: Number(e.target.value) } : x,
                            ),
                          })
                        }
                        className="mt-0 w-28 rounded-none border-border bg-background text-sm shadow-none focus-visible:ring-0"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        min={1}
                        value={t.minNoches}
                        onChange={(e) =>
                          set({
                            temporadas: b.temporadas.map((x, j) =>
                              j === i ? { ...x, minNoches: Number(e.target.value) } : x,
                            ),
                          })
                        }
                        className="mt-0 w-24 rounded-none border-border bg-background text-sm shadow-none focus-visible:ring-0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Campo id="limpieza" label="Limpieza final (€)">
              <Input
                id="limpieza"
                type="number"
                min={0}
                value={b.limpiezaFinal}
                onChange={(e) => set({ limpiezaFinal: Number(e.target.value) })}
                className={campoClase}
              />
            </Campo>
            <Campo id="fianza" label="Fianza (€)">
              <Input
                id="fianza"
                type="number"
                min={0}
                value={b.fianza}
                onChange={(e) => set({ fianza: Number(e.target.value) })}
                className={campoClase}
              />
            </Campo>
          </div>
        </Bloque>

        {/* 3. Políticas */}
        <Bloque titulo="3 · Políticas">
          <ListaEditable
            label="Normas de la casa"
            items={b.normas}
            placeholder="Silencio entre las 23:00 y las 8:00…"
            onChange={(normas) => set({ normas })}
          />

          <Campo id="cancelacion" label="Política de cancelación">
            <Textarea
              id="cancelacion"
              rows={4}
              value={b.cancelacion}
              onChange={(e) => set({ cancelacion: e.target.value })}
              className={campoClase}
            />
          </Campo>

          <div className="grid gap-6 sm:grid-cols-2">
            <Campo id="checkin" label="Horario de check-in">
              <Input
                id="checkin"
                value={b.checkIn}
                onChange={(e) => set({ checkIn: e.target.value })}
                className={campoClase}
              />
            </Campo>
            <Campo id="checkout" label="Horario de check-out">
              <Input
                id="checkout"
                value={b.checkOut}
                onChange={(e) => set({ checkOut: e.target.value })}
                className={campoClase}
              />
            </Campo>
          </div>
        </Bloque>

        <div className="sticky bottom-0 flex flex-wrap items-center gap-4 border-t border-border bg-background/95 py-4 backdrop-blur">
          <Button type="submit">Guardar cambios</Button>
          <button
            type="button"
            onClick={() => guardado && setBorrador(guardado)}
            className="text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
          >
            Descartar
          </button>
          <p className="text-xs text-muted-foreground">
            Los cambios se publican en {b.nombre} al guardar.
          </p>
        </div>
      </form>
    </section>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6 border border-border bg-card p-6 md:p-8">
      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">{titulo}</p>
      {children}
    </div>
  );
}

function Campo({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ListaEditable({
  label,
  items,
  placeholder,
  onChange,
}: {
  label: string;
  items: string[];
  placeholder: string;
  onChange: (items: string[]) => void;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <div className="mt-2 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
              className="rounded-none border-border bg-background text-sm shadow-none focus-visible:ring-0"
            />
            <button
              type="button"
              aria-label="Quitar línea"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="border border-border p-2 text-muted-foreground hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
      >
        <Plus className="h-3.5 w-3.5" /> Añadir línea
      </button>
    </div>
  );
}
