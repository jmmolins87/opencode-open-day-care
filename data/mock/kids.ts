// Mock data for the kids list and kid profile pages

export type AlertKind = "peanut" | "lactose" | "gluten" | "egg" | "tree-nuts";

export const alertStyles: Record<AlertKind, { label: string; bg: string; text: string }> = {
  peanut: { label: "MANÍ", bg: "#FBD8CC", text: "#D9684A" },
  lactose: { label: "LACTOSA", bg: "#C7E7F1", text: "#2E89A6" },
  gluten: { label: "GLUTEN", bg: "#F7E7A6", text: "#9A7B1E" },
  egg: { label: "HUEVO", bg: "#CFEBD8", text: "#3E9B6C" },
  "tree-nuts": { label: "FRUTOS SECOS", bg: "#CCD8F4", text: "#4E72C8" },
};

export type ParentStatus = "active" | "pending";

export interface KidParent {
  id: number;
  name: string;
  relation: string;
  initial: string;
  avatarColor: string;
  status: ParentStatus;
}

export interface Kid {
  id: number;
  name: string;
  initial: string;
  avatarColor: string;
  avatarText: string;
  age: string;
  birthDate: string;
  room: string;
  joined: string;
  alerts: AlertKind[];
  notes?: string;
  parents: KidParent[];
}

export const rooms = ["Soles"] as const;

export const kids: Kid[] = [
  {
    id: 1,
    name: "Mateo Fernández",
    initial: "M",
    avatarColor: "#A9D9E8",
    avatarText: "#1F7A93",
    age: "3 años",
    birthDate: "12 mar 2022",
    room: "Soles",
    joined: "feb 2025",
    alerts: ["peanut"],
    notes: "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    parents: [
      { id: 1, name: "Lucía Fernández", relation: "Mamá", initial: "L", avatarColor: "#C9B6E8", status: "active" },
      { id: 2, name: "Diego Fernández", relation: "Papá", initial: "D", avatarColor: "#A9C7E8", status: "pending" },
    ],
  },
  {
    id: 2,
    name: "Sofía Méndez",
    initial: "S",
    avatarColor: "#F4B8CC",
    avatarText: "#C44A7A",
    age: "2 años",
    birthDate: "05 ago 2023",
    room: "Soles",
    joined: "mar 2025",
    alerts: [],
    parents: [
      { id: 3, name: "Paula Méndez", relation: "Mamá", initial: "P", avatarColor: "#F2937A", status: "active" },
    ],
  },
  {
    id: 3,
    name: "Benjamín Ruiz",
    initial: "B",
    avatarColor: "#B9DEC4",
    avatarText: "#3E8B62",
    age: "3 años",
    birthDate: "21 ene 2022",
    room: "Soles",
    joined: "ene 2025",
    alerts: [],
    parents: [
      { id: 4, name: "Carla Ruiz", relation: "Mamá", initial: "C", avatarColor: "#C9B6E8", status: "active" },
      { id: 5, name: "Martín Ruiz", relation: "Papá", initial: "M", avatarColor: "#A9C7E8", status: "active" },
    ],
  },
  {
    id: 4,
    name: "Valentina Soto",
    initial: "V",
    avatarColor: "#F4DC8E",
    avatarText: "#9A7B1E",
    age: "2 años",
    birthDate: "14 nov 2023",
    room: "Soles",
    joined: "abr 2025",
    alerts: [],
    parents: [],
  },
  {
    id: 5,
    name: "Tomás Díaz",
    initial: "T",
    avatarColor: "#C9B6E8",
    avatarText: "#7B5FC0",
    age: "3 años",
    birthDate: "02 jun 2022",
    room: "Soles",
    joined: "feb 2025",
    alerts: ["lactose"],
    parents: [
      { id: 6, name: "Ana Díaz", relation: "Mamá", initial: "A", avatarColor: "#F4B8CC", status: "active" },
    ],
  },
  {
    id: 6,
    name: "Emma Castro",
    initial: "E",
    avatarColor: "#F4B8CC",
    avatarText: "#C44A7A",
    age: "2 años",
    birthDate: "30 abr 2023",
    room: "Soles",
    joined: "may 2025",
    alerts: ["egg"],
    parents: [
      { id: 7, name: "Rocío Castro", relation: "Mamá", initial: "R", avatarColor: "#C9B6E8", status: "active" },
    ],
  },
  {
    id: 7,
    name: "Lucas Romero",
    initial: "L",
    avatarColor: "#A9D9E8",
    avatarText: "#1F7A93",
    age: "3 años",
    birthDate: "18 sep 2022",
    room: "Soles",
    joined: "ene 2025",
    alerts: ["gluten"],
    parents: [
      { id: 8, name: "Sofía Romero", relation: "Mamá", initial: "S", avatarColor: "#A9C7E8", status: "active" },
    ],
  },
  {
    id: 8,
    name: "Olivia Vega",
    initial: "O",
    avatarColor: "#B9DEC4",
    avatarText: "#3E8B62",
    age: "2 años",
    birthDate: "07 jul 2023",
    room: "Soles",
    joined: "jul 2025",
    alerts: ["tree-nuts"],
    parents: [
      { id: 9, name: "Mariana Vega", relation: "Mamá", initial: "M", avatarColor: "#F2937A", status: "active" },
    ],
  },
];

export function getKidById(id: number): Kid | undefined {
  return kids.find((kid) => kid.id === id);
}
