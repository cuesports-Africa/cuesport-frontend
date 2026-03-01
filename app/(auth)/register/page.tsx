"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/logo";

export default function RegisterPage() {
    return (
        <>
            <div className="flex justify-center mb-8">
                <div className="inline-block transition-transform hover:scale-105">
                    <Logo variant="white" showTagline={false} size="lg" />
                </div>
            </div>

            <div className="card-dark rounded-3xl p-8 shadow-2xl border border-border/20 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric to-transparent opacity-50" />

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Create an Account</h2>
                    <p className="text-sm text-muted-foreground">
                        Join the premier pool and snooker platform in Africa.
                    </p>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                className="search-input-dark pl-10 h-12 rounded-xl border-border/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="search-input-dark pl-10 h-12 rounded-xl border-border/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                required
                                className="search-input-dark pl-10 h-12 rounded-xl border-border/20"
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground">Must be at least 8 characters long.</p>
                    </div>

                    <Button type="submit" className="w-full h-12 rounded-xl bg-electric hover:bg-electric/90 text-[#030e10] font-bold text-base glow-cyan transition-all mt-6">
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-electric hover:underline transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </div>
        </>
    );
}
