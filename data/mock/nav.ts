// Navigation items for the sidebar

export interface NavItem {
  label: string;
  href: string;
  icon: string; // name of the icon component in icons.tsx
}

export const navItems: NavItem[] = [
  { label: "Feed", href: "/", icon: "home" },
  { label: "Niños", href: "/ninos", icon: "children" },
  { label: "Avisos", href: "/avisos", icon: "bell" },
  { label: "Mi cuenta", href: "/mi-cuenta", icon: "user" },
];
