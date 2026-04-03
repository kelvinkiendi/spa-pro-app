export const SUBSCRIPTION_TIERS = {
  individual: {
    name: "Individual",
    maxEmployees: 1,
    priceMonthly: 29,
    features: ["1 Employee", "Basic POS", "M-Pesa Payments", "Client Management"],
  },
  small_salon: {
    name: "Small Salon",
    maxEmployees: 10,
    priceMonthly: 79,
    features: ["Up to 10 Employees", "Full POS", "M-Pesa Payments", "Inventory Management", "Reports"],
  },
  big_spa: {
    name: "Big Spa",
    maxEmployees: 20,
    priceMonthly: 149,
    features: ["Up to 20 Employees", "Full POS", "Multi-Branch", "Advanced Analytics", "Tax Reports"],
  },
  enterprise: {
    name: "Enterprise",
    maxEmployees: Infinity,
    priceMonthly: 499,
    features: ["Unlimited Employees", "Full POS", "Multi-Branch", "Priority Support", "Custom Integrations"],
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
