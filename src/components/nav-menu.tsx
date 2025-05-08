
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export function NavMenu() {
  const pathname = usePathname();
  
  // Determine if we're on a specific page
  const isDocumentationPage = pathname === "/documentation";
  const isActionPlanPage = pathname === "/action-plan";
  const isHomePage = pathname === "/";

  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
      {/* Landing page section links - only show on home page */}
      {isHomePage && siteConfig.nav.links.slice(0, 4).map((item) => (
        <a
          key={item.id}
          href={item.href}
          className={cn(
            "text-muted-foreground transition-colors hover:text-foreground",
            item.href.startsWith("#") && "cursor-pointer"
          )}
          onClick={(e) => {
            if (item.href.startsWith("#")) {
              e.preventDefault();
              const element = document.getElementById(item.href.substring(1));
              element?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          {item.name}
        </a>
      ))}
      
      {/* Documentation page link */}
      <Link
        href="/documentation"
        className={cn(
          "transition-colors hover:text-foreground",
          isDocumentationPage ? "text-foreground font-semibold" : "text-muted-foreground"
        )}
      >
        Documentation
      </Link>
      
      {/* Action Plan page link */}
      <Link
        href="/action-plan"
        className={cn(
          "transition-colors hover:text-foreground",
          isActionPlanPage ? "text-foreground font-semibold" : "text-muted-foreground"
        )}
      >
        Action Plan
      </Link>
    </nav>
  );
}

