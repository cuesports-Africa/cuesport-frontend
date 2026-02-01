"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  ArrowRight,
  Loader2,
  CheckCircle,
  Trophy,
  Users,
  Calendar,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const benefits = [
  {
    icon: Trophy,
    title: "Host Tournaments",
    description: "Create and manage pool tournaments of any size",
  },
  {
    icon: Users,
    title: "Build Community",
    description: "Bring players together and grow the local scene",
  },
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description: "Powerful tools to manage matches and brackets",
  },
  {
    icon: Shield,
    title: "Official Rankings",
    description: "Your tournaments contribute to player ratings",
  },
];

export default function BecomeOrganizerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [formData, setFormData] = useState({
    organization_name: "",
    description: "",
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/auth/signin?redirect=/auth/become-organizer");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.organization_name.trim()) {
      setError("Organization name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizer/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register as organizer");
      }

      // Update stored user data
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess(true);

      setTimeout(() => {
        router.push("/organizer");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome, Organizer!
          </h1>
          <p className="text-muted-foreground">
            You can now create and manage tournaments from your dashboard.
            <br />
            Redirecting...
          </p>
        </div>
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
          <Building2 className="h-8 w-8 text-gold" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">Become an Organizer</h1>
        <p className="text-muted-foreground">
          Start hosting pool tournaments and grow your community
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-4">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="p-4 rounded-xl bg-muted/50 border"
          >
            <benefit.icon className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-medium text-sm">{benefit.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Organization Name */}
        <div className="space-y-2">
          <Label htmlFor="organization_name">Organization Name *</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="organization_name"
              name="organization_name"
              placeholder="e.g., Kutus Pool Club"
              value={formData.organization_name}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This will be displayed on all your tournaments
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Tell players about your organization..."
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              Become an Organizer
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Info Box */}
      <div className="bg-primary/5 rounded-lg p-4 text-sm">
        <p className="font-medium text-foreground mb-2">What happens next?</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>• You'll keep your player account</li>
          <li>• Start creating tournaments immediately</li>
          <li>• Your contact info is your registered phone & email</li>
          <li>• Upgrade to API access anytime for integrations</li>
        </ul>
      </div>

      {/* Back Link */}
      <div className="text-center text-sm text-muted-foreground">
        Changed your mind?{" "}
        <Link href="/player" className="text-primary hover:underline font-medium">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
