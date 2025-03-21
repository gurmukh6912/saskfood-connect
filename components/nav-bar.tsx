"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, ChevronLeft } from "lucide-react";

export function NavBar() {
  const pathname = usePathname();

  // Don't show navigation on home page
  if (pathname === "/") return null;

  const getTitle = () => {
    switch (pathname) {
      case "/customer":
        return "Customer Dashboard";
      case "/driver":
        return "Driver Dashboard";
      case "/restaurant":
        return "Restaurant Dashboard";
      default:
        if (pathname.startsWith("/customer/")) return "Restaurant Menu";
        return "SaskFood Connect";
    }
  };

  return (
    <div className="border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            {pathname !== "/" && pathname.includes("/") && (
              // <Link href={/'}>
                <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              // </Link>
            )}
            <h2 className="text-xl font-semibold">{getTitle()}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}