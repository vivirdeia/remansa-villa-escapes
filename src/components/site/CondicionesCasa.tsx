import type { ContenidoVilla } from "@/lib/remansa-storage";

/** Normas, cancelación y horarios publicados en la landing de cada villa. */
export function CondicionesCasa({ contenido }: { contenido: ContenidoVilla }) {
  return (
    <section className="py-24 md:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 md:grid-cols-2 md:px-12">
        <div>
          <p className="eyebrow">Condiciones de la casa</p>
          <h2 className="display-lg mt-5 text-ink">Lo que conviene saber antes</h2>
          <div className="mt-9 flex flex-wrap gap-x-16 gap-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Check-in</p>
              <p className="mt-2 font-serif text-xl text-ink">{contenido.checkIn}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Check-out</p>
              <p className="mt-2 font-serif text-xl text-ink">{contenido.checkOut}</p>
            </div>
          </div>
          <div className="rule-hair mt-10" />
          <p className="mt-8 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Cancelación
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {contenido.cancelacion}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Normas de la casa
          </p>
          <ul className="mt-6">
            {contenido.normas.map((n, i) => (
              <li
                key={i}
                className="border-b border-border py-4 text-sm leading-relaxed text-foreground"
              >
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
