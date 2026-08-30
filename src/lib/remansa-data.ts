import azaharHero from "@/assets/villa-azahar.jpg";
import ponienteHero from "@/assets/villa-poniente.jpg";
import salobreHero from "@/assets/salobre-hero.jpg";
import nearCala from "@/assets/near-cala.jpg";
import nearRest from "@/assets/near-restaurant.jpg";
import nearMarket from "@/assets/near-market.jpg";
import nearMirador from "@/assets/near-mirador.jpg";
import nearRomantic from "@/assets/near-romantic.jpg";
import nearChiringuito from "@/assets/near-chiringuito.jpg";
import nearSendero from "@/assets/near-sendero.jpg";

export type VillaId = "azahar" | "poniente" | "salobre";

export type Villa = {
  id: VillaId;
  name: string;
  tagline: string;
  accentVar: string;
  hero: string;
  to: "/villa-azahar" | "/villa-poniente" | "/villa-salobre";
  huespedesMax: number;
  direccion: string;
  llegada: string;
  wifi: { red: string; clave: string };
  caja: string;
  checkIn: string;
  checkOut: string;
  normas: string[];
  electrodomesticos: { titulo: string; detalle: string }[];
  cerca: { titulo: string; tipo: string; texto: string; img: string }[];
  anfitrion: { nombre: string; telefono: string; whatsapp: string };
  temporadas: { nombre: string; precio: number }[];
};

export const villas: Record<VillaId, Villa> = {
  azahar: {
    id: "azahar",
    name: "Villa Azahar",
    tagline: "Donde el aire huele a azahar",
    accentVar: "var(--azahar)",
    hero: azaharHero,
    to: "/villa-azahar",
    huespedesMax: 8,
    direccion: "Camí dels Tarongers 14, Xàbia (Alicante)",
    llegada:
      "Desde la CV-736 toma el desvío hacia el Camí dels Tarongers. La casa es la segunda del camino, con un portón de madera clara y un naranjo grande a la izquierda. Hay sitio para dos coches dentro de la parcela.",
    wifi: { red: "Remansa_Azahar", clave: "naranjos2026" },
    caja: "4718",
    checkIn: "A partir de las 16:00",
    checkOut: "Antes de las 11:00",
    normas: [
      "Silencio entre las 23:00 y las 8:00: los vecinos están muy cerca del jardín.",
      "Mascotas bienvenidas; no pueden subir a las camas ni quedarse solas en casa.",
      "Basura: contenedores al final del camino, orgánico en el marrón (martes y viernes).",
      "No se admiten fiestas ni visitas que no estén en la reserva.",
    ],
    electrodomesticos: [
      { titulo: "Aire acondicionado", detalle: "Mando en cada dormitorio. Recomendamos 24°C con las persianas bajadas al mediodía." },
      { titulo: "Lavadora", detalle: "Bajo la encimera de la cocina. Programa 'Eco 40' dura 2 h; detergente en el armario alto." },
      { titulo: "Depuradora de la piscina", detalle: "Automática de 9:00 a 14:00. No hace falta tocar nada." },
      { titulo: "Cafetera", detalle: "Italiana y de cápsulas. Cápsulas de cortesía en el cajón junto al fregadero." },
    ],
    cerca: [
      { titulo: "Cala Portitxol", tipo: "Playa", texto: "Agua transparente y guijarros blancos a 8 minutos a pie. Mejor antes de las 11:00.", img: nearCala },
      { titulo: "Ca Pepa", tipo: "Restaurante", texto: "Pescado de lonja y arroces a leña. Pide la gamba roja y reserva con un día.", img: nearRest },
      { titulo: "Mercat de Xàbia", tipo: "Mercado", texto: "Jueves por la mañana. Fruta de la huerta, quesos y almendra marcona.", img: nearMarket },
    ],
    anfitrion: { nombre: "Marta", telefono: "+34 600 112 233", whatsapp: "34600112233" },
    temporadas: [
      { nombre: "Primavera", precio: 260 },
      { nombre: "Junio y septiembre", precio: 340 },
      { nombre: "Julio", precio: 470 },
      { nombre: "Agosto", precio: 620 },
    ],
  },
  poniente: {
    id: "poniente",
    name: "Villa Poniente",
    tagline: "Un atardecer distinto cada noche",
    accentVar: "var(--poniente)",
    hero: ponienteHero,
    to: "/villa-poniente",
    huespedesMax: 4,
    direccion: "Partida del Cap Negre 3, Xàbia (Alicante)",
    llegada:
      "Sube por la carretera del Cap Negre hasta el mirador y continúa 300 m. La casa es la de muro encalado y buganvilla naranja. Aparcamiento privado justo antes de la entrada.",
    wifi: { red: "Remansa_Poniente", clave: "ocaso2026" },
    caja: "2094",
    checkIn: "A partir de las 17:00",
    checkOut: "Antes de las 11:00",
    normas: [
      "Silencio entre las 22:30 y las 8:00: la casa está en zona residencial tranquila.",
      "La chimenea solo se usa de octubre a abril; leña en el porche lateral.",
      "Basura: punto de recogida a 200 m, bajando a la derecha.",
      "No se admiten mascotas ni eventos.",
    ],
    electrodomesticos: [
      { titulo: "Climatización", detalle: "Bomba de calor con termostato en el salón. Modo 'nocturno' para dormir." },
      { titulo: "Piscina desbordante", detalle: "Se limpia los lunes y jueves por la mañana. Luz sumergida con el interruptor de la terraza." },
      { titulo: "Lavavajillas", detalle: "Programa corto de 45 min. Pastillas en el cajón bajo el fregadero." },
      { titulo: "Altavoz de terraza", detalle: "Bluetooth 'Poniente'. Se apaga automáticamente a las 22:30." },
    ],
    cerca: [
      { titulo: "Mirador del Cap Negre", tipo: "Mirador", texto: "Cinco minutos andando. El mejor sitio del cabo para ver caer el sol.", img: nearMirador },
      { titulo: "La Terraza del Faro", tipo: "Restaurante", texto: "Mesas para dos sobre el acantilado. Pide la mesa 7 al reservar.", img: nearRomantic },
      { titulo: "Paseo del Portitxol", tipo: "Paseo", texto: "Ruta costera de 40 minutos entre pinos, ideal al final del día.", img: nearRest },
    ],
    anfitrion: { nombre: "Marta", telefono: "+34 600 112 233", whatsapp: "34600112233" },
    temporadas: [
      { nombre: "Primavera", precio: 240 },
      { nombre: "Junio y septiembre", precio: 330 },
      { nombre: "Julio", precio: 460 },
      { nombre: "Agosto", precio: 610 },
    ],
  },
  salobre: {
    id: "salobre",
    name: "Villa Salobre",
    tagline: "A un paso del mar, lejos de todo lo demás",
    accentVar: "var(--salobre)",
    hero: salobreHero,
    to: "/villa-salobre",
    huespedesMax: 12,
    direccion: "Camí de la Cala 27, Benitatxell (Alicante)",
    llegada:
      "Los últimos 600 m son pista de tierra en buen estado. Al final verás una cancela verde y una higuera. Cabida para cuatro coches bajo la pérgola.",
    wifi: { red: "Remansa_Salobre", clave: "calaviva2026" },
    caja: "8351",
    checkIn: "A partir de las 16:30",
    checkOut: "Antes de las 10:30",
    normas: [
      "La música en el exterior se apaga a las 23:00; dentro, sin límite razonable.",
      "Los 90 escalones a la cala no tienen iluminación: llevad linterna al volver.",
      "Basura: separad vidrio y envases; el contenedor está a 1 km, en el cruce.",
      "Grupos sí, fiestas con invitados externos no.",
    ],
    electrodomesticos: [
      { titulo: "Brasa y horno de leña", detalle: "Enciéndelos con una hora de margen. Leña seca en el cobertizo, nunca dentro de casa." },
      { titulo: "Aire acondicionado", detalle: "Split independiente en cada dormitorio; mandos en la mesilla." },
      { titulo: "Cocina para grupos", detalle: "Dos hornos, lavavajillas industrial y nevera americana con hielo automático." },
      { titulo: "Ducha exterior", detalle: "Al volver de la cala, obligatoria antes de la piscina. Agua solar." },
    ],
    cerca: [
      { titulo: "Cala del Salobre", tipo: "Cala", texto: "Acceso propio por los 90 escalones. Cantos rodados y agua honda, sin chiringuitos.", img: nearCala },
      { titulo: "Chiringuito Les Roques", tipo: "Vida social", texto: "Cerveza fría y espetos al ponerse el sol. Música en directo los sábados.", img: nearChiringuito },
      { titulo: "Sendero de los Molinos", tipo: "Naturaleza", texto: "Ruta circular de 6 km entre acantilados. Salid temprano en verano.", img: nearSendero },
    ],
    anfitrion: { nombre: "Marta", telefono: "+34 600 112 233", whatsapp: "34600112233" },
    temporadas: [
      { nombre: "Primavera", precio: 380 },
      { nombre: "Junio y septiembre", precio: 540 },
      { nombre: "Julio", precio: 720 },
      { nombre: "Agosto", precio: 980 },
    ],
  },
};

