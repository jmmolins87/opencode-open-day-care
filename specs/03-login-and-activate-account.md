# SPEC 03 — Login (`/login`) y Activar cuenta (`/activate-account`)

> **Estado:** Approved
> **Depende de:** SPEC 01
> **Fecha:** 2026-10-09
> **Objetivo:** Implementar las plantillas `login.dc.html` y `activar-cuenta.dc.html` como `/login` y `/activate-account` con mock data y fidelidad visual al diseño.

## Alcance

**Incluye:**

- Ruta `/login`: pantalla split (panel gradiente + formulario), campos email/contraseña, "¿Olvidaste tu contraseña?" sin acción, botón "Iniciar sesión" que navega a `/` y link "Activa tu cuenta" → `/activate-account`.
- Ruta `/activate-account`: pantalla centrada, card de invitación (Mateo · Sala Soles), código `7K4P9`, email, crear contraseña, checkbox de consentimiento de fotos (toggle funcional, marcado por defecto), botón "Activar mi cuenta" → `/family-feed` y link "Iniciar sesión" → `/login`.
- Archivo nuevo `data/mock/auth.ts` (datos de invitación).
- Componentes nuevos en `components/auth/` con `"use client"` solo donde hay estado (checkbox).
- Ambas pantallas sin `Sidebar` ni `MobileHeader` (full-bleed, como en el template).
- Fidelidad de colores, radios, sombras, gradientes y tipografías (Fredoka/Nunito ya globales del SPEC 01).

**Fuera de alcance (specs futuros):**

- Autenticación real, sesiones, validación de credenciales y gate de rutas (SPEC 01 intacto: `/` sigue mostrando el feed).
- Recuperación de contraseña ("¿Olvidaste tu contraseña?" queda como texto sin acción).
- Ruta `/family-feed` (pantalla familia, 404 hasta su spec — patrón aceptado en SPEC 01).
- Activación real de cuentas, validación del código de invitación y persistencia del consentimiento.

## Modelo de datos

Nuevo archivo `data/mock/auth.ts` (los mocks actuales no cubren invitaciones):

```ts
// data/mock/auth.ts
export interface Invite {
  code: string;           // "7K4P9"
  email: string;          // "lucia.fernandez@gmail.com"
  kidName: string;        // "Mateo"
  kidInitial: string;     // "M"
  room: string;           // "Soles"
  avatarBg: string;       // "#A9D9E8"
  avatarText: string;     // "#1F7A93"
  consentDefault: boolean; // true
}

export const invite: Invite = {
  code: "7K4P9",
  email: "lucia.fernandez@gmail.com",
  kidName: "Mateo",
  kidInitial: "M",
  room: "Soles",
  avatarBg: "#A9D9E8",
  avatarText: "#1F7A93",
  consentDefault: true,
};
```

## Plan de implementación

1. Crear `data/mock/auth.ts` con `Invite`/`invite` (datos del template). `tsc` sin errores.
2. Crear `components/auth/login-panel.tsx` (server): panel izquierdo gradiente `#F6A98E→#EC7E62`, círculos decorativos, logo, titular y "🌿 Guardería Sala Soles".
3. Crear `components/auth/login-form.tsx`: inputs email y contraseña, "¿Olvidaste tu contraseña?" como `<span>` sin acción, botón `Link` a `/`, pie con link a `/activate-account`.
4. Crear `app/(auth)/login/page.tsx`: `grid` 1.05fr/1fr (panel + formulario); en móvil el panel se oculta (corte `lg`).
5. Crear `components/auth/activate-form.tsx` (`"use client"`): logo gradiente, títulos, card de invitación (avatar `M`), inputs código/email/crear contraseña (borde `#F2A78E` en el de contraseña, como el template), checkbox de consentimiento toggle (default `invite.consentDefault`), botón `Link` a `/family-feed`, pie con link a `/login`.
6. Crear `app/(auth)/activate-account/page.tsx`: contenedor centrado `max-w-[440px]` que compone `ActivateForm`.
7. Verificación visual con Playwright contra `references/pantallas/login.dc.html` y `activar-cuenta.dc.html` (1280px y 390×844); 0 errores de consola; el sidebar "Cerrar sesión" ya apunta a `/login` (sin cambios).

## Criterios de aceptación

- [ ] `/login` carga sin errores de consola y muestra panel gradiente + formulario iguales al template (1280px).
- [ ] "Iniciar sesión" navega a `/`.
- [ ] "Activa tu cuenta" navega a `/activate-account`.
- [ ] "¿Olvidaste tu contraseña?" es texto sin acción (no navega).
- [ ] El código de invitación y el email salen de `data/mock/auth.ts` (sin datos hardcodeados en los componentes).
- [ ] `/activate-account` muestra card de invitación ("Mateo · Sala Soles", avatar `M` `#A9D9E8`), `7K4P9`, `lucia.fernandez@gmail.com` y los 3 inputs del template.
- [ ] El checkbox de consentimiento se puede marcar/desmarcar y arranca marcado.
- [ ] "Activar mi cuenta" navega a `/family-feed`; "Iniciar sesión" del pie navega a `/login`.
- [ ] Ninguna de las dos pantallas renderiza `Sidebar` ni `MobileHeader`.
- [ ] En móvil (390×844) ambas pantallas se ven sin desbordes y son usables.
- [ ] No hay `<a>` ni `onClick` de navegación: todos los enlaces usan `next/link`.

## Decisiones

- **Sí:** rutas `/login` y `/activate-account` bajo route group `(auth)` — patrón de rutas en inglés con texto en español (`/kids`, `/announcements`).
- **Sí:** sin selector de rol — eliminado tras decisión del usuario; el login navega siempre a `/`.
- **Sí:** sin gate de sesión — el SPEC 01 queda intacto; autenticación real va en otro spec.
- **Sí:** archivo nuevo `data/mock/auth.ts` — los mocks actuales no tienen datos de invitación.
- **Sí:** formularios sin validación real — fidelidad al template.
- **Sí:** "¿Olvidaste tu contraseña?" como `<span>` sin acción — el template no define destino.
- **Sí:** checkbox de consentimiento toggle funcional, marcado por defecto — el template lo muestra marcado.
- **Sí:** componentes nuevos solo en `components/auth/`; `"use client"` solo en `activate-form`.
- **Sí:** pantallas full-bleed sin sidebar/header — igual que el template.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Traducción de estilos inline a Tailwind diverge | Verificar contra las plantillas `.dc.html` con Playwright (no hay screenshots de estas pantallas). |
| Next 16 con breaking changes (AGENTS.md) | Leer `node_modules/next/dist/docs/` antes de codear páginas y `Link`. |
| Panel split roto en móvil | Definir corte `lg`: ocultar panel izquierdo en pantallas chicas. |
| `/family-feed` genera 404 al probar el botón | Documentado y aceptado en el alcance. |

## Qué NO está en este spec

- Autenticación real, sesiones y gate de rutas.
- Recuperación de contraseña.
- Pantalla `/family-feed` (familia) y activación real de cuentas.
- Validación de formularios o del código de invitación.
- Selector de rol (Personal/Familia) — eliminado tras decisión del usuario.
