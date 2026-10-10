# SPEC 04 — Modal "Agregar niño" en `/kids`

> **Estado:** Aprobado
> **Depende de:** SPEC 02
> **Fecha:** 2026-10-09
> **Objetivo:** Implementar `references/pantallas/agregar-nino.dc.html` como modal sobre `/kids` (no como pantalla) con formulario validado, máscara de fecha y alta en memoria del niño en la lista.

## Alcance

**Incluye:**

- Modal abierto por el botón "Agregar niño" de `/kids` (deja de ser `Link`; la URL no cambia).
- Card del recurso: header `Cancelar | Agregar niño | Guardar` + campos NOMBRE COMPLETO, FECHA DE NACIMIENTO (máscara `dd/mm/aaaa`), SALA (select "Soles"), ALERGIAS (texto libre), NOTAS MÉDICAS (textarea).
- Validación: nombre y fecha obligatorios; "Guardar" deshabilitado hasta que sean válidos; fecha con auto-barras, fecha real (rechaza `31/02/2022` y fechas futuras); error visual solo si la fecha está informada e inválida (borde `#D9583C` + texto 12px).
- Cierre con Cancelar, Esc y click en el fondo; scroll lock del body; formulario se limpia siempre al cerrar.
- "Guardar" añade el niño en memoria (estado React): aparece al final de la lista con badge VINCULAR, subtítulo con la fecha de nacimiento; contador "N niños" +1. Se pierde al recargar.
- Cambio mínimo en `KidCard`: subtítulo `{kid.age || kid.birthDate}` para los niños nuevos (los mock tienen `age`, no cambian).
- Corrección del href "Editar" en `kid-profile.tsx`: `/kids/nuevo` → `/kids/new` (solo el slug; la ruta sigue sin existir).

**Fuera de alcance (specs futuros):**

- Ruta `/kids/new` e "Editar": el link apunta a `/kids/new` y devuelve 404; la edición real va en otro spec. El perfil del niño nuevo (`/kids/<id>`) también devuelve 404 (aceptado).
- Persistencia, API o BD; la alta se pierde al recargar.
- Edición de niños.
- Mapeo del texto de alergias a `AlertKind` (queda texto libre; badge VINCULAR por no tener padres).
- Cálculo de edad real desde la fecha de nacimiento.

## Modelo de datos

Sin tipos nuevos. El modal construye un `Kid` existente (SPEC 02) a partir del formulario:

```ts
// Derivación al guardar (en kids-page-content.tsx)
const newKid: Kid = {
  id: Math.max(...list.map((k) => k.id)) + 1,
  name: form.name.trim(),
  initial: form.name.trim()[0].toUpperCase(),
  avatarColor: "#A9D9E8",
  avatarText: "#1F7A93",
  age: "",                       // KidCard muestra birthDate en su lugar
  birthDate: form.birthDate,     // "12/03/2022" tal cual la máscara
  room: form.room,               // "Soles"
  joined: "",                    // perfil del nuevo es 404, no se muestra
  alerts: [],                    // alergias son texto libre, no AlertKind
  notes: form.notes.trim() || undefined,
  parents: [],                   // → badge VINCULAR
};
```

Cambio en `data/mock/kids.ts`: `export const rooms = ["Soles"] as const;` (opciones del select).

## Plan de implementación

1. `data/mock/kids.ts`: añadir `rooms`. `tsc` sin errores.
2. `components/kids/kids-directory.tsx`: aceptar `kids: Kid[]` como prop (deja de importar el mock); `app/kids/page.tsx` le pasa `kids`. Sin cambio visual en `/kids`.
3. `components/kids/kid-card.tsx`: subtítulo `{kid.age || kid.birthDate} · …`. Las 8 tarjetas mock intactas.
4. `components/kids/add-kid-modal.tsx` (`"use client"`): overlay fijo + card `max-w-[520px]` fiel al recurso; campos controlados; máscara de fecha (solo dígitos, auto-barras, máx. 10 chars, validación de fecha real y no futura); error rojo solo si informada e inválida; "Guardar" deshabilitado hasta válido; Esc/backdrop/Cancelar cierran; scroll lock. Props: `onClose`, `onSave(values)`.
5. `components/kids/kids-page-content.tsx` (`"use client"`): estado `list` (inicia con `kids` mock) y `open`; header "GESTIÓN / Niños" con `<button>` "Agregar niño"; `KidsDirectory kids={list}`; `AddKidModal`; `onSave` construye el `Kid`, lo añade y cierra; el modal se limpia al cerrar (guardar o cancelar).
6. `app/kids/page.tsx`: reemplazar header + directorio + `Link` por `<KidsPageContent />` (Sidebar/MobileHeader siguen igual).
7. Corregir `components/kids/kid-profile.tsx`: href `/kids/nuevo` → `/kids/new`. Verificar `/kids/1` → click "Editar" → 404 en `/kids/new`.
8. Verificación Playwright contra `references/pantallas/agregar-nino.dc.html` a 1280px y 390×844; 0 errores de consola.

