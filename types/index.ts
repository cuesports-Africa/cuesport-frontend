export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: any;
  children?: NavItem[];
  isExternal?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  isPlayer: boolean;
  isOrganizer: boolean;
}
