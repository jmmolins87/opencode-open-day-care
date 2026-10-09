// Mock data for the feed page

export type PostKind = "achievement" | "activity" | "announcement";

export interface Post {
  id: string;
  kind: PostKind;
  author: string;
  authorInitial: string;
  time: string;
  audience: string;
  body: string;
  photo?: { src: string; caption: string };
  likes: number;
  comments: number;
  isMine: boolean;
}

export const posts: Post[] = [
  {
    id: "1",
    kind: "achievement",
    author: "Mateo",
    authorInitial: "M",
    time: "14:20",
    audience: "Para: familia de Mateo",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
    isMine: true,
  },
  {
    id: "2",
    kind: "activity",
    author: "Mateo",
    authorInitial: "M",
    time: "09:40",
    audience: "Para: familia de Mateo",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    photo: { src: "/foto-placeholder.jpg", caption: "Foto · pintando con témperas" },
    likes: 5,
    comments: 2,
    isMine: true,
  },
  {
    id: "3",
    kind: "announcement",
    author: "Anuncio general",
    authorInitial: "A",
    time: "07:50",
    audience: "Para: toda la sala",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
    isMine: true,
  },
];
