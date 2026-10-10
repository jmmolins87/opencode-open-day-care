# SPEC 06 — Modal "Crear publicación" desde el sidebar

> **Estado:** Implemented
> **Depende de:** SPEC 01
> **Fecha:** 2026-10-10
> **Objetivo:** Implementar `references/pantallas/crear-publicacion.dc.html` como modal abierta desde el botón del sidebar (y el composer del feed) que crea una publicación en memoria con tipo, audiencia, descripción y fotos con drag & drop.

## Alcance

**Incluye:**

- Botón "Nueva publicación" del sidebar: en `/` abre la modal sin navegar; en el resto de rutas (`/kids`, `/kids/[id]`) navega a `/?create=1` y la modal se abre automáticamente al llegar (la URL se limpia a `/`).
- Composer "Comparte un momento…" de `/` (hoy `<Link href="/create-post">`) pasa a `<button>` que abre la misma modal.
- Modal fiel al recurso: header `Cancelar | Nueva publicación | Publicar`; sección PARA (chips con avatar/inicial y nombre de pila de los 8 niños del mock + "Toda la sala", Mateo preseleccionado, selección simple); sección TIPO (7 chips: Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio, Comida preseleccionado); textarea DESCRIPCIÓN (placeholder "Contá cómo le fue hoy…"); zona FOTOS con "Agregar".
- Fotos: drop sobre la zona FOTOS o clic en "Agregar" (selector de archivos oculto `accept="image/*" multiple`), previsualización 96×96, máximo 5, X para quitar cada una, `URL.createObjectURL` sin subida real; revocar URLs al quitar y al cerrar.
- Validación: "Publicar" deshabilitado hasta descripción no vacía (el tipo siempre tiene valor por defecto); sin mensajes de error.
- Cierre con Cancelar, Esc y click en el fondo; scroll lock; formulario siempre limpio al reabrir (Comida + Mateo, sin texto ni fotos).
- Al publicar: el post aparece **primero** en el feed con `time: "Ahora"`, `isMine: true`, `likes: 0`, `comments: 0`, audience `Para: familia de {nombre}` o `Para: toda la sala`, y las fotos renderizadas como `<img>` en la card. Se pierde al recargar.
- `PostKind` ampliado a los 7 tipos con badge (COMIDA, SIESTA, ÁNIMO, FOTO nuevos) y tokens en `globals.css`; `PostList` pasa a recibir `posts` por props.
- Estado del feed en un nuevo wrapper client `components/home/feed-content.tsx` (patrón `kids-page-content.tsx`).

**Fuera de alcance (specs futuros):**

- El enlace "Editar" de cada post (`post-card.tsx:95`) sigue apuntando a `/create-post` (404 aceptado); la edición real va en otro spec.
- Persistencia, API o BD: todo en memoria, se pierde al recargar.
- Selección múltiple de audiencia.
- Subida real de imágenes, recorte, compresión o galería de fotos existentes.
- Detalle de publicación (`/post-detail`), likes reales y comentarios.
- Ruta `/create-post` (no se crea).

## Modelo de datos

```ts
// data/mock/posts.ts — ampliación
export type PostKind =
  | "meal" | "nap" | "activity" | "achievement"
  | "mood" | "photo" | "announcement";

export interface Post {
  // …campos actuales
  photos?: string[];   // object URLs en memoria; solo posts creados en runtime
}

// components/home/new-post-modal.tsx — valores del formulario
export interface NewPostFormValues {
  kind: PostKind;
  kidId: number | null;   // null + toRoom = "Toda la sala"
  toRoom: boolean;
  body: string;
  photos: string[];
}

// feed-content.tsx — al publicar
const newPost: Post = {
  id: String(Math.max(...list.map((p) => Number(p.id)), 0) + 1),
  kind: form.kind,
  author: user.name.split(" ")[0],      // "Caro"
  authorInitial: user.initial,          // "C"
  time: "Ahora",
  audience: form.toRoom ? "Para: toda la sala" : `Para: familia de ${kid.name.split(" ")[0]}`,
  body: form.body.trim(),
  photos: form.photos.length ? form.photos : undefined,
  likes: 0,
  comments: 0,
  isMine: true,
};
```

`photo?: { src, caption }` se mantiene intacto (lo usan los 2 posts mock con foto). Tokens nuevos en `globals.css`: `badge-meal-bg/fg` `#F7E7A6/#9A7B1E`, `badge-nap-bg/fg` `#E7DCF6/#7B5FC0`, `badge-mood-bg/fg` `#F9D2DE/#C56486`, `badge-photo-bg/fg` `#FBD8CC/#D9684A`.

## Plan de implementación

1. `data/mock/posts.ts` (`PostKind` + `photos?`), `app/globals.css` (4 pares de tokens) y `badgeStyles` en `post-card.tsx` (7 entradas). `tsc` sin errores; feed visualmente igual.
2. `post-card.tsx`: `PostList({ posts })` recibe props (se elimina el import del array mock); render de `post.photos` con `<img>` simples. `app/page.tsx` le pasa `posts` mock. Feed igual.
3. `components/home/new-post-modal.tsx` (`"use client"`): overlay + card `max-w-[580px]` fiel al recurso; estado `kind`/`kidId`/`toRoom`/`body`/`photos`; chips, textarea, zona FOTOS con drag & drop (`onDragOver`/`onDrop` + highlight, `e.dataTransfer.files`, cap 5, revocar URLs); `canPublish`; Esc + backdrop + scroll lock. Props: `onClose`, `onSave(values)`.
4. `components/home/feed-content.tsx` (`"use client"`): MobileHeader + Sidebar + main; estados `postList` y `open`; en mount lee `window.location.search` para `?create=1` (sin `useSearchParams`, evita Suspense), abre y limpia la URL con `router.replace("/")`; composer como `<button>`; `handleSave` prepende el post y cierra. `app/page.tsx` delega en `<FeedContent />`. Verificar creación en `/`.
5. `sidebar.tsx` (`"use client"`): prop `onNewPost?: () => void`; con prop → `<button onClick>`, sin prop → `<Link href="/?create=1">`. `mobile-header.tsx`: prop `onNewPost` que se pasa al `<Sidebar>` del drawer. Verificar `/`, `/kids` (navega y autoabre) y drawer móvil.
6. Verificación Playwright contra `references/pantallas/crear-publicacion.dc.html` a 1280px y 390×844; 0 errores de consola.

