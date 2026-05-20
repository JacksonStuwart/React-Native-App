import {
  Utensils,
  Car,
  Receipt,
  ShoppingBag,
  Popcorn,
  HeartPulse,
  GraduationCap,
  Plane,
  MoreHorizontal,
  Tag,
  Home,
  Coffee,
  Gift,
  Briefcase,
  Music,
  Book,
  Dumbbell,
  Fuel,
  PawPrint,
  Wifi,
  CreditCard,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Utensils,
  Car,
  Receipt,
  ShoppingBag,
  Popcorn,
  HeartPulse,
  GraduationCap,
  Plane,
  MoreHorizontal,
  Tag,
  Home,
  Coffee,
  Gift,
  Briefcase,
  Music,
  Book,
  Dumbbell,
  Fuel,
  PawPrint,
  Wifi,
  CreditCard,
  Smartphone,
};

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS);

export function getCategoryIcon(name: string | undefined): LucideIcon {
  return (name && CATEGORY_ICONS[name]) || Tag;
}
