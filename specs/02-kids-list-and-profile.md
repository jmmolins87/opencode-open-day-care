# SPEC 02 — Pantallas Niños (`/kids`) y Perfil del niño (`/kids/[id]`)

> **Estado:** approved
> **Depende de:** SPEC 01
> **Fecha:** 2026-10-09
> **Objetivo:** Implementar las plantillas `references/pantallas/ninos.dc.html` y `perfil-nino.dc.html` como `/kids` y `/kids/[id]` con mock data, enum de alergias con colores, buscador client-side y reutilizando los componentes del SPEC 01.

## Alcance

**Incluye:**

- Ruta `/kids` (lista) con las 8 tarjetas del template y buscador funcional (filtro por nombre, frontend).
- Ruta `/kids/[id]` (perfil) con data mock completa del niño: alerta de alergias, ficha y padres vinculados.
- Ruta `/kids` como destino del ítem "Niños" del menú lateral (label visible sigue siendo "Niños").
- Archivo nuevo `data/mock/kids.ts` (mock data ficticia de niños, padres y alergias).
- Enum `AlertKind` de 5 alergias con color propio (badge de lista + caja del perfil).
- Reutilización de `Sidebar`, `MobileHeader` e iconos del SPEC 01; responsive con el mismo drawer.

**Fuera de alcance (specs futuros):**

- Páginas destino de los botones: Agregar/Editar niño, Resumen del día, Vincular padre, Nueva publicación (404 hoy).
- Base de datos o API (`database.db` vacío y sin commitear); la data es ficticia.
- Alta/baja/edición real de niños y vinculación de padres.
- Avisos, Mi cuenta, Login y resto de pantallas.

## Modelo de datos

Nuevo archivo `data/mock/kids.ts` (los mocks actuales no cubren niños):

```ts
// data/mock/kids.ts
export type AlertKind = "peanut" | "lactose" | "gluten" | "egg" | "tree-nuts";

export const alertStyles: Record<AlertKind, { label: string; bg: string; text: string }> = {
  peanut:      { label: "MANÍ",           bg: "#FBD8CC", text: "#D9684A" },
  lactose:     { label: "LACTOSA",        bg: "#C7E7F1", text: "#2E89A6" },
  gluten:      { label: "GLUTEN",         bg: "#F7E7A6", text: "#9A7B1E" },
  egg:         { label: "HUEVO",          bg: "#CFEBD8", text: "#3E9B6C" },
  "tree-nuts": { label: "FRUTOS SECOS",   bg: "#CCD8F4", text: "#4E72C8" },
};

export type ParentStatus = "active" | "pending";

export interface KidParent {
  id: number;
  name: string;         // "Lucía Fernández"
  relation: string;     // "Mamá" | "Papá"
  initial: string;      // "L"
  avatarColor: string;  // "#C9B6E8"
  status: ParentStatus; // ACTIVA / PENDIENTE
}

export interface Kid {
  id: number;           // 1..8 → /kids/1
  name: string;         // "Mateo Fernández"
  initial: string;      // "M"
  avatarColor: string;  // "#A9D9E8"
  avatarText: string;   // "#1F7A93"
  age: string;          // "3 años" (string, no se calcula)
  birthDate: string;    // "12 mar 2022"
  room: string;         // "Soles"
  joined: string;       // "feb 2025"
  alerts: AlertKind[];  // ["peanut"] → badge con color por tipo
  notes?: string;       // "Evitar frutos secos. Lleva inhalador…"
  parents: KidParent[];
}
```

Derivados (no se guardan):

- Subtítulo de tarjeta: `${age} · ${parents.length === 0 ? "sin padres vinculados" : `${parents.length} padre(s) vinculado(s)`}`.
- Badge de tarjeta: si `alerts.length > 0` → `alertStyles[alerts[0]]` (color por tipo); si no, si `parents.length === 0` → `VINCULAR` (`#F9D2DE`/`#C56486`); si no → chevron.
- Contador "8 niños" = `kids.length`.
- Caja "Alergias y notas" del perfil: solo si `alerts.length > 0 || notes`, con el color de `alertStyles[alerts[0]]`.

## Plan de implementación

