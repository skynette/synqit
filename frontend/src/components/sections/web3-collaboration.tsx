import Image from "next/image"
import { GradientHeading } from "../ui/heading"

interface CollaborationFeature {
    id: string
    title: string
    description: string | string[]
    imageSrc: string
    imageAlt: string
}

const topFeatures: CollaborationFeature[] = [
    {
        id: "ai-chat",
        title: "AI-Powered Collaboration Chat",
        description: "Communicate with Web3 partners, investors, and others using an AI-driven chat assistant.",
        imageSrc: "/images/web3-collab-1.png",
        imageAlt: "AI-Powered Collaboration Chat Interface"
    },
    {
        id: "decentralized",
        title: "Decentralized Collaboration",
        description: [
            "Chat, negotiate, and form partnerships using encrypted, on-chain communication.",
            "Leverage AI-driven insights to streamline deals and minimize risks."
        ],
        imageSrc: "/images/web3-collab-2.png",
        imageAlt: "Decentralized Collaboration Icons"
    },
    {
        id: "grow",
        title: "Growth & Expansion Tools",
        description: "Access funding, partnerships, and marketing tools to scale your Web3 venture effortlessly.",
        imageSrc: "/images/web3-collab-3.png",
        imageAlt: "Grow with Synqit"
    }
]

const bottomFeature: CollaborationFeature = {
    id: "secure",
    title: "Secure On-Chain Partnerships",
    description: "Build trust with verifiable, transparent partnerships recorded on the blockchain.",
    imageSrc: "/images/web3-collab-4.png",
    imageAlt: "Secure Shield"
}

