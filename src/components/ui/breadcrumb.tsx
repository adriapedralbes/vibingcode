"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  className?: string;
  homeHref?: string;
  homeLabel?: string;
  separator?: React.ReactNode;
}

export function Breadcrumb({
  className,
  homeHref = "/",
  homeLabel = "Home",
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />
}: BreadcrumbProps) {
  const pathname = usePathname();
  
  // Skip rendering breadcrumbs on the home page
  if (pathname === "/") return null;
  
  // Generate breadcrumb items from the pathname
  const pathSegments = pathname
    .split("/")
    .filter(segment => segment !== "");
  
  const breadcrumbItems = [
    { href: homeHref, label: homeLabel },
    ...pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const label = segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      return { href, label };
    })
  ];

  return (
    <nav
      className={cn(
        "flex items-center text-sm text-muted-foreground",
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && <span className="mx-2">{separator}</span>}
              
              {index === 0 ? (
                <Link
                  href={item.href}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  <Home className="h-4 w-4 mr-1" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              ) : isLast ? (
                <span className="font-medium text-foreground">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
