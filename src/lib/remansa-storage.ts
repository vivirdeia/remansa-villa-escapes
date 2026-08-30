/**
 * Estado dinámico de la demo Remansa persistido en localStorage.
 *
 * - Los datos "de catálogo" (villas, precios, textos) siguen en remansa-data.ts.
 * - Aquí vive todo lo que cambia con el uso: reservas del calendario, limpiezas,
 *   incidencias y conversaciones de mensajería.
 * - La primera carga siembra los datos de ejemplo. A partir de ahí, todas las
 *   lecturas y escrituras pasan por este módulo.
 * - Si localStorage no está disponible (SSR, modo privado, cuota llena) se
 *   trabaja en memoria y la app sigue funcionando sin romperse.
 */

import { useCallback, useEffect, useState } from "react";
import type { VillaId } from "@/lib/remansa-data";

/* ---------------- tipos ---------------- */

export type EstadoReserva = "confirmada" | "bloqueo" | "pendiente";

export type Booking = {
  id: string;
  villa: VillaId;
  huesped: string;
  desde: number; // día de septiembre 2026 (0 si la estancia cae fuera del mes en pantalla)
  hasta: number;
  estado: EstadoReserva;
  total: number;
  canal: string;
  /** Código de acceso al portal del huésped (solo en reservas creadas desde la web). */
  codigo?: string;
  llegada?: string; // ISO
  salida?: string; // ISO
  huespedes?: number;
  email?: string;
  nota?: string;
};


export type Limpieza = {
  id: string;
  villa: VillaId;
  fecha: string;
  franja: string;
  equipo: string;
  nota: string;
  hecha: boolean;
};

export type EstadoIncidencia = "abierta" | "en curso" | "resuelta";

export type Incidencia = {
  id: string;
  villa: VillaId;
  titulo: string;
  fecha: string;
  prioridad: "alta" | "media" | "baja";
  estado: EstadoIncidencia;
};

export type MensajeChat = {
  id: string;
  de: "huesped" | "host";
  texto: string;
  hora: string;
};

export type Conversacion = {
  id: string;
  huesped: string;
  villa: VillaId;
  sinLeer: number;
  mensajes: MensajeChat[];
};

/* ---------------- semillas ---------------- */

