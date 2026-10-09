// Mock data for the login and activate-account pages

export type LoginRole = "staff" | "parent";

export interface DemoAccount {
  role: LoginRole;
  email: string;
  homeHref: string;
}

export const demoAccounts: Record<LoginRole, DemoAccount> = {
  staff: { role: "staff", email: "caro@opendaycare.com", homeHref: "/" },
  parent: {
    role: "parent",
    email: "lucia.fernandez@gmail.com",
    homeHref: "/family-feed",
  },
};

export interface Invite {
  code: string;
  email: string;
  kidName: string;
  kidInitial: string;
  room: string;
  avatarBg: string;
  avatarText: string;
  consentDefault: boolean;
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
