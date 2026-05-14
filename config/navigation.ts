import { NavItem } from "@/types";
import { Trophy, TrendingUp, Newspaper, BookOpen } from "lucide-react";

export const mainNavItems: NavItem[] = [
  {
    title: "Tournaments",
    href: "/tournaments",
    icon: Trophy,
  },
  {
    title: "Rankings",
    href: "/rankings",
    icon: TrendingUp,
  },
  {
    title: "News",
    href: "/news",
    icon: Newspaper,
  },
  {
    title: "Rules",
    href: "/rules",
    icon: BookOpen,
  },
];

