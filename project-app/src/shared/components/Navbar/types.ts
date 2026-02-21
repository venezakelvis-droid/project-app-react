export interface NavItem {
  label: string;
  path: string;
}

export interface NavbarProps {
  logo?: string;
  items: NavItem[];
}