## Criterios de aceptación

- [ ] "Agregar niño" en `/kids` abre el modal sin navegar (URL sigue en `/kids`).
- [ ] El modal muestra el header (Cancelar / "Agregar niño" / Guardar) y los 5 campos del recurso; SALA es select con "Soles".
- [ ] Esc, click en el fondo y Cancelar cierran el modal; con el modal abierto el body no scrollea.
- [ ] La máscara convierte `12032022` en `12/03/2022`, acepta solo dígitos y máximo 10 caracteres.
- [ ] `31/02/2022` y fechas futuras muestran borde `#D9583C` y texto de error bajo el campo; una fecha válida los quita.
- [ ] "Guardar" está deshabilitado con nombre vacío o fecha vacía/inválida, y se habilita con nombre no vacío y fecha válida.
- [ ] Con "Guardar" válido: el modal se cierra y el niño aparece al final de la lista con su nombre, inicial, fecha como subtítulo y badge VINCULAR; el contador aumenta en 1.
- [ ] La tarjeta del nuevo navega a `/kids/<id>` y esa ruta devuelve 404 (aceptado).
- [ ] Reabrir tras guardar o cancelar muestra el formulario limpio (sala en "Soles").
- [ ] Las 8 tarjetas mock siguen idénticas ("3 años · 2 padres vinculados", badges) y el buscador filtra también los niños nuevos.
- [ ] El link "Editar" de `/kids/[id]` apunta a `/kids/new` (no `/kids/nuevo`) y esa ruta devuelve 404.
- [ ] Sin desbordes ni errores de consola a 1280px y 390×844; sin `<a>` literales; nombres en inglés.

## Decisiones

- **Sí:** modal client-side sobre `/kids` sin ruta propia — el recurso es un modal, no una pantalla.
- **Sí:** alta en memoria en `kids-page-content.tsx` — lo pedido; sin persistencia.
- **Sí:** tarjeta del nuevo navega a `/kids/[id]` aunque dé 404 — decisión explícita del usuario.
- **Sí:** subtítulo del nuevo con `birthDate` vía `kid.age || kid.birthDate` — el form no pide edad y SPEC 02 evita lógica de fechas.
- **Sí:** Guardar deshabilitado hasta válidos (nombre + fecha) — elegido sobre "errores al pulsar".
- **Sí:** máscara auto-barras + fecha real + no futura; error visual solo si informada e inválida — campos vacíos no se marcan en rojo.
- **Sí:** alergias como texto libre (no `AlertKind`) y `joined: ""` / `age: ""` — coherente con el alcance y el 404 del perfil.
- **Sí:** slug de ruta en inglés `/kids/new` — corrección del usuario sobre la decisión de SPEC 02 (`/kids/nuevo`); convención "rutas en inglés, texto en español". **No:** editar retroactivamente el SPEC 02.
- **No:** ruta `/kids/new` que renderice el modal, perfil del nuevo, persistencia, chips de alergias, cálculo de edad.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Cambio de `KidCard` rompe subtítulos existentes | `kid.age \|\| kid.birthDate`: los 8 mock tienen `age` no vacío |
| Next 16 con breaking changes | Leer `node_modules/next/dist/docs/` antes de tocar `page.tsx` |
| Máscara/validación de fecha con edge cases | Criterios verificables: `12032022`, `31/02/2022`, fecha futura |

## Qué NO está en este spec

- Ruta `/kids/new` e "Editar": la ruta no existe y devuelve 404; la edición del niño va en otro spec.
- Perfil del niño recién agregado (`/kids/<id>` → 404 aceptado).
- Persistencia, API o BD (la alta se pierde al recargar).
- Mapeo de alergias a `AlertKind` y cálculo de edad.
