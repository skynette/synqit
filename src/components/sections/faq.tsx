'use client'

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { GradientHeading } from "../ui/heading"

interface FAQItem {
    id: string
    question: string
    answer: string
}

const faqItems: FAQItem[] = [
    {
        id: "what-is-synqit",
        question: "What is Synqit, and how does it work?",
        answer: "Synqit is a Web3 collaboration platform designed to help teams connect, manage projects, and grow within the decentralized space. It offers seamless communication, secure file sharing, and powerful tools for developers, creators, and businesses."
    },
    {
        id: "free-to-use",
        question: "Is Synqit free to use?",
        answer: "Yes, Synqit offers a free plan that includes limited partner connections per month, access to basic AI matchmaking, the ability to view verified company profiles, and join community discussions. For more advanced features, we offer Pro and Enterprise plans."
    },
    {
        id: "data-security",
        question: "How is my data secured on Synqit?",
        answer: "Synqit uses advanced encryption protocols and blockchain technology to ensure your data is secure. All communications are encrypted end-to-end, and we employ decentralized storage solutions to protect your information from unauthorized access."
    },
    {
        id: "web3-integration",
        question: "Can I integrate Synqit with other Web3 tools?",
        answer: "Absolutely! Synqit is designed to work seamlessly with popular Web3 tools and platforms. We support integrations with major blockchains, DeFi protocols, NFT marketplaces, and other decentralized applications through our API and plugin ecosystem."
    }
]

export function FAQSection() {
    const [openItems, setOpenItems] = useState<string[]>(["what-is-synqit"])

    const toggleItem = (itemId: string) => {
        setOpenItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        )
    }

    return (
        <section className="w-full py-20 md:py-32 relative">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <GradientHeading as="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        Frequently Asked Questions (FAQs)
                    </GradientHeading>
                    <p className="text-synqit-muted-foreground text-base md:text-lg">
                        Everything You Need to Know About Synqit - Answered! 🚀
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqItems.map((item) => {
                        const isOpen = openItems.includes(item.id)

                        return (
                            <div
                                key={item.id}
                                className={`
                  border border-synqit-border rounded-2xl overflow-hidden transition-all duration-300
                  ${isOpen ? 'bg-[#4C82ED] border-synqit-primary/30' : 'bg-synqit-surface/30 backdrop-blur-sm'}
                `}
                            >
                                {/* Question Header */}
                                <button
                                    onClick={() => toggleItem(item.id)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#4C82ED]/10 transition-colors duration-200"
                                >
                                    <h3 className="text-base md:text-lg font-medium pr-4">
                                        {item.question}
                                    </h3>
                                    <ChevronDown
                                        className={`
                      w-5 h-5 text-synqit-muted-foreground flex-shrink-0 transition-transform duration-300
                      ${isOpen ? 'rotate-180' : ''}
                    `}
                                    />
                                </button>

                                {/* Answer Content */}
                                <div
                                    className={`
                    px-6 overflow-hidden transition-all duration-300
                    ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}
                  `}
                                >
                                    <p className="text-sm md:text-base leading-relaxed">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}