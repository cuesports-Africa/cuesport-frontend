"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { mainNavItems } from "@/config/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "glass-dark shadow-lg shadow-black/20 py-2 border-b border-white/5"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between rounded-full bg-background/40 backdrop-blur-md border border-white/10 px-6 py-3 shadow-sm transition-all">
          {/* Logo */}
          <div className="flex items-center">
            <Logo variant="white" showTagline={false} />
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavigationMenuItem key={item.title}>
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger
                          className={cn(
                            "bg-transparent hover:bg-white/5 text-foreground/75 hover:text-electric transition-colors text-sm font-medium rounded-full px-4 h-10 data-[state=open]:bg-white/5 data-[state=open]:text-electric",
                            pathname.startsWith(item.href) &&
                            "text-electric font-semibold bg-white/5"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4" />}
                            {item.title}
                          </div>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="glass-dark grid w-[400px] gap-2 p-3 md:w-[500px] md:grid-cols-2 lg:w-[600px] rounded-2xl border border-white/10 shadow-xl">
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      "block select-none rounded-xl p-3 leading-none no-underline outline-none transition-all",
                                      "hover:bg-white/5 hover:text-electric focus:bg-white/5 border border-transparent hover:border-white/5",
                                      pathname === child.href &&
                                      "bg-white/5 text-electric border-white/5"
                                    )}
                                  >
                                    <div className="text-sm font-medium leading-none mb-1.5 flex items-center gap-2">
                                      {child.title}
                                    </div>
                                    {child.description && (
                                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                        {child.description}
                                      </p>
                                    )}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "bg-transparent hover:bg-white/5 text-foreground/80 hover:text-electric transition-colors text-sm font-medium rounded-full px-4 h-10",
                            pathname === item.href && "text-electric font-semibold bg-white/5 border border-white/5"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4" />}
                            {item.title}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side — CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2">
              <ThemeSwitcher />
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-medium text-foreground/80 hover:text-electric transition-colors rounded-full hover:bg-white/5"
              >
                Login
              </Link>
              <Link href="/register">
                <Button
                  className="bg-electric text-[#030e10] font-semibold hover:bg-electric/90 glow-cyan px-6 h-10 rounded-full text-sm transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center">
              <MobileNav />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
