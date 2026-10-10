# SPEC 05 — Modal "Vincular padre" en el perfil del niño

> **Estado:** Implemented
> **Depende de:** SPEC 02, SPEC 03, SPEC 04
> **Fecha:** 2026-10-10
> **Objetivo:** Implementar `references/pantallas/vincular-padre.dc.html` como modal sobre `/kids/[id]` que envía una invitación y añade al padre como pendiente en memoria.

## Alcance

**Incluye:**

- "Vincular otro padre" en `ParentsCard` deja de ser `Link` a `/link-parent` (404) y pasa a `<button>` que abre la modal; la URL no cambia.
- Modal fiel al recurso: header "Vincular padre" + "a {kid.name}" + X; aviso azul ("Le enviaremos un correo con un código… Solo verá el feed de {kid.name}"); campos NOMBRE DEL PADRE/MADRE y EMAIL; chips PARENTESCO (Mamá / Papá / Tutor/a, Mamá preseleccionado); card de código `7K4P9` con "Vence en 7 días"; botón "Enviar invitación" con icono de avión.
- Validación: "Enviar invitación" deshabilitado hasta nombre no vacío y email con formato básico; sin mensajes de error (el recurso no los muestra).
- Cierre con X, Esc y click en el fondo; scroll lock del body; formulario siempre limpio al reabrir.
- Al enviar: se añade un `KidParent` con `status: "pending"` → aparece en PADRES VINCULADOS con badge PENDIENTE y "· invitación enviada".
- `invite` de `data/mock/auth.ts` se actualiza en memoria (`email`, datos del niño); `code` intacto → `/activate-account` refleja la última invitación enviada.
- Estado en un nuevo wrapper client `kid-profile-content.tsx`; `KidProfile` recibe `parents` y `onLinkParent` por props.
- `data/mock/kids.ts`: `KidParent.email?: string`. Iconos nuevos `SendIcon` e `InfoIcon` en `components/shared/icons.tsx`.

**Fuera de alcance (specs futuros):**

- Aceptación real de la invitación, login y gate de rutas (SPEC 03 intacto).
- Persistencia, API o BD: todo en memoria, se pierde al recargar.
- Abrir la modal desde el badge VINCULAR de `/kids` (queda como hoy).
- Ruta `/link-parent` (no se crea; el link se sustituye por el botón).
- Envío real de correos, códigos únicos y caducidad real de 7 días.
- Reenviar o cancelar la invitación de un padre ya pendiente.

## Modelo de datos

```ts
// data/mock/kids.ts — único cambio de tipo
export interface KidParent {
  // …campos actuales
  email?: string;   // solo padres creados desde la modal
}

// kid-profile-content.tsx — al enviar
const newParent: KidParent = {
  id: Math.max(...parents.map((p) => p.id), 0) + 1,
  name: form.name.trim(),
  relation: form.relation,              // "Mamá" | "Papá" | "Tutor/a"
  initial: form.name.trim()[0].toUpperCase(),
  avatarColor: parentPalette[parents.length % parentPalette.length],
  status: "pending",
  email: form.email.trim(),
};

// paleta fija reutilizando colores ya existentes en kids.ts
const parentPalette = ["#C9B6E8", "#A9C7E8", "#F4B8CC", "#F4DC8E", "#B9DEC4"];

// data/mock/auth.ts — mutación en memoria (el objeto es export const)
Object.assign(invite, {
  email: form.email.trim(),
  kidName: kid.name.split(" ")[0],   // "Mateo" → /activate-account no cambia
  kidInitial: kid.initial,
  room: kid.room,
  avatarBg: kid.avatarColor,
  avatarText: kid.avatarText,
});                                   // invite.code sigue siendo "7K4P9"
```

## Plan de implementación

1. `data/mock/kids.ts`: añadir `email?: string` a `KidParent`. `tsc` sin errores.
2. `components/shared/icons.tsx`: añadir `SendIcon` (avión) e `InfoIcon` (círculo i). Sin cambios visuales existentes.
3. `components/kids/link-parent-modal.tsx` (`"use client"`): overlay + card `max-w-[480px]` fiel al recurso; estados `name`/`email`/`relation`; `canSend`; useEffect con Esc + scroll lock; X y backdrop cierran. Props: `kid`, `onClose`, `onSend(values)`. Código desde `invite.code`.
4. `components/kids/kid-profile-content.tsx` (`"use client"`): estado `parents` (inicia con `kid.parents`) y `open`; `onSend` construye el `KidParent`, lo añade, hace `Object.assign(invite, …)` y cierra.
5. `components/kids/kid-profile.tsx`: `ParentsCard` recibe `parents` y `onLinkParent`; el `Link href="/link-parent"` (línea 105) se sustituye por `<button>`. `KidProfile` exporta `{ kid, parents, onLinkParent }`.
6. `app/kids/[id]/page.tsx`: `<KidProfile kid={kid} />` → `<KidProfileContent kid={kid} />`. Verificar `/kids/1`.
7. Verificación Playwright contra `references/pantallas/vincular-padre.dc.html` a 1280px y 390×844; 0 errores de consola.

