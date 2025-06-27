'use client'

import { useState } from "react"
import Image from "next/image"

interface PricingPlan {
    id: string
    tier: string
    name: string
    description: string
    price: string
    period?: string
    features: string[]
    buttonText: string
    buttonVariant: 'primary' | 'secondary'
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
        ],
        buttonText: "CONTINUE",
        buttonVariant: 'secondary'
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
        ],
        buttonText: "GET STARTED",
        buttonVariant: 'primary'
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
        ],
        buttonText: "GET STARTED",
        buttonVariant: 'primary'
    }
]

export default function PricingPage() {
    const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")

    return (
        <div className="space-y-8">
            {/* Header Badge */}
            <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-full px-4 py-2">
                    <Image 
                        src="/icons/synqit.png" 
                        alt="Synqit Logo" 
                        width={20} 
                        height={20} 
                        className="rounded"
                    />
                    <span className="text-white text-sm font-medium">SynQit Payment Plan</span>
                </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Flexible Pricing for Every Web3 Builder
                </h1>
                <p className="text-synqit-muted-foreground text-lg max-w-4xl">
                    Whether you're a startup, investor, or enterprise, Synqit offers tailored plans to match your networking needs.
                </p>
            </div>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-synqit-surface/20 backdrop-blur-sm border border-synqit-border/30 rounded-full p-1">
                <button
                    onClick={() => setBillingPeriod("monthly")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        billingPeriod === "monthly"
                            ? "bg-synqit-primary text-synqit-primary-foreground"
                            : "text-synqit-muted-foreground hover:text-foreground"
                    }`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => setBillingPeriod("yearly")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        billingPeriod === "yearly"
                            ? "bg-synqit-primary text-synqit-primary-foreground"
                            : "text-synqit-muted-foreground hover:text-foreground"
                    }`}
                >
                    Yearly
                </button>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricingPlans.map((plan) => (
                    <div
                        key={plan.id}
                        className="relative bg-synqit-surface/10 backdrop-blur-sm border border-synqit-border/30 rounded-2xl p-8 flex flex-col"
                    >
                        {/* Tier Badge */}
                        <div className="mb-6">
                            <div className="bg-synqit-primary text-synqit-primary-foreground px-6 py-2 rounded-full text-center font-medium text-sm">
                                {plan.tier}
                            </div>
                        </div>

                        {/* Plan Name */}
                        <h3 className="text-2xl font-bold text-white mb-2">
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
                                    <span className="text-green-500 flex-shrink-0 mt-0.5">✅</span>
                                    <span className="text-sm text-synqit-muted-foreground leading-relaxed">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA Button */}
                        <button
                            className={`w-full px-6 py-4 rounded-full font-medium uppercase tracking-[0.2em] text-sm transition-all duration-300 relative overflow-hidden group flex items-center justify-center ${
                                plan.buttonVariant === 'primary'
                                    ? 'bg-black/50 backdrop-blur-sm border border-blue-500 text-white hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                                    : 'bg-transparent border border-synqit-border text-white hover:bg-synqit-surface/20 hover:border-synqit-accent'
                            }`}
                            style={plan.buttonVariant === 'primary' ? {
                                boxShadow: '0 0 15px rgba(59, 130, 246, 0.3), inset 0 0 15px rgba(59, 130, 246, 0.1)'
                            } : {}}
                        >
                            <span className="relative z-10">{plan.buttonText}</span>
                            {plan.buttonVariant === 'primary' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
} 