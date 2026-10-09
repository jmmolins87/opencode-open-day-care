// Navigation items for the sidebar

export interface NavItem {
  label: string;
  href: string;
  icon: string; // name of the icon component in icons.tsx
}

export const navItems: NavItem[] = [
  { label: "Feed", href: "/", icon: "home" },
  { label: "Niños", href: "/kids", icon: "children" },
  { label: "Avisos", href: "/announcements", icon: "bell" },
  { label: "Mi cuenta", href: "/my-account", icon: "user" },
];
