"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { mainNavItems, authNavItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isLoggedIn?: boolean;
}

export function MobileNav({ isLoggedIn = false }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="text-left">
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col h-[calc(100%-80px)]">
          <div className="flex-1 overflow-y-auto py-4">
            {mainNavItems.map((item) => (
              <div key={item.title} className="px-2">
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleExpand(item.title)}
                      className={cn(
                        "flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg transition-colors",
                        "hover:bg-secondary text-foreground"
                      )}
                    >
                      {item.title}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          expandedItems.includes(item.title) && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        expandedItems.includes(item.title)
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="pl-4 py-2 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          >
                            <span className="font-medium">{child.title}</span>
                            {child.description && (
                              <span className="block text-xs mt-0.5 opacity-70">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center px-4 py-3 text-base font-medium rounded-lg hover:bg-secondary transition-colors"
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="border-t p-4 space-y-2">
            {isLoggedIn ? (
              <Link href="/player" onClick={() => setOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