1. Crear `data/mock/kids.ts` con `AlertKind`, `alertStyles`, `Kid`/`KidParent` y los 8 niños ficticios (ids 1–8; alerts: peanut, lactose, gluten, egg, tree-nuts repartidos; id 4 Valentina sin padres). `tsc` sin errores.
2. Actualizar `data/mock/nav.ts`: `{ label: "Niños", href: "/kids" }`. Grep para confirmar que no quede ninguna referencia a rutas de niños en español.
3. Crear `components/kids/kid-card.tsx`: `Link` a `/kids/${kid.id}`, avatar, subtítulo y badge derivados.
4. Crear `components/kids/kids-directory.tsx` (`"use client"`): estado de query, filtra por nombre, grilla `grid-cols-1 lg:grid-cols-2` o mensaje "sin resultados".
5. Crear `app/kids/page.tsx`: reusar `Sidebar active="/kids"` + `MobileHeader` + encabezado "GESTIÓN / Niños" + botón Agregar niño + `KidsDirectory` con sección "SALA SOLES". Verificar a 1280px.
6. Crear `components/kids/kid-profile.tsx`: encabezado con avatar y Editar, caja de alerta con color del tipo (condicional), ficha de datos, columna de padres vinculados + "Vincular otro padre".
7. Crear `app/kids/[id]/page.tsx`: `Number(id)` inválido o sin match → `notFound()`; "Volver a Niños" → `/kids`; botón "Resumen del día"; compone `KidProfile`. Probar `/kids/1` y `/kids/999`.
8. Verificación visual con Playwright contra `references/screenshots/ninos.png`/`ninos2.png` y `references/pantallas/perfil-nino.dc.html`; drawer móvil a 390×844.

## Criterios de aceptación

- [ ] `/kids` carga sin errores de consola y muestra las 8 tarjetas del template.
- [ ] El menú navega a `/kids` con "Niños" activo (bg `#FBE3D8`, texto `#D9583C`).
- [ ] Cada tarjeta navega a `/kids/<id>` numérico (ej. `/kids/1`).
- [ ] Subtítulos derivados correctos: "3 años · 2 padres vinculados", "2 años · sin padres vinculados".
- [ ] Badges con color por tipo: MANÍ, LACTOSA, y el resto del enum con sus colores; VINCULAR en el id 4; chevron en niños sin alerts.
- [ ] El buscador filtra en tiempo real (frontend) y, sin coincidencias, muestra el mensaje "sin resultados".
- [ ] `/kids/1` muestra avatar, "3 años · Sala Soles", caja de alergias (color de `peanut`), ficha (fecha/sala/ingreso), "Resumen del día" y los 2 padres con estados ACTIVA/PENDIENTE.
- [ ] "Volver a Niños" navega a `/kids`.
- [ ] `/kids/999` devuelve 404 (`notFound()`).
- [ ] Un niño sin alerts no muestra la caja de alerta en su perfil.
- [ ] Agregar niño, Editar, Resumen del día y Vincular otro padre usan `next/link` sin lógica.
- [ ] En móvil (390×844) el sidebar queda oculto y el drawer abre/cierra con "Niños" activo.
- [ ] No se duplican `Sidebar`/`MobileHeader`/iconos: solo se reusan de `components/shared/`.

## Decisiones

- **Sí:** id numérico en la URL (`/kids/1`) — lo pedido por el usuario. **No:** slug con nombre.
- **Sí:** archivo nuevo `data/mock/kids.ts` — los mocks actuales no tienen datos de niños.
- **Sí:** reusar `Sidebar`, `MobileHeader` e iconos del SPEC 01. **No:** copiar componentes.
- **Sí:** buscador client-side (`"use client"` solo en `KidsDirectory`).
- **Sí:** enum `AlertKind` de 5 alergias con color por tipo, usando la paleta existente del proyecto. **No:** un solo color de alerta; **no:** campo badge hardcodeado.
- **Sí:** data mock completa en el perfil (ficticia) y acciones como links sin lógica. **No:** placeholders de "—" en campos.
- **Sí:** fechas y edad como strings ya formateados — fidelidad, cero lógica de fechas.
- **Sí:** `notFound()` de Next para id inválido o inexistente.
- **Sí:** label visible "Niños" con href `/kids` — fidelidad al template, ruta en inglés.
- **Sí:** caja de alerta condicional en el perfil.
- **Sí:** Agregar niño y Editar apuntan ambos a `/kids/nuevo` — igual que el template.
- **Sí:** componentes nuevos solo en `components/kids/`.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Quedan referencias a rutas de niños en español en el código | Grep tras cambiar `nav.ts`. |
| Next 16 con breaking changes (AGENTS.md) | Leer `node_modules/next/dist/docs/` antes de codear rutas dinámicas y `notFound`. |
| Traducción de estilos inline a Tailwind diverge | Verificar contra `ninos.png`/`ninos2.png` y el template. |
| Colores nuevos del enum fuera de paleta | Derivados de badges existentes (ACTIVIDAD, PENDIENTE, ACTIVA, ANUNCIO). |

## Qué NO está en este spec

- Páginas destino de los botones (Agregar niño, Editar, Resumen del día, Vincular padre).
- Base de datos, API o autenticación (data ficticia).
- Lógica de alta/edición de niños o vinculación de padres.
- Resto de pantallas (Avisos, Mi cuenta, Login…).
