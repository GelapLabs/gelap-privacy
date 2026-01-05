"use client";

import { usePathname } from "next/navigation";
import { NavBarPage } from "@/src/components/Element/Navbar/Navbar";
import { Footer } from "@/src/components/Element/Footer/Footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = pathname?.startsWith("/app");

  return (
    <>
      {!isAppRoute && <NavBarPage />}
      {children}
      {!isAppRoute && <Footer />}
    </>
  );
}
