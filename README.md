# Remansa — Villas frente al Mediterráneo

Caso de uso de **desarrollo a medida** para un portfolio pequeño de alquiler vacacional (tres villas). No es un SaaS multi-tenant: es la web y las herramientas internas de un único negocio, con su propia identidad visual, su portal del huésped y su backoffice.

Caso de uso desarrollado por **Isaac Wesley** para **Vivir de IA**.

---

## Qué es real y qué está simulado

### Real / funcional
Todo el estado dinámico persiste en `localStorage` a través de `src/lib/remansa-storage.ts`, sin backend:

- **Reservas y bloqueos** del calendario multi-propiedad
- **Limpiezas** (pendiente / completada)
- **Incidencias** de mantenimiento (abierta / en curso / resuelta)
- **Mensajería** compartida entre el portal del huésped y el backoffice
- **Contenido web editable** de las tres landings (textos, ficha, precios por temporada, políticas)

La primera carga siembra automáticamente los datos iniciales. A partir de ahí, todas las lecturas y escrituras van contra `localStorage`, con `try/catch` y fallback en memoria si el navegador lo bloquea.

### Simulado
- **Login del backoffice**: acepta cualquier credencial, no hay autenticación real
- **Formulario de reserva y pago**: no procesa cobros ni pasarela
- **Acceso al portal del huésped**: por código de reserva (p. ej. `AZAHAR-2026`), sin cuentas ni contraseñas
- **Mensajería**: no envía correos ni WhatsApp reales

---

## Estructura

| Ruta | Qué es |
| --- | --- |
| `/` | Landing colectiva: hero, portfolio de villas, filosofía, mapa interactivo (Leaflet), reseñas |
| `/villa-azahar` | Landing individual |
| `/villa-poniente` | Landing individual |
| `/villa-salobre` | Landing individual |
| `/mi-estancia` | Portal del huésped: acceso por código, cuenta atrás, guía de la casa, check-in/out, recomendaciones, contacto |
| `/admin` | Backoffice: calendario, limpiezas, incidencias, ocupación e ingresos, mensajería y **Contenido web** |

Cada landing individual repite la misma estructura: hero, descripción emocional, ficha práctica, amenities, galería por espacios, calendario y precios, formulario de reserva, qué hay cerca, condiciones y reseñas.

### Archivos clave

- `src/lib/remansa-data.ts` — datos estáticos de las villas (nombre, imágenes, wifi, indicaciones, recomendaciones, tarifas base)
- `src/lib/remansa-storage.ts` — persistencia: claves, semillas, getters/setters y hooks reactivos
- `src/components/admin/ContenidoWeb.tsx` — editor de contenido de las landings
- `src/components/site/` — cabecera, pie, mapa y bloques compartidos
- `src/styles.css` — sistema de diseño (Cormorant Garamond + Jost, paleta cálida, acentos por villa)

---

## Cómo adaptarlo a un caso real

Azahar, Poniente y Salobre son **solo contenido de muestra**. La estructura de datos admite añadir, quitar o renombrar propiedades sin tocar el diseño:

1. Edita `src/lib/remansa-data.ts`: cada villa es una entrada con su slug, acento de color, imágenes, ficha y tarifas.
2. Duplica una ruta de villa en `src/routes/` para cada propiedad nueva y apunta al slug correspondiente.
3. Sustituye las imágenes de `src/assets/` por las fotos reales.
4. Ajusta textos, precios y políticas desde el propio panel **Contenido web** del backoffice, sin tocar código.
5. Para producción real, sustituye `remansa-storage.ts` por una capa de datos con backend manteniendo la misma firma de funciones.

El backoffice incluye un botón **Restablecer datos** en la cabecera que borra el almacenamiento local y vuelve a sembrar el estado inicial en cualquier momento.

---

## Desarrollo

```sh
npm i
npm run dev
```

Stack: React 19 + TanStack Start (router basado en archivos), Vite 7, Tailwind CSS v4, Leaflet para el mapa.
