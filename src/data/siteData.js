import { BsCash, BsGear, BsPieChart, BsPlusSquare } from "react-icons/bs";

export const defaultCategories = [
  "food",
  "health",
  "insurance",
  "daily",
  "travel",
  "travel",
];

export const siteLinks = [
  { id: "#1", title: "Analytics", icon: BsPieChart, link: "/" },
  {
    id: "#2",
    title: "Transections",
    icon: BsCash,
    link: "/transections",
  },
  {
    id: "#3",
    title: "New transection",
    icon: BsPlusSquare,
    link: "/transections/create",
  },
  { id: "#4", title: "Settings", icon: BsGear, link: "/settings" },
];
