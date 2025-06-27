import Image from "next/image"
import { Check, ArrowDown } from "lucide-react"
import { GradientHeading } from "../ui/heading"

interface WorkStep {
    id: string
    title: string
    description: string
    bulletPoints: string[]
    imageSrc: string
    imageAlt: string
    imagePosition: "left" | "right"
    iconColor: string
}

const workSteps: WorkStep[] = [
    {
        id: "create-profile",
        title: "Create & Optimize Your Profile",
        description: "",
        bulletPoints: [
            "Showcase your company, blockchain focus, funding stage & interests.",
            "AI enhances your profile for maximum visibility & match accuracy."
        ],
        imageSrc: "/images/how-it-works-1.png",
        imageAlt: "How it works step 1",
        imagePosition: "right",
        iconColor: "bg-synqit-primary"
    },
    {
        id: "smart-matchmaking",
        title: "Smart Matchmaking & Discovery",
        description: "",
        bulletPoints: [
            "AI-powered recommendations suggest ideal partners based on your goals.",
            "Advanced search & filters let you browse projects, VCs, and communities."
        ],
        imageSrc: "/images/how-it-works-2.png",
        imageAlt: "How it works step 2",
        imagePosition: "left",
        iconColor: "bg-purple-500"
    },
    {
        id: "verified-connections",
        title: "Verified Connections & Secure Outreach",
        description: "",
        bulletPoints: [
            "One-click partnership requests, and AI-powered conversation.",
            "See verified social proof, engagement metrics & deal transparency."
        ],
        imageSrc: "/images/how-it-works-3.png",
        imageAlt: "How it works step 3",
        imagePosition: "right",
        iconColor: "bg-green-500"
    },
    {
        id: "seamless-collaboration",
        title: "Seamless Collaboration & On-Chain Integration",
        description: "(Future Phase)",
        bulletPoints: [
            "Smart contracts for deal tracking & execution.",
            "Automated follow-ups & milestone tracking."
        ],
        imageSrc: "/images/how-it-works-4.png",
        imageAlt: "How it works step 4",
        imagePosition: "left",
        iconColor: "bg-synqit-primary"
    }
]

export function HowSynqitWorksSection() {
    return (
        <section className="w-full py-20 md:py-32 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16 md:mb-20">
                    <GradientHeading as="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        How Synqit Works
                    </GradientHeading>
                    <p className="text-synqit-muted-foreground text-base md:text-lg">
                        Effortlessly find, connect, and collaborate with the right Web3 partners in just a few steps.
                    </p>
                </div>

                {/* Steps Container */}
                <div className="space-y-16 md:space-y-24">
                    {workSteps.map((step, index) => (
                        <div key={step.id} className="relative">
                            {/* Main Card Container */}
                            <div className="relative bg-synqit-surface/10 border border-synqit-border/20 rounded-2xl p-8 md:p-12">
                                {/* Stick SVG */}
                                <div className={`hidden md:block absolute top-0 h-full z-10 py-6 w-16 ${(index % 2 === 0) ? 'left-0 pl-6' : 'left-1/2 -translate-x-1/2'}`}>
                                    <img
                                        src={`/icons/stick-${index + 1}.svg`}
                                        alt=""
                                        className="h-full"
                                        draggable={false}
                                    />
                                </div>
                                {/* Card Content */}
                                <div className={`relative z-20 ${index % 2 === 0 ? 'md:ml-20' : ''}`}>
                                    <div className={`flex flex-col ${step.imagePosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}>

                                        {/* Image Side with Icon */}
                                        <div className="w-full md:w-1/2 relative">
                                            {/* Image */}
                                            <div className="relative w-full h-64 md:h-80">
                                                <Image
                                                    src={step.imageSrc}
                                                    alt={step.imageAlt}
                                                    fill
                                                    className="object-contain"
                                                    priority={index === 0}
                                                />
                                            </div>
                                        </div>

                                        {/* Content Side */}
                                        <div className="w-full md:w-1/2">
                                            {/* Title and Description */}
                                            <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                                {step.title}
                                            </h3>
                                            {step.description && (
                                                <p className="text-synqit-muted-foreground text-sm italic mb-6">
                                                    {step.description}
                                                </p>
                                            )}

                                            {/* Bullet Points with Check Icons */}
                                            <ul className="space-y-4">
                                                {step.bulletPoints.map((point, pointIndex) => (
                                                    <li key={pointIndex} className="flex items-start gap-3">
                                                        <div className={`w-6 h-6 ${step.iconColor} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                            <Check className="w-4 h-4 text-white" />
                                                        </div>
                                                        <p className="text-synqit-muted-foreground text-base leading-relaxed">
                                                            {point}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}