export const bookingsSeed: Booking[] = [
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

export const limpiezasSeed: Limpieza[] = [
  { id: "L-201", villa: "azahar", fecha: "8 sep", franja: "11:00 – 15:00", equipo: "Rosa y Amal", nota: "Salida de 6 huéspedes con perro. Aspirar sofás.", hecha: true },
  { id: "L-202", villa: "poniente", fecha: "9 sep", franja: "11:30 – 14:00", equipo: "Rosa", nota: "Reponer leña y velas de la terraza.", hecha: true },
  { id: "L-203", villa: "salobre", fecha: "6 sep", franja: "10:30 – 16:00", equipo: "Equipo completo", nota: "Grupo de 10. Limpieza de brasa y ducha exterior.", hecha: true },
  { id: "L-204", villa: "azahar", fecha: "12 sep", franja: "11:00 – 15:00", equipo: "Rosa y Amal", nota: "Entrada familiar: cuna y trona montadas.", hecha: false },
  { id: "L-205", villa: "salobre", fecha: "18 sep", franja: "10:30 – 16:00", equipo: "Equipo completo", nota: "Cambio entre dos grupos, margen ajustado.", hecha: false },
  { id: "L-206", villa: "poniente", fecha: "18 sep", franja: "11:30 – 14:00", equipo: "Amal", nota: "Revisar filtro de la piscina desbordante.", hecha: false },
  { id: "L-207", villa: "azahar", fecha: "19 sep", franja: "11:00 – 14:30", equipo: "Rosa", nota: "Salida sin entrada posterior: limpieza a fondo.", hecha: false },
];

export const incidenciasSeed: Incidencia[] = [
  { id: "I-118", villa: "salobre", titulo: "Peldaño suelto en el acceso a la cala", fecha: "05 sep 2026", prioridad: "alta", estado: "en curso" },
  { id: "I-119", villa: "azahar", titulo: "Persiana del dormitorio norte atascada", fecha: "07 sep 2026", prioridad: "media", estado: "abierta" },
  { id: "I-120", villa: "poniente", titulo: "Luz sumergida de la piscina fundida", fecha: "08 sep 2026", prioridad: "media", estado: "abierta" },
  { id: "I-115", villa: "azahar", titulo: "Riego por goteo del jardín de cítricos", fecha: "28 ago 2026", prioridad: "baja", estado: "resuelta" },
  { id: "I-116", villa: "salobre", titulo: "Wifi inestable en el dormitorio 5", fecha: "30 ago 2026", prioridad: "media", estado: "resuelta" },
];

export const conversacionesSeed: Conversacion[] = [
  {
    id: "M-1",
    huesped: "Lucía Ferrer",
    villa: "azahar",
    sinLeer: 2,
    mensajes: [
      { id: "M-1-a", de: "huesped", texto: "Llegamos sobre las 18:00, ¿está bien?", hora: "09:12" },
      { id: "M-1-b", de: "host", texto: "Perfecto, Lucía. La caja estará lista desde las 16:00.", hora: "09:20" },
      { id: "M-1-c", de: "huesped", texto: "¿Podemos dejar las maletas después del check-out?", hora: "09:41" },
    ],
  },
  {
    id: "M-2",
    huesped: "Andrés y Clara",
    villa: "poniente",
    sinLeer: 0,
    mensajes: [
      { id: "M-2-a", de: "host", texto: "Os he apuntado la mesa 7 del Faro, la del acantilado.", hora: "Ayer" },
      { id: "M-2-b", de: "huesped", texto: "Reservado en La Terraza del Faro, ¡gracias!", hora: "Ayer" },
    ],
  },
  {
    id: "M-3",
    huesped: "Cuadrilla Bilbao",
    villa: "salobre",
    sinLeer: 1,
    mensajes: [
      { id: "M-3-a", de: "huesped", texto: "Somos 11 al final, ¿hay problema con la cama extra?", hora: "Ayer" },
    ],
  },
  {
    id: "M-4",
    huesped: "Marion Leclerc",
    villa: "poniente",
    sinLeer: 0,
    mensajes: [
      { id: "M-4-a", de: "huesped", texto: "Bonjour, quelle est l'heure d'arrivée ?", hora: "Lun" },
      { id: "M-4-b", de: "host", texto: "Bonjour Marion, à partir de 17:00. À bientôt !", hora: "Lun" },
    ],
  },
  {
    id: "M-5",
    huesped: "Grupo Nerea",
    villa: "salobre",
    sinLeer: 0,
    mensajes: [
      { id: "M-5-a", de: "huesped", texto: "Todo perfecto, dejamos las llaves en la caja.", hora: "3 sep" },
      { id: "M-5-b", de: "host", texto: "Mil gracias por dejarlo todo tan cuidado.", hora: "3 sep" },
    ],
  },
];

/* ---------------- capa de acceso ---------------- */

export const STORAGE_KEYS = {
  bookings: "remansa.bookings",
  limpiezas: "remansa.limpiezas",
  incidencias: "remansa.incidencias",
  conversaciones: "remansa.conversaciones",
  contenido: "remansa.contenido",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

type Cache = Record<string, unknown>;
const memoria: Cache = {};

function storage(): Storage | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const probe = "__remansa__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

function leer<T>(key: StorageKey, seed: T[]): T[] {
  const ls = storage();
  if (!ls) return (memoria[key] as T[]) ?? seed;
  try {
    const raw = ls.getItem(key);
    if (raw === null) {
      ls.setItem(key, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : seed;
  } catch {
    return (memoria[key] as T[]) ?? seed;
  }
}

function escribir<T>(key: StorageKey, valor: T[]) {
  memoria[key] = valor;
  const ls = storage();
  if (!ls) return;
  try {
    ls.setItem(key, JSON.stringify(valor));
  } catch {
    /* cuota llena o almacenamiento bloqueado: seguimos en memoria */
  }
}

/* ---------------- pub/sub ---------------- */

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();

function subscribe(key: StorageKey, fn: Listener) {
  const set = listeners.get(key) ?? new Set<Listener>();
  set.add(fn);
  listeners.set(key, set);
  return () => {
    set.delete(fn);
  };
}

function notificar(key: StorageKey) {
  listeners.get(key)?.forEach((fn) => fn());
}

/* ---------------- API por tipo de dato ---------------- */

export const getBookings = () => leer<Booking>(STORAGE_KEYS.bookings, bookingsSeed);
export const setBookings = (v: Booking[]) => {
  escribir(STORAGE_KEYS.bookings, v);
  notificar(STORAGE_KEYS.bookings);
};

export const getLimpiezas = () => leer<Limpieza>(STORAGE_KEYS.limpiezas, limpiezasSeed);
export const setLimpiezas = (v: Limpieza[]) => {
  escribir(STORAGE_KEYS.limpiezas, v);
  notificar(STORAGE_KEYS.limpiezas);
};

export const getIncidencias = () => leer<Incidencia>(STORAGE_KEYS.incidencias, incidenciasSeed);
export const setIncidencias = (v: Incidencia[]) => {
  escribir(STORAGE_KEYS.incidencias, v);
  notificar(STORAGE_KEYS.incidencias);
};

export const getConversaciones = () =>
  leer<Conversacion>(STORAGE_KEYS.conversaciones, conversacionesSeed);
export const setConversaciones = (v: Conversacion[]) => {
  escribir(STORAGE_KEYS.conversaciones, v);
  notificar(STORAGE_KEYS.conversaciones);
};

/** Siembra los datos de ejemplo si aún no existen. Seguro de llamar varias veces. */
export function sembrarSiHaceFalta() {
  getBookings();
  getLimpiezas();
  getIncidencias();
  getConversaciones();
  getContenidos();
}

/** Borra el estado de la demo y vuelve a sembrar los datos originales. */
export function restablecerDemo() {
  const ls = storage();
  Object.values(STORAGE_KEYS).forEach((key) => {
    delete memoria[key];
    try {
      ls?.removeItem(key);
    } catch {
      /* ignorado a propósito */
    }
  });
  sembrarSiHaceFalta();
  Object.values(STORAGE_KEYS).forEach((key) => notificar(key));
}

/** Añade un mensaje a la conversación del huésped; la crea si no existe. */
export function añadirMensaje(opciones: {
  huesped: string;
  villa: VillaId;
  de: MensajeChat["de"];
  texto: string;
}) {
  const { huesped, villa, de, texto } = opciones;
  const hora = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  const mensaje: MensajeChat = { id: `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, de, texto, hora };

  const actuales = getConversaciones();
  const existente = actuales.find(
    (c) => c.huesped.toLowerCase() === huesped.toLowerCase() && c.villa === villa,
  );

  if (existente) {
    setConversaciones(
      actuales.map((c) =>
        c === existente
          ? {
              ...c,
              mensajes: [...c.mensajes, mensaje],
              sinLeer: de === "huesped" ? c.sinLeer + 1 : 0,
            }
          : c,
      ),
    );
    return existente.id;
  }

  const id = `M-${Date.now()}`;
  setConversaciones([
    { id, huesped, villa, sinLeer: de === "huesped" ? 1 : 0, mensajes: [mensaje] },
    ...actuales,
  ]);
  return id;
}

/* ---------------- hook ---------------- */

/**
 * Lee una colección persistida y la mantiene sincronizada entre componentes.
 * En el primer render devuelve la semilla (SSR-safe) y rehidrata tras montar.
 */
export function useColeccion<T>(
  key: StorageKey,
  get: () => T[],
  set: (valor: T[]) => void,
): [T[], (actualizar: T[] | ((prev: T[]) => T[])) => void] {
  const [items, setItems] = useState<T[]>(() => get() as T[]);

  useEffect(() => {
    setItems(get() as T[]);
    return subscribe(key, () => setItems(get() as T[]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const actualizar = useCallback(
    (valor: T[] | ((prev: T[]) => T[])) => {
      const siguiente = typeof valor === "function" ? (valor as (p: T[]) => T[])(get() as T[]) : valor;
      set(siguiente);
      setItems(siguiente);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [items, actualizar];
}

export const useBookings = () =>
  useColeccion<Booking>(STORAGE_KEYS.bookings, getBookings, setBookings);
export const useLimpiezas = () =>
  useColeccion<Limpieza>(STORAGE_KEYS.limpiezas, getLimpiezas, setLimpiezas);
export const useIncidencias = () =>
  useColeccion<Incidencia>(STORAGE_KEYS.incidencias, getIncidencias, setIncidencias);
export const useConversaciones = () =>
  useColeccion<Conversacion>(STORAGE_KEYS.conversaciones, getConversaciones, setConversaciones);

/* ---------------- contenido editable de las landings ---------------- */

export type TemporadaEditable = {
  nombre: string;
  meses: string;
  precio: number;
  minNoches: number;
};

export type ContenidoVilla = {
  villa: VillaId;
  nombre: string;
  tagline: string;
  descripcionTitulo: string;
  descripcion: string;
  habitaciones: number;
  banos: number;
  huespedesMax: number;
  fichaExtra: string[];
  temporadas: TemporadaEditable[];
  limpiezaFinal: number;
  fianza: number;
  normas: string[];
  cancelacion: string;
  checkIn: string;
  checkOut: string;
};

export const contenidoSeed: ContenidoVilla[] = [
  {
    villa: "azahar",
    nombre: "Villa Azahar",
    tagline: "Donde el aire huele a azahar",
    descripcionTitulo:
      "Hay casas que se visitan y casas que se recuerdan. Villa Azahar es de las segundas.",
    descripcion:
      "Un jardín de naranjos que perfuma cada mañana, una piscina que mira al mar y habitaciones pensadas para que el silencio también forme parte de las vacaciones.",
    habitaciones: 4,
    banos: 3,
    huespedesMax: 8,
    fichaExtra: [
      "Piscina privada",
      "Jardín de cítricos",
      "Parking en la finca",
      "8 min a pie de la playa",
    ],
    temporadas: [
      { nombre: "Temporada baja", meses: "Noviembre – marzo", precio: 290, minNoches: 3 },
      { nombre: "Media", meses: "Abril, mayo, octubre", precio: 410, minNoches: 4 },
      { nombre: "Alta", meses: "Junio, septiembre", precio: 560, minNoches: 5 },
      { nombre: "Muy alta", meses: "Julio y agosto", precio: 740, minNoches: 7 },
    ],
    limpiezaFinal: 140,
    fianza: 500,
    normas: [
      "Silencio entre las 23:00 y las 8:00: los vecinos están muy cerca del jardín.",
      "Mascotas bienvenidas; no pueden subir a las camas ni quedarse solas en casa.",
      "Basura: contenedores al final del camino, orgánico en el marrón (martes y viernes).",
      "No se admiten fiestas ni visitas que no estén en la reserva.",
    ],
    cancelacion:
      "Cancelación gratuita hasta 30 días antes de la llegada, con devolución íntegra del anticipo. Entre 30 y 14 días, se devuelve el 50 %. En los últimos 14 días no hay devolución, pero intentamos reubicar tu estancia en otras fechas del mismo año.",
    checkIn: "A partir de las 16:00",
    checkOut: "Antes de las 11:00",
  },
  {
    villa: "poniente",
    nombre: "Villa Poniente",
    tagline: "Un atardecer distinto cada noche",
    descripcionTitulo:
      "Villa Poniente no se enseña por la mañana. Se enseña a las ocho y media, cuando la luz se vuelve espesa y todo el mundo deja de hablar.",
    descripcion:
      "Una terraza volada sobre el pinar, una piscina que se tiñe de naranja durante media hora y dos habitaciones para dos personas que no necesitan más. Aquí no hay planes ni horarios: hay una hora concreta del día que lo justifica todo, y el resto del tiempo, silencio.",
    habitaciones: 2,
    banos: 2,
    huespedesMax: 4,
    fichaExtra: [
      "Terraza al poniente",
      "Piscina desbordante",
      "Parking privado",
      "6 min a pie a la cala",
    ],
    temporadas: [
      { nombre: "Temporada baja", meses: "Noviembre – marzo", precio: 240, minNoches: 2 },
      { nombre: "Media", meses: "Abril, mayo, octubre", precio: 330, minNoches: 3 },
      { nombre: "Alta", meses: "Junio, septiembre", precio: 460, minNoches: 4 },
      { nombre: "Muy alta", meses: "Julio y agosto", precio: 610, minNoches: 5 },
    ],
    limpiezaFinal: 95,
    fianza: 350,
    normas: [
      "Silencio entre las 22:30 y las 8:00: la casa está en zona residencial tranquila.",
      "La chimenea solo se usa de octubre a abril; leña en el porche lateral.",
      "Basura: punto de recogida a 200 m, bajando a la derecha.",
      "No se admiten mascotas ni eventos.",
    ],
    cancelacion:
      "Cancelación gratuita hasta 21 días antes de la llegada. Entre 21 y 7 días, se retiene el 50 % del importe. En los últimos 7 días no hay devolución, salvo que podamos volver a alquilar las fechas.",
    checkIn: "A partir de las 17:00",
    checkOut: "Antes de las 11:00",
  },
  {
    villa: "salobre",
    nombre: "Villa Salobre",
    tagline: "A un paso del mar, lejos de todo lo demás",
    descripcionTitulo:
      "Aquí la casa no compite con el paisaje: se deja ganar. Piedra seca, pino carrasco y una escalera que baja hasta el agua.",
    descripcion:
      "Villa Salobre está construida en el borde, donde el monte se rompe y empieza el azul. Se duerme con la ventana abierta y el ruido del mar contra las rocas, se come tarde en una mesa de catorce y se pasa el día descalzo. No hay vecinos, no hay cobertura en la cala y no hace ninguna falta.",
    habitaciones: 6,
    banos: 5,
    huespedesMax: 12,
    fichaExtra: [
      "Acceso propio a cala",
      "Pérgola con brasa",
      "Parking para 4 coches",
      "90 escalones al agua",
    ],
    temporadas: [
      { nombre: "Temporada baja", meses: "Noviembre – marzo", precio: 380, minNoches: 3 },
      { nombre: "Media", meses: "Abril, mayo, octubre", precio: 540, minNoches: 4 },
      { nombre: "Alta", meses: "Junio, septiembre", precio: 720, minNoches: 5 },
      { nombre: "Muy alta", meses: "Julio y agosto", precio: 980, minNoches: 7 },
    ],
    limpiezaFinal: 210,
    fianza: 900,
    normas: [
      "La música en el exterior se apaga a las 23:00; dentro, sin límite razonable.",
      "Los 90 escalones a la cala no tienen iluminación: llevad linterna al volver.",
      "Basura: separad vidrio y envases; el contenedor está a 1 km, en el cruce.",
      "Grupos sí, fiestas con invitados externos no.",
    ],
    cancelacion:
      "Cancelación gratuita hasta 45 días antes de la llegada. Entre 45 y 21 días, se retiene el 30 %. A partir de 21 días, el importe no es reembolsable; en grupos grandes recomendamos contratar un seguro de cancelación.",
    checkIn: "A partir de las 16:30",
    checkOut: "Antes de las 10:30",
  },
];

export const getContenidos = () =>
  leer<ContenidoVilla>(STORAGE_KEYS.contenido, contenidoSeed);
export const setContenidos = (v: ContenidoVilla[]) => {
  escribir(STORAGE_KEYS.contenido, v);
  notificar(STORAGE_KEYS.contenido);
};

/** Contenido de una villa concreta, con la semilla como respaldo. */
export function getContenido(villa: VillaId): ContenidoVilla {
  return (
    getContenidos().find((c) => c.villa === villa) ??
    contenidoSeed.find((c) => c.villa === villa)!
  );
}

/** Guarda el contenido de una villa manteniendo el resto intacto. */
export function guardarContenido(contenido: ContenidoVilla) {
  const actuales = getContenidos();
  setContenidos(
    actuales.some((c) => c.villa === contenido.villa)
      ? actuales.map((c) => (c.villa === contenido.villa ? contenido : c))
      : [...actuales, contenido],
  );
}

export const useContenidos = () =>
  useColeccion<ContenidoVilla>(STORAGE_KEYS.contenido, getContenidos, setContenidos);

/** Contenido reactivo de una villa; SSR-safe (primer render con la semilla). */
export function useContenidoVilla(villa: VillaId): ContenidoVilla {
  const [contenidos] = useContenidos();
  return (
    contenidos.find((c) => c.villa === villa) ??
    contenidoSeed.find((c) => c.villa === villa)!
  );
}
