'use client'

import { useState } from "react"

interface PricingPlan {
    id: string
    tier: string
    name: string
    description: string
    price: string
    period?: string
    features: string[]
    isPopular?: boolean
}

const pricingPlans: PricingPlan[] = [
    {
        id: "free",
        tier: "Tier 1",
        name: "Free Plan",
        description: "Get Started for Free",
        price: "$0.00",
        features: [
            "Limited partner connections per month",
            "Access to basic AI matchmaking",
            "View verified company profiles",
            "Join community discussions"
        ]
    },
    {
        id: "pro",
        tier: "Tier 2",
        name: "Pro Plan",
        description: "Dedicated Support & Advanced Features",
        price: "$XX",
        period: "/month",
        features: [
            "Unlimited AI-powered matchmaking",
            "Priority partnership recommendations",
            "Verified & transparent deal tracking",
            "Access to exclusive investor & VC networks"
        ]
    },
    {
        id: "enterprise",
        tier: "Tier 3",
        name: "Enterprise Plan",
        description: "More Integrations & Collaboration Tools",
        price: "$XX",
        period: "/month",
        features: [
            "Custom AI-powered deal sourcing",
            "Dedicated account manager",
            "Advanced analytics & reporting",
            "API integrations for Web3 teams"
        ]
    }
]

export function PricingSection() {
    const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")

    return (
        <section className="w-full py-20 md:py-32 relative">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Flexible Pricing for Every Web3 Builder
                    </h2>
                    <p className="text-synqit-muted-foreground text-base md:text-lg max-w-3xl mx-auto mb-8">
                        Whether you're a startup, investor, or enterprise, Synqit offers tailored plans to match your networking needs.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center bg-synqit-surface/20 backdrop-blur-sm border border-synqit-border/30 rounded-full p-1">
                        <button
                            onClick={() => setBillingPeriod("monthly")}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${billingPeriod === "monthly"
                                    ? "bg-synqit-primary text-synqit-primary-foreground"
                                    : "text-synqit-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingPeriod("yearly")}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${billingPeriod === "yearly"
                                    ? "bg-synqit-primary text-synqit-primary-foreground"
                                    : "text-synqit-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Yearly
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className="relative bg-synqit-surface/10 backdrop-blur-sm border border-synqit-border/30 rounded-4xl p-8 flex flex-col"
                        >
                            {/* Tier Badge - Rounded Pill */}
                            <div className="mb-6">
                                <div className="bg-synqit-primary/30 text-synqit-primary-foreground px-6 py-2 rounded-full text-center font-medium">
                                    {plan.tier}
                                </div>
                            </div>

                            {/* Plan Name */}
                            <h3 className="text-2xl font-bold mb-2">
                                {plan.name}
                            </h3>

                            {/* Description */}
                            <p className="text-synqit-muted-foreground text-sm mb-6">
                                {plan.description}
                            </p>

                            {/* Separator */}
                            <div className="h-px bg-synqit-border/30 mb-6"></div>

                            {/* Price */}
                            <div className="mb-8">
                                <span className="text-4xl font-bold text-synqit-primary">
                                    {plan.price}
                                </span>
                                {plan.period && (
                                    <span className="text-synqit-muted-foreground text-lg">
                                        {plan.period}
                                    </span>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-green-500 flex-shrink-0">✅</span>
                                        <span className="text-sm text-synqit-muted-foreground leading-relaxed">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <button
                                className="w-full py-3 bg-transparent border border-synqit-primary text-synqit-primary hover:bg-synqit-primary hover:text-synqit-primary-foreground rounded-full font-medium transition-all duration-200 uppercase tracking-wider text-sm"
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}