import {
  Mail,
  House,
  User,
  Briefcase,
  GraduationCap,
  Heart,
  Link,
  MessageCircleCode,
  Phone,
  Pickaxe,
  Hammer,
  FolderCode,
} from "@lucide/astro";

// Social media icon components
import GitHub from "../components/icons/GitHub.astro";
import LinkedIn from "../components/icons/LinkedIn.astro";
import Twitter from "../components/icons/Twitter.astro";
import Bluesky from "../components/icons/Bluesky.astro";
import Instagram from "../components/icons/Instagram.astro";
import YouTube from "../components/icons/YouTube.astro";

export type IconName =
  | "Mail"
  | "Home"
  | "User"
  | "Briefcase"
  | "GraduationCap"
  | "Heart"
  | "Link"
  | "MessageCircleCode"
  | "Phone"
  | "Pickaxe"
  | "Hammer"
  | "FolderCode"
  | "GitHub"
  | "LinkedIn"
  | "Twitter"
  | "Bluesky"
  | "Instagram"
  | "YouTube"
  | "Email";

export const iconMap: Record<IconName, any> = {
  Mail,
  Home: House,
  User,
  Briefcase,
  GraduationCap,
  Heart,
  Link,
  MessageCircleCode,
  Phone,
  Pickaxe,
  Hammer,
  FolderCode,
  GitHub,
  LinkedIn,
  Twitter,
  Bluesky,
  Instagram,
  YouTube,
  Email: Mail,
};

export function getIcon(iconName: string) {
  return (iconMap as Record<string, unknown>)[iconName] ?? iconMap.Link;
}