## Criterios de aceptación

- [x] "Vincular otro padre" en `/kids/1` abre la modal sin navegar (URL sigue en `/kids/1`); no queda ningún `<a href="/link-parent">`.
- [x] La modal muestra header ("Vincular padre" / "a Mateo Fernández" + X), aviso azul, 2 inputs, 3 chips con Mamá activo, card con `7K4P9` y "Vence en 7 días", y el botón "Enviar invitación".
- [x] Esc, click en el fondo y X cierran la modal; con ella abierta el body no scrollea.
- [x] "Enviar invitación" está deshabilitado con nombre vacío o email vacío/inválido, y se habilita con nombre no vacío y email `a@b.c`.
- [x] Al cambiar de chip solo ese queda con el estilo activo (fondo `#CCD8F4`, borde `#9FB8EC`, texto `#4E72C8`).
- [x] Enviando válido: la modal se cierra y el padre aparece en PADRES VINCULADOS con nombre, relación, inicial, "· invitación enviada" y badge PENDIENTE.
- [x] Al recargar `/kids/1` los padres mock (Lucía ACTIVA, Diego PENDIENTE) siguen intactos y el nuevo desaparece (memoria).
- [x] Tras enviar o cancelar, reabrir muestra el formulario limpio y Mamá preseleccionado.
- [x] Tras enviar con email `ana@ejemplo.com` y nombre "Ana Pérez", `/activate-account` muestra ese email; si el niño es Mateo, la card sigue diciendo "Mateo · Sala Soles" y el código `7K4P9`.
- [x] El badge VINCULAR de `/kids` no abre la modal (la tarjeta sigue navegando a `/kids/<id>`).
- [x] Sin desbordes ni errores de consola a 1280px y 390×844; sin `<a>` literales; nombres de código en inglés.

## Decisiones

- **Sí:** modal client-side sobre `/kids/[id]` sin ruta propia — el recurso es modal (mismo patrón que SPEC 04).
- **Sí:** wrapper `kid-profile-content.tsx` — `kid-profile.tsx` sigue siendo server component que recibe props.
- **Sí:** alta del padre en memoria con `status: "pending"` — lo pedido; patrón SPEC 04.
- **Sí:** mutar `invite` en memoria — elegido para que `/activate-account` refleje la última invitación; se resetea al recargar.
- **Sí:** `invite.kidName` = solo el nombre de pila — evita romper el criterio verificado de SPEC 03 ("Mateo · Sala Soles").
- **Sí:** `email?: string` opcional en `KidParent` — el email se registra aunque la lista no lo muestre.
- **Sí:** botón deshabilitado sin errores rojos — el recurso no define mensajes de error.
- **Sí:** cierre X + Esc + fondo, sin "Cancelar" — fiel al recurso.
- **Sí:** código fijo del mock y "Vence en 7 días" estático — coherencia con SPEC 03.
- **Sí:** inicial derivada + paleta fija rotativa sobre colores ya usados.
- **No:** ruta `/link-parent`, apertura desde el badge VINCULAR, envío de correo, aceptación/login, persistencia.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Mutar `invite` es estado de módulo compartido | Resetea en recarga completa (aceptado: "en memoria"); verificar `/activate-account` tras navegación client-side |
| Next 16 con breaking changes (AGENTS.md) | Leer `node_modules/next/dist/docs/` antes de tocar `page.tsx` |
| Fidelidad del modal vs recurso | Playwright a 1280px y 390×844 contra `vincular-padre.dc.html` |

## Qué NO está en este spec

- Aceptación de la invitación y login del padre (otro spec).
- Persistencia / API / BD.
- Modal desde el badge VINCULAR de `/kids` y ruta `/link-parent`.
- Correo real, códigos únicos y caducidad real.
