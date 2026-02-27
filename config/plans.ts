// Tournament pricing tiers - mirrors backend config/tournament_pricing.php
// Per-tournament fees based on max player count

export interface PricingTier {
  name: string;
  maxPlayers: number | null; // null = unlimited
  amount: number; // in cents (KES)
  currency: string;
  label: string;
  isPopular: boolean;
  features: string[];
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Small",
    maxPlayers: 16,
    amount: 50000, // KES 500
    currency: "KES",
    label: "Up to 16 players",
    isPopular: false,
    features: [
      "Up to 16 players",
      "Single elimination bracket",
      "Elo rating integration",
      "SMS & email notifications",
      "Real-time bracket updates",
    ],
  },
  {
    name: "Medium",
    maxPlayers: 32,
    amount: 100000, // KES 1,000
    currency: "KES",
    label: "17–32 players",
    isPopular: true,
    features: [
      "Up to 32 players",
      "Single elimination bracket",
      "Elo rating integration",
      "SMS & email notifications",
      "Real-time bracket updates",
      "Entry fee collection via M-Pesa",
    ],
  },
  {
    name: "Large",
    maxPlayers: 64,
    amount: 200000, // KES 2,000
    currency: "KES",
    label: "33–64 players",
    isPopular: false,
    features: [
      "Up to 64 players",
      "Single elimination bracket",
      "Elo rating integration",
      "SMS & email notifications",
      "Real-time bracket updates",
      "Entry fee collection via M-Pesa",
      "Tournament analytics",
    ],
  },
  {
    name: "Major",
    maxPlayers: 128,
    amount: 350000, // KES 3,500
    currency: "KES",
    label: "65–128 players",
    isPopular: false,
    features: [
      "Up to 128 players",
      "Single elimination bracket",
      "Elo rating integration",
      "SMS & email notifications",
      "Real-time bracket updates",
      "Entry fee collection via M-Pesa",
      "Tournament analytics",
      "Priority support",
    ],
  },
  {
    name: "Championship",
    maxPlayers: null,
    amount: 500000, // KES 5,000
    currency: "KES",
    label: "128+ players",
    isPopular: false,
    features: [
      "Unlimited players",
      "Single elimination bracket",
      "Elo rating integration",
      "SMS & email notifications",
      "Real-time bracket updates",
      "Entry fee collection via M-Pesa",
      "Tournament analytics",
      "Priority support",
      "Dedicated account manager",
    ],
  },
];

// Entry fee processing rate
export const entryFeeRate = {
  percentage: 5,
  flatFee: 0,
  currency: "KES",
};

// Helper functions
export function formatTierPrice(tier: PricingTier): string {
  return `KES ${(tier.amount / 100).toLocaleString()}`;
}

export function getTierForPlayers(maxPlayers: number): PricingTier {
  for (const tier of pricingTiers) {
    if (tier.maxPlayers === null || maxPlayers <= tier.maxPlayers) {
      return tier;
    }
  }
  return pricingTiers[pricingTiers.length - 1];
}

// Legacy exports for backwards compatibility with pricing page
export type PlanCode = "small" | "medium" | "large" | "major" | "championship";

export interface Plan {
  code: PlanCode;
  name: string;
  description: string;
  amount: number;
  currency: string;
  isPopular: boolean;
  features: string[];
  limitations: string[];
}

export const plansList: Plan[] = pricingTiers.map((tier) => ({
  code: tier.name.toLowerCase() as PlanCode,
  name: tier.name,
  description: tier.label,
  amount: tier.amount,
  currency: tier.currency,
  isPopular: tier.isPopular,
  features: tier.features,
  limitations: [],
}));

export function formatPrice(plan: Plan): string {
  return `KES ${(plan.amount / 100).toLocaleString()}`;
}

export function formatEntryFee(): string {
  return `${entryFeeRate.percentage}% per entry`;
}
