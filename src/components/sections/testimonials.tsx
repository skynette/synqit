'use client'

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

interface Testimonial {
    id: string
    name: string
    role: string
    company: string
    content: string
    avatar: string
}

const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Alex R.",
        role: "Co-Founder",
        company: "NovaFi",
        content: "DeFi Project Scaling with Strategic VC Partnerships \"Synqit connected us with the perfect investors within days, helping us secure a $1M funding round faster than ever.\"",
        avatar: "/images/testimonial-avatar.png"
    },
    {
        id: "2",
        name: "Samantha L.",
        role: "CEO",
        company: "MegWork",
        content: "NFT Game Expansion with Web3 & \"Our NFT game went viral after the adoption skyrocketed.\"",
        avatar: "/images/testimonial-avatar.png"
    },
    {
        id: "3",
        name: "Michael T.",
        role: "Founder",
        company: "ChainConnect",
        content: "Blockchain partnerships made simple. Synqit's AI-powered matchmaking helped us find the perfect development partners for our DeFi protocol launch.",
        avatar: "/images/testimonial-avatar.png"
    },
    {
        id: "4",
        name: "Elena K.",
        role: "Head of Growth",
        company: "Web3Labs",
        content: "The platform transformed how we approach collaborations. We've closed 5 strategic partnerships in just 2 months through Synqit.",
        avatar: "/images/testimonial-avatar.png"
    }
]

export function TestimonialsSection() {
    const [isPaused, setIsPaused] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const animationRef = useRef<number | undefined>(undefined)

    useEffect(() => {
        const scrollContainer = scrollRef.current
        if (!scrollContainer) return

        let scrollPosition = 0
        const scrollSpeed = 0.5 // Adjust speed as needed

        const animate = () => {
            if (!isPaused && scrollContainer) {
                scrollPosition += scrollSpeed

                // Reset scroll when first set of testimonials is out of view
                const maxScroll = scrollContainer.scrollWidth / 2
                if (scrollPosition >= maxScroll) {
                    scrollPosition = 0
                }

                scrollContainer.scrollLeft = scrollPosition
            }
            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [isPaused])

    return (
        <section className="w-full py-20 md:py-32 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Testimonials that Speak to Our Results
                    </h2>
                    <p className="text-synqit-muted-foreground text-base md:text-lg">
                        See how Synqit is transforming Web3 partnerships with real success stories
                    </p>
                </div>

                {/* Testimonials Slider */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Gradient Overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                    {/* Scrolling Container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-hidden scrollbar-hide"
                        style={{ scrollBehavior: 'auto' }}
                    >
                        {/* Duplicate testimonials for infinite scroll effect */}
                        {[...testimonials, ...testimonials].map((testimonial, index) => (
                            <div
                                key={`${testimonial.id}-${index}`}
                                className="flex-shrink-0 w-[600px] bg-synqit-surface/10 backdrop-blur-sm border border-synqit-border/20 rounded-2xl p-8 relative"
                            >
                                {/* Header with Author Info and Quote Icon */}
                                <div className="flex items-start justify-between mb-8">
                                    {/* Author Info - Top Left */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-synqit-surface relative">
                                            <Image
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                                            <p className="text-synqit-muted-foreground text-sm">
                                                {testimonial.role} of {testimonial.company}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quote Icon - Top Right */}
                                    <div className="w-12 h-12 relative flex-shrink-0">
                                        <Image
                                            src="/icons/quoteup.svg"
                                            alt="Quote"
                                            fill
                                            className="object-contain opacity-50"
                                        />
                                    </div>
                                </div>

                                {/* Testimonial Content */}
                                <p className="text-synqit-muted-foreground text-base md:text-lg leading-relaxed">
                                    {testimonial.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </section>
    )
}