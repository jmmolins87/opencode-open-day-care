# SPEC 01 — Home / Feed (OpenDayCare)

> **Estado:** Approved
> **Depende de:** —
> **Fecha:** 2026-10-09
> **Objetivo:** Implementar la plantilla `references/pantallas/feed.dc.html` como página de inicio `/`, con mock data, navegación con `next/link`, estilo idéntico al template y responsive.

## Alcance

**Incluye:**

- Página de inicio `/` que reemplaza el boilerplate de `app/page.tsx` con el feed.
- Mock data ficticia en `data/mock/` (publicaciones, usuario, navegación).
- Sidebar de navegación idéntico al template: logo, botón "Nueva publicación", nav (Feed / Niños / Avisos / Mi cuenta) y tarjeta de usuario "Caro Giménez".
- Encabezado del feed ("GUARDERÍA · SALA SOLES", "Buenas, Caro", "12 niños · martes 17 jun").
- Composer "Compartí un momento…" y tres publicaciones estáticas (logro, actividad con foto, anuncio).
- Navegación con `next/link` (los enlaces no hacen nada hoy: apuntan a rutas futuras).
- Responsive: sidebar fijo en escritorio, colapsa a menú hamburguesa (drawer) en móvil.
- Tipografías Fredoka + Nunito con `next/font/google`.
- Fidelidad de colores, radios, sombras y estados del template, con Tailwind v4 y tokens en `@theme`.

**Fuera de alcance (specs futuros):**

- Autenticación / login real y base de datos o API.
- Implementar las páginas destino (Niños, Avisos, Mi cuenta, Nueva publicación, Detalle publicación, Foto, Login). Los `Link` apuntarán a rutas aún no existentes (404 hasta sus specs).
- Comportamiento funcional de botones/enlaces: publicar, editar, likes, comentarios y foto (solo navegación visual sin lógica).

## Modelo de datos

Sin base de datos. Mock data estática en TypeScript dentro de `data/mock/`:

```ts
// data/mock/posts.ts
type PostKind = "achievement" | "activity" | "announcement";

interface Post {
  id: string;
  kind: PostKind;
  author: string;        // "Mateo" | "Anuncio general"
  authorInitial: string; // "M"
  time: string;          // "14:20"
  audience: string;      // "Para: familia de Mateo"
  body: string;
  photo?: { src: string; caption: string };
  likes: number;
  comments: number;
  isMine: boolean;
}

// data/mock/user.ts
interface User {
  name: string;    // "Caro Giménez"
  role: string;    // "Maestra"
  room: string;    // "Soles"
  initial: string; // "C"
}

// data/mock/nav.ts
interface NavItem {
  label: string;   // e.g. "Feed"
  href: string;    // e.g. "/" o "/ninos"
  icon: string;    // nombre del icono en icons.tsx
}
```

Los archivos exportarán arreglos con los datos correspondientes (3 posts, 1 usuario, 4 ítems de navegación).

## Plan de implementación

1. Crear `data/mock/` con `posts.ts`, `user.ts` y `nav.ts` (datos ficticios tipados).
2. Configurar tipografías y tokens: en `app/layout.tsx` cargar Fredoka + Nunito con `next/font/google` y `title` "OpenDayCare"; en `app/globals.css` reemplazar el tema por defecto con tokens de color/paleta en `@theme`.
3. Crear `components/shared/icons.tsx` con los iconos SVG inline usados.
4. Crear `components/shared/sidebar.tsx` (prop `active`), reutilizable como panel estático de escritorio y contenido del drawer móvil.
5. Crear `components/shared/mobile-header.tsx` (topbar con hamburguesa que abre/cierra el drawer).
6. Crear `components/home/post-card.tsx` que tipa y renderiza un `Post`, mapeando la lista de `data/mock/posts`.
7. Reescribir `app/page.tsx`: `mobile-header` (móvil) + `sidebar` (escritorio) + encabezado + composer + posts. Todos los enlaces con `next/link`.
8. Implementar drawer responsive (estado open/close, overlay, cierre) con Tailwind.
9. Verificar visualmente contra `references/screenshots/feed.png` y `feed2.png` (escritorio) y comportamiento del drawer en móvil.

## Criterios de aceptación

- [ ] `npm run dev` abre sin errores de consola en http://localhost:3000.
- [ ] `/` muestra sidebar, encabezado, composer y tres publicaciones iguales al template.
- [ ] Las publicaciones se leen desde `data/mock/posts.ts` (sin datos hardcodeados en `page.tsx`).
- [ ] Tipografías Fredoka y Nunito visibles (self‑hosted).
- [ ] El estado activo resalta "Feed" (fondo `#FBE3D8`, texto `#D9583C`).
- [ ] Cada post muestra su badge correcto (LOGRO verde, ACTIVIDAD azul, ANUNCIO violeta).
- [ ] El post de actividad muestra el placeholder de foto.
- [ ] Todos los enlaces y botones usan `next/link` y no ejecutan lógica.
- [ ] En móvil el sidebar queda oculto y se abre con un botón hamburguesa (drawer con overlay), y se cierra correctamente.
- [ ] Colores, tarjetas, radios y sombras coinciden con los screenshots de referencia.

## Decisiones

- **Sí:** mock data en `data/mock/` frente a hardcodear en `page.tsx` — datos desacoplados de la vista.
- **Sí:** `next/link` para todos los enlaces (aunque las rutas no existan) frente a `<a>` — navegación SPA y menos trabajo al implementar las páginas.
- **Sí:** drawer hamburguesa para responsive frente a ocultar el sidebar o bottom nav — reutiliza el mismo componente sidebar.
- **Sí:** Tailwind v4 frente a estilos inline — reutiliza la infraestructura existente y tokens de diseño.
- **Sí:** `next/font/google` frente a `<link>` — self‑hosted y sin dependencia de Google en runtime.
- **Sí:** componentes reutilizables (`components/shared/` para iconos, sidebar y mobile‑header; `components/home/` para post‑card).
- **Sí:** estados del spec en español (`Borrador`/`Aprobado`).

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Next 16 tiene APIs con breaking changes (AGENTS.md) | Leer `node_modules/next/dist/docs/` antes de codear (fonts, Metadata, Link). |
| Traducción de ~100 estilos inline a Tailwind puede divergir | Verificar contra `references/screenshots/feed*.png`. |
| Enlaces a rutas no implementadas generan 404 | Documentado y aceptado en el alcance. |
| El template no define breakpoints responsive | Se decide `lg` como corte de escritorio→móvil. |

## Qué NO está en este spec

- Autenticación y base de datos.
- Las páginas destino (Niños, Avisos, Mi cuenta, etc.).
- Lógica funcional de botones (publicar, editar, likes, comentarios, foto).

Cada una de esas, si llega, tendrá su propio spec.