export type Reserva = {
  codigo: string;
  villa: VillaId;
  huesped: string;
  llegada: string; // ISO
  salida: string; // ISO
  huespedes: number;
  total: number;
};

export const reservas: Reserva[] = [
  { codigo: "AZAHAR-2026", villa: "azahar", huesped: "Lucía", llegada: "2026-09-12", salida: "2026-09-19", huespedes: 6, total: 2380 },
  { codigo: "PONIENTE-2026", villa: "poniente", huesped: "Andrés", llegada: "2026-09-20", salida: "2026-09-25", huespedes: 2, total: 1650 },
  { codigo: "SALOBRE-2026", villa: "salobre", huesped: "Nerea", llegada: "2026-10-02", salida: "2026-10-06", huespedes: 10, total: 2160 },
];

export function buscarReserva(codigo: string): Reserva | undefined {
  const c = codigo.trim().toUpperCase();
  const exacta = reservas.find((r) => r.codigo === c);
  if (exacta) return exacta;
  // Demo: cualquier código que empiece por el nombre de una villa funciona.
  const villa = (Object.keys(villas) as VillaId[]).find((v) => c.startsWith(v.toUpperCase()));
  if (villa) return { ...reservas.find((r) => r.villa === villa)!, codigo: c };
  return undefined;
}

export function diasHasta(fecha: string) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const destino = new Date(`${fecha}T00:00:00`);
  return Math.round((destino.getTime() - hoy.getTime()) / 86400000);
}

export function formatoFecha(fecha: string) {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const eur = (n: number) => `${n.toLocaleString("es-ES")} €`;
