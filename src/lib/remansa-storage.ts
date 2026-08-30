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
  desde: number; // día de septiembre 2026
  hasta: number;
  estado: EstadoReserva;
  total: number;
  canal: string;
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
  return () => set.delete(fn);
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