## Criterios de aceptación

- [x] En `/`, "Nueva publicación" (sidebar) abre la modal sin navegar; la URL no cambia.
- [x] En `/kids` y `/kids/[id]`, el botón navega a `/?create=1`, la modal se abre sola al llegar y la URL queda en `/`.
- [x] El composer "Comparte un momento…" de `/` abre la misma modal; el "Editar" de los posts sigue enlazando a `/create-post`.
- [x] La modal muestra header (Cancelar / Nueva publicación / Publicar), 9 chips PARA (8 niños + Toda la sala, Mateo activo), 7 chips TIPO (Comida activo), textarea con placeholder y zona FOTOS con "Agregar".
- [x] Cambiar de niño o "Toda la sala" deja solo ese chip activo (activo: fondo `#3F362E`, texto blanco; inactivo: fondo `#FFFDF9`, borde `#ECE0D0`); cambiar de tipo deja solo ese con su color sólido del recurso.
- [x] "Publicar" está deshabilitado con descripción vacía y se habilita con texto no vacío.
- [x] Esc, click en el fondo y Cancelar cierran la modal; con ella abierta el body no scrollea.
- [x] Soltar 1+ imágenes sobre la zona FOTOS o pulsar "Agregar" añade previews 96×96 (máx. 5); la X de cada preview la elimina y libera hueco.
- [x] Publicando Mateo + Comida + texto: el modal se cierra y el post aparece primero con badge COMIDA, "Para: familia de Mateo", "Ahora · publicado por vos", 0 likes y 0 comentarios.
- [x] Publicando "Toda la sala" + Anuncio: audience "Para: toda la sala" y badge ANUNCIO; con fotos, la card muestra las imágenes.
- [x] Recargar `/` pierde los posts nuevos; los 3 mock siguen intactos con sus badges LOGRO/ACTIVIDAD/ANUNCIO.
- [x] Reabrir tras publicar o cancelar muestra el formulario limpio (Comida, Mateo, sin texto ni fotos).
- [x] Sin desbordes ni errores de consola a 1280px y 390×844; sin `<a>` literales; nombres de código en inglés.

## Decisiones

- **Sí:** wrapper client `feed-content.tsx` que renderiza Sidebar/MobileHeader — el botón del sidebar necesita el callback del estado; patrón `kids-page-content.tsx`.
- **Sí:** en otras rutas el botón navega a `/?create=1` y la modal se autoabre — elegido sobre provider global en layout (menos invasivo).
- **Sí:** leer el query con `window.location.search` en un effect — `useSearchParams` exige Suspense en Next 16.
- **Sí:** `Sidebar` con `"use client"` y `onNewPost?` opcional — sin la prop mantiene el `<Link>` (hoy a `/create-post`, pasa a `/?create=1`); props serializables, no rompe `/kids`.
- **Sí:** composer del feed abre la modal; "Editar" intocado — decisión del usuario.
- **Sí:** `PostKind` ampliado a 7 con nombres en inglés (`meal`, `nap`, `mood`, `photo`) y badges en español — `Record<PostKind, …>` obliga a definir los 4 nuevos.
- **Sí:** selección simple de audiencia (Mateo por defecto) — `audience` es un string singular en el modelo.
- **Sí:** `photos?: string[]` junto a `photo` — los mock existentes no cambian; el render con `<img>` plano evita `next/image` con `blob:`.
- **Sí:** chips TIPO sin seleccionar con estilo neutro (`#FFFDF9`/`#ECE0D0`) — el recurso solo muestra el estado activo; coherente con los chips PARA.
- **Sí:** descripción obligatoria, tipo con default "Comida", fotos opcionales, "Publicar" deshabilitado sin errores rojos — como SPEC 04/05.
- **Sí:** `time: "Ahora"` y autor = usuario logueado ("Caro") — coherente con `isMine` del mock.
- **No:** selección múltiple, subida real, persistencia, ruta `/create-post`, edición, provider global de estado.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `blob:` con `next/image` rompe previews | `<img>` plano para las fotos en memoria |
| `useSearchParams` exige Suspense | `window.location.search` en `useEffect` de mount |
| `Sidebar` pasa a client y se usa en `/kids` | props primitivas; verificar `/kids` + drawer móvil 390×844 |
| Fuga de object URLs | `revokeObjectURL` al quitar foto y al desmontar la modal |
| Fidelidad vs recurso | Playwright a 1280px y 390×844 contra `crear-publicacion.dc.html` |

## Qué NO está en este spec

- "Editar" publicaciones y ruta `/create-post` (sigue en 404).
- Persistencia / API / BD (se pierde al recargar).
- Selección múltiple de audiencia y subida real de imágenes.
- Detalle de post, likes y comentarios reales.
