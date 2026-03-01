"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, ArrowRight, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { mainNavItems } from "@/config/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const pathname = usePathname();

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="flex items-center gap-2">
      <ThemeSwitcher />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:text-electric hover:bg-white/10 rounded-full transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] sm:w-[360px] p-0 flex flex-col"
          style={{
            background: "rgba(3, 14, 16, 0.98)",
            backdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(0, 191, 191, 0.15)",
          }}
        >
          <SheetHeader
            style={{ borderBottom: "1px solid rgba(0, 191, 191, 0.1)" }}
            className="px-6 py-5 flex-shrink-0"
          >
            <SheetTitle className="text-left flex items-center justify-between">
              <Logo variant="white" />
            </SheetTitle>
          </SheetHeader>

          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 relative">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <div key={item.title}>
                  {item.children ? (
                    <div className="mb-2">
                      <button
                        onClick={() => toggleExpand(item.title)}
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-3.5 text-sm font-semibold rounded-xl transition-all",
                          "text-foreground/80 hover:text-electric hover:bg-white/5",
                          isActive && "text-electric bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {Icon && <Icon className="h-5 w-5 opacity-80" />}
                          {item.title}
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-300 text-muted-foreground",
                            expandedItems.includes(item.title) && "rotate-180 text-electric"
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300",
                          expandedItems.includes(item.title)
                            ? "max-h-96 opacity-100 mt-1"
                            : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="pl-4 py-2 space-y-1 relative before:absolute before:left-[21px] before:top-0 before:bottom-0 before:w-[1px] before:bg-white/5">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "block px-5 py-3 rounded-xl text-sm transition-all ml-4",
                                pathname === child.href ? "text-electric bg-white/5 font-semibold" : "text-muted-foreground hover:text-electric hover:bg-white/5"
                              )}
                            >
                              <span className="block">{child.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all mb-2",
                        isActive ? "bg-electric/10 text-electric glow-text" : "hover:bg-white/5 text-foreground/80 hover:text-electric"
                      )}
                    >
                      {Icon && <Icon className={cn("h-5 w-5", isActive ? "text-electric" : "text-muted-foreground opacity-80")} />}
                      {item.title}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action Bottom */}
          <div
            className="p-6 flex-shrink-0 bg-background/50 backdrop-blur-md"
            style={{ borderTop: "1px solid rgba(0, 191, 191, 0.1)" }}
          >
            <div className="grid gap-3">
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button className="w-full bg-electric text-[#030e10] font-semibold hover:bg-electric/90 glow-cyan rounded-full h-12 text-sm shadow-lg shadow-electric/20">
                  Sign Up Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full h-12 rounded-full text-sm font-semibold transition-all hover:bg-white/5 border border-white/10"
              >
                <UserCircle className="h-4 w-4" />
                Login to Account
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
