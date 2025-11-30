"use client";

import { Home, User, Briefcase, FileText } from "lucide-react";
import { NavBar } from "./NavbarImplementation";

export function NavBarPage() {
  const navItems = [
    { name: "Home", url: "#", icon: Home },
    { name: "About", url: "#", icon: User },
    { name: "Projects", url: "#", icon: Briefcase },
    { name: "Docs", url: "#", icon: FileText },
  ];

  return <NavBar items={navItems} />;
}