export function Web3CollaborationSection() {
    return (
        <section className="w-full py-4 md:py-32 relative">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16 md:mb-20">
                    <GradientHeading as="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Seamless Web3 Collaboration
                    </GradientHeading>
                    <p className="text-synqit-muted-foreground text-base md:text-lg max-w-3xl mx-auto">
                        Discover and engage with the right partners, projects, and communities to accelerate your Web3 journey.
                    </p>
                </div>

                {/* Features Container */}
                <div className="space-y-8 lg:space-y-12">
                    {/* Top Row - 3 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {topFeatures.map((feature, idx) => (
                            <div key={feature.id} className="relative">
                                <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6 lg:p-8 h-full">
                                    {/* Feature Image */}
                                    <div className="relative w-full h-64 md:h-48 mb-6 rounded-lg overflow-hidden">
                                        <Image
                                            src={feature.imageSrc}
                                            alt={feature.imageAlt}
                                            fill
                                            className="object-contain"
                                            priority
                                        />
                                    </div>

                                    {/* You Icon for 1st and 3rd card only */}
                                    {(idx === 0 || idx === 2) && (
                                        <div className="flex justify-center mb-4">
                                            <span className="block">
                                                <svg width="55" height="37" viewBox="0 0 55 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="10" y="11.9805" width="45" height="25" rx="12.5" fill="#4C82ED" />
                                                    <path d="M23.472 28.9805V26.0685L20.126 19.7405H22.226L24.326 24.4305H24.396L26.482 19.7405H28.568L25.25 26.0405V28.9805H23.472ZM32.035 29.1625C31.3163 29.1625 30.6816 29.0178 30.131 28.7285C29.5803 28.4298 29.1463 27.9958 28.829 27.4265C28.521 26.8478 28.367 26.1385 28.367 25.2985C28.367 24.4398 28.5256 23.7305 28.843 23.1705C29.1696 22.6011 29.6083 22.1765 30.159 21.8965C30.7096 21.6165 31.3303 21.4765 32.021 21.4765C32.7396 21.4765 33.3743 21.6211 33.925 21.9105C34.4756 22.1998 34.9096 22.6338 35.227 23.2125C35.5443 23.7818 35.703 24.4911 35.703 25.3405C35.703 26.1991 35.5443 26.9131 35.227 27.4825C34.9096 28.0518 34.471 28.4765 33.911 28.7565C33.3603 29.0271 32.735 29.1625 32.035 29.1625ZM32.105 27.8185C32.497 27.8185 32.8283 27.7298 33.099 27.5525C33.3696 27.3658 33.575 27.0905 33.715 26.7265C33.8643 26.3625 33.939 25.9285 33.939 25.4245C33.939 24.8925 33.8596 24.4398 33.701 24.0665C33.5516 23.6838 33.3323 23.3898 33.043 23.1845C32.763 22.9791 32.4083 22.8765 31.979 22.8765C31.6056 22.8765 31.279 22.9698 30.999 23.1565C30.719 23.3338 30.5043 23.5998 30.355 23.9545C30.215 24.3091 30.145 24.7478 30.145 25.2705C30.145 26.0918 30.3176 26.7218 30.663 27.1605C31.0176 27.5991 31.4983 27.8185 32.105 27.8185ZM39.7129 29.1625C38.8729 29.1625 38.2382 28.8778 37.8089 28.3085C37.3889 27.7298 37.1789 26.8571 37.1789 25.6905V21.6585H38.9569V25.4945C38.9569 26.2318 39.0689 26.7825 39.2929 27.1465C39.5169 27.5105 39.8622 27.6925 40.3289 27.6925C40.5995 27.6925 40.8375 27.6271 41.0429 27.4965C41.2482 27.3565 41.4255 27.1651 41.5749 26.9225C41.7242 26.6705 41.8409 26.3811 41.9249 26.0545C42.0182 25.7278 42.0742 25.3685 42.0929 24.9765V21.6585H43.8569V25.9705V28.9805H42.4009L42.4289 26.6705H42.1769C42.0555 27.2585 41.8829 27.7345 41.6589 28.0985C41.4442 28.4625 41.1782 28.7331 40.8609 28.9105C40.5435 29.0785 40.1609 29.1625 39.7129 29.1625Z" fill="white" />
                                                    <path d="M3.26614 2.72707C3.11593 2.67312 2.96352 2.61838 2.83484 2.58493C2.71276 2.5532 2.47707 2.50061 2.22438 2.58812C1.93467 2.68844 1.707 2.91611 1.60667 3.20582C1.51916 3.45852 1.57176 3.6942 1.60349 3.81628C1.63693 3.94497 1.69167 4.09738 1.74563 4.24759L5.5649 14.8871C5.63195 15.0739 5.69624 15.2531 5.7597 15.3911C5.81331 15.5078 5.93522 15.7629 6.20028 15.9072C6.49013 16.0649 6.83911 16.0694 7.133 15.9194C7.40176 15.7822 7.53032 15.5303 7.58697 15.4151C7.65403 15.2788 7.72301 15.1013 7.79493 14.9163L9.51411 10.4956L13.9349 8.77638C14.1199 8.70447 14.2973 8.6355 14.4337 8.56845C14.5488 8.5118 14.8007 8.38323 14.9379 8.11447C15.088 7.82059 15.0834 7.47161 14.9257 7.18176C14.7814 6.9167 14.5263 6.79479 14.4097 6.74118C14.2716 6.67772 14.0925 6.61343 13.9056 6.54639L3.26614 2.72707Z" fill="#4C82ED" />
                                                </svg>
                                            </span>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3">
                                        {feature.title}
                                    </h3>
                                    {Array.isArray(feature.description) ? (
                                        <div className="space-y-2">
                                            {feature.description.map((desc, index) => (
                                                <p key={index} className="text-synqit-muted-foreground text-sm md:text-base">
                                                    {desc}
                                                </p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-synqit-muted-foreground text-sm md:text-base">
                                            {feature.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Row - 1 card centered with decorative lines */}
                    <div className="flex items-center justify-center">
                        <div className="flex items-center gap-8 w-full max-w-3xl">
                            {/* Left Line */}
                            <div className="hidden md:block flex-1 h-px bg-synqit-border" />

                            {/* Secure On-Chain Partnerships Card */}
                            <div className="w-full md:w-auto">
                                <div className="text-center bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6 lg:p-8 h-full flex flex-col items-center justify-center">
                                    {/* Shield Icon Container */}
                                    <div className="inline-block mb-6">
                                        <div className="w-32 h-32 md:w-32 md:h-32 bg-synqit-primary/10 rounded-2xl flex items-center justify-center">
                                            <div className="relative w-24 h-24 md:w-[200px] md:h-[200px]">
                                                <Image
                                                    src={bottomFeature.imageSrc}
                                                    alt={bottomFeature.imageAlt}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold">
                                        {bottomFeature.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Right Line */}
                            <div className="hidden md:block flex-1 h-px bg-synqit-border" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}