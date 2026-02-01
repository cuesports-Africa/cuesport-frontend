// Subscription plans - mirrors backend config/paystack.php
// These rarely change, so we hardcode them for instant loading & SEO

export type PlanCode = "starter" | "pro" | "business";

export interface Plan {
  code: PlanCode;
  name: string;
  description: string;
  amount: number; // in cents (0 = free)
  currency: string;
  interval: "monthly" | "yearly";
  limits: {
    tournaments: number | null; // null = unlimited
    players: number | null; // null = unlimited
    organizerAccounts: number;
  };
  entryFees: {
    canCollect: boolean;
    percentage: number;
    flatFee: number;
    flatFeeCurrency: string;
  };
  showBranding: boolean;
  isPopular: boolean;
  features: string[];
  limitations: string[];
}

export const plans: Record<PlanCode, Plan> = {
  starter: {
    code: "starter",
    name: "Starter",
    description: "Perfect for trying out tournaments",
    amount: 0,
    currency: "USD",
    interval: "monthly",
    limits: {
      tournaments: 2,
      players: 16,
      organizerAccounts: 1,
    },
    entryFees: {
      canCollect: false,
      percentage: 0,
      flatFee: 0,
      flatFeeCurrency: "KES",
    },
    showBranding: true,
    isPopular: false,
    features: [
      "Up to 16 players per tournament",
      "2 tournaments per month",
      "Basic bracket management",
      "Manual result entry",
      "Community support",
    ],
    limitations: [
      "CueSports branding on tournaments",
      "No entry fee collection",
    ],
  },
  pro: {
    code: "pro",
    name: "Pro",
    description: "For serious tournament organizers",
    amount: 1200, // $12.00
    currency: "USD",
    interval: "monthly",
    limits: {
      tournaments: null,
      players: null,
      organizerAccounts: 1,
    },
    entryFees: {
      canCollect: true,
      percentage: 3,
      flatFee: 500, // KES 5
      flatFeeCurrency: "KES",
    },
    showBranding: false,
    isPopular: true,
    features: [
      "Unlimited players",
      "Unlimited tournaments",
      "Elo rating integration",
      "Online entry fee collection",
      "Player notifications (SMS & email)",
      "Remove CueSports branding",
      "Export results & reports",
      "Priority email support",
    ],
    limitations: [],
  },
  business: {
    code: "business",
    name: "Business",
    description: "For venues & tournament series",
    amount: 3900, // $39.00
    currency: "USD",
    interval: "monthly",
    limits: {
      tournaments: null,
      players: null,
      organizerAccounts: 5,
    },
    entryFees: {
      canCollect: true,
      percentage: 2,
      flatFee: 0,
      flatFeeCurrency: "KES",
    },
    showBranding: false,
    isPopular: false,
    features: [
      "Everything in Pro",
      "5 organizer accounts",
      "Recurring tournaments",
      "League management",
      "Custom branding",
      "Analytics dashboard",
      "API access",
      "Dedicated support",
    ],
    limitations: [],
  },
};

// Helper functions
export const plansList = Object.values(plans);

export function getPlan(code: PlanCode): Plan {
  return plans[code];
}

export function formatPrice(plan: Plan): string {
  if (plan.amount === 0) return "Free";
  return `$${plan.amount / 100}`;
}

export function formatEntryFee(plan: Plan): string {
  if (!plan.entryFees.canCollect) return "";

  const parts: string[] = [];
  if (plan.entryFees.percentage > 0) {
    parts.push(`${plan.entryFees.percentage}%`);
  }
  if (plan.entryFees.flatFee > 0) {
    parts.push(`${plan.entryFees.flatFeeCurrency} ${plan.entryFees.flatFee / 100}`);
  }

  return parts.join(" + ") + " per entry";
}

export function isUnlimited(limit: number | null): boolean {
  return limit === null;
}
