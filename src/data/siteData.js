import { BiCog, BiHomeAlt, BiMoney, BiPlusCircle } from "react-icons/bi";

export const defaultCategories = [
  "food",
  "health",
  "insurance",
  "daily",
  "travel",
  "travel",
];

export const siteLinks = [
  { id: "#1", title: "Dashboard", icon: BiHomeAlt, link: "/dashboard" },
  {
    id: "#2",
    title: "Transections",
    icon: BiMoney,
    link: "/transections",
  },
  {
    id: "#3",
    title: "New transection",
    icon: BiPlusCircle,
    link: "/transections/create",
  },
  { id: "#4", title: "Settings", icon: BiCog, link: "/settings" },
];
