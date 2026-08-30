import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Punto = {
  id: string;
  name: string;
  tagline: string;
  color: string;
  lat: number;
  lng: number;
};

// Ubicaciones aproximadas (desplazadas 100-300 m respecto a la dirección real)
const puntos: Punto[] = [
  {
    id: "azahar",
    name: "Villa Azahar",
    tagline: "Donde el aire huele a azahar",
    color: "var(--azahar)",
    lat: 38.7918,
    lng: 0.1571,
  },
  {
    id: "poniente",
    name: "Villa Poniente",
    tagline: "Un atardecer distinto cada noche",
    color: "var(--poniente)",
    lat: 38.7521,
    lng: 0.1948,
  },
  {
    id: "salobre",
    name: "Villa Salobre",
    tagline: "A un paso del mar, lejos de todo lo demás",
    color: "var(--salobre)",
    lat: 38.7212,
    lng: 0.1762,
  },
];

export default function VillasMap() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const map = L.map(el, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      className: "remansa-tiles",
    }).addTo(map);

    const grupo: L.Marker[] = [];

    for (const p of puntos) {
      const icon = L.divIcon({
        className: "remansa-pin-wrap",
        html: `<span class="remansa-pin" style="--pin:${p.color}"></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([p.lat, p.lng], { icon, title: p.name }).addTo(map);
      marker.bindTooltip(
        `<span class="remansa-tip-name">${p.name}</span><span class="remansa-tip-tag">${p.tagline}</span>`,
        { direction: "top", offset: [0, -14], className: "remansa-tip", opacity: 1 },
      );
      grupo.push(marker);
    }

    map.fitBounds(L.latLngBounds(puntos.map((p) => [p.lat, p.lng] as [number, number])), {
      padding: [64, 64],
      maxZoom: 13,
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="size-full"
      role="application"
      aria-label="Mapa con la ubicación aproximada de las tres villas de Remansa"
    />
  );
}
