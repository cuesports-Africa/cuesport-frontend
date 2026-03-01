"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "info@cuesports.africa",
    href: "mailto:info@cuesports.africa",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+254 700 000 000",
    href: "tel:+254700000000",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Nairobi, Kenya",
    href: null,
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Mon - Sat, 8am - 6pm EAT",
    href: null,
  },
];

const topics = [
  "General Inquiry",
  "Organizer Account",
  "Technical Support",
  "Partnership",
  "Feedback",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Get in <span className="text-electric text-glow">Touch</span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have questions? We're here to help. Reach out and we'll respond as
            soon as we can.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Whether you're an organizer looking to host tournaments, a
                player with questions, or interested in partnering with us —
                we'd love to hear from you.
              </p>

              <div className="space-y-4 mb-10">
                {contactInfo.map((item) => (
                  <div key={item.label} className="card-dark p-4 rounded-2xl flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-bold text-foreground hover:text-electric transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-bold text-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="card-dark rounded-3xl p-6 lg:p-8 gradient-border relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-transparent pointer-events-none" />
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex flex-col items-center justify-center border border-[#25D366]/30">
                    <MessageSquare className="h-4 w-4 text-[#25D366]" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">WhatsApp Support</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6 relative z-10 leading-relaxed">
                  For quick questions, message us on WhatsApp. We typically
                  respond within an hour during business hours.
                </p>
                <Button className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white font-semibold rounded-full h-11 relative z-10" asChild>
                  <a
                    href="https://wa.me/254700000000"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card-dark rounded-3xl p-8 lg:p-10 border border-border/20 shadow-2xl relative">
              {submitted ? (
                <div className="text-center py-16 flex flex-col items-center justify-center h-full">
                  <div className="w-20 h-20 bg-electric/10 rounded-full flex items-center justify-center mb-6 animate-pulse-glow">
                    <CheckCircle className="h-10 w-10 text-electric glow-text" />
                  </div>
                  <h3 className="text-3xl font-bold mb-3">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Thank you for reaching out. Our team has received your message and will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</Label>
                      <Input id="name" placeholder="Your name" required className="search-input-dark h-12 rounded-xl border-border/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="search-input-dark h-12 rounded-xl border-border/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone (Optional)</Label>
                    <Input id="phone" type="tel" placeholder="+254 7XX XXX XXX" className="search-input-dark h-12 rounded-xl border-border/20" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topic</Label>
                    <select
                      id="topic"
                      className="flex h-12 w-full rounded-xl border border-border/20 bg-background/40 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric transition-colors"
                      required
                    >
                      <option value="" className="bg-background">Select a topic</option>
                      {topics.map((topic) => (
                        <option key={topic} value={topic} className="bg-background">
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</Label>
                    <textarea
                      id="message"
                      rows={6}
                      placeholder="How can we help you?"
                      className="flex w-full rounded-xl border border-border/20 bg-background/40 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric transition-colors resize-none"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 rounded-xl bg-electric hover:bg-electric/90 text-[#030e10] font-bold text-base glow-cyan transition-all mt-4">
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
