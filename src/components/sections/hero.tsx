import { Button } from "@/components/ui/button"
import Image from "next/image"
import { GradientHeading } from "../ui/heading"

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col items-center md:justify-center px-4 sm:px-6 lg:px-8 overflow-hidden mt-4 md:mt-8">
            {/* Welcome Badge */}
            <div className="mb-8 md:mb-10 z-10">
                <div className="bg-[#1a1f2e]/80 backdrop-blur-sm border border-synqit-primary/30 rounded-full px-6 py-3 shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-synqit-primary rounded-sm flex items-center justify-center">
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                                <path d="M0 0h8v8H0z" />
                            </svg>
                        </div>
                        <span className="text-white text-sm font-medium">Welcome to Synqit</span>
                    </div>
                </div>
            </div>

            {/* Logo with Tech Lines - aligned */}
            <div className="mb-8 md:mb-10 w-full flex items-center justify-center gap-0">
                {/* Right side tech lines (was left) */}
                <div className="hidden md:flex flex-shrink-0 h-72 md:h-[288px] items-center -ml-4 md:-ml-8 lg:-ml-12 mt-10">
                    <svg
                        viewBox="0 0 585 332"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-full w-[180px] md:w-[260px] lg:w-[340px] opacity-50"
                    >
                        <mask id="mask0_1308_4369" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="-2" y="0" width="587" height="332">
                            <path d="M562.279 1.23926H20.458C14.3386 1.23929 8.82156 2.8481 4.84961 5.42285C0.872707 8.00092 -1.50098 11.5042 -1.50098 15.2988V317.402C-1.50098 321.197 0.87271 324.699 4.84961 327.277C8.82159 329.852 14.3384 331.462 20.458 331.462H562.279C568.399 331.462 573.917 329.852 577.889 327.277C581.865 324.699 584.238 321.197 584.238 317.402V15.2988C584.238 11.5043 581.865 8.00091 577.889 5.42285C573.917 2.84795 568.399 1.23926 562.279 1.23926Z" fill="white" stroke="white" />
                        </mask>
                        <g mask="url(#mask0_1308_4369)">
                            <path d="M624.777 46.2367H456.633L422.392 10.7485L22.5002 10.7485" stroke="#4F4F4F" strokeLinecap="round" />
                            <path d="M618.408 28.0379H477.456L440.439 -7.4502H199.83" stroke="#4F4F4F" strokeLinecap="round" />
                            <path d="M620.229 9.83869H491.337L452.47 -25.6494L199.831 -25.6494" stroke="#4F4F4F" strokeLinecap="round" />
                            <path d="M503.754 109.933H394.047L366.453 74.4453H64.0004" stroke="#4F4F4F" strokeLinecap="round" />
                            <path d="M589.289 194.559H406.786L379.192 230.047H23.5001" stroke="#4F4F4F" strokeLinecap="round" />
                            <path d="M591.109 212.758H426.978L396.692 248.246H-2.49951" stroke="#4F4F4F" strokeLinecap="round" />
                            <path d="M503.754 158.161H386.235L356.286 193.649H-46.9996" stroke="#4F4F4F" strokeLinecap="round" />
                        </g>
                    </svg>
                </div>
                {/* Central hero image with logo and concentric circles */}
                <div className="relative flex items-center justify-center h-72 md:h-[288px] w-72 md:w-[288px] z-10">
                    <Image
                        src="/hero_logo.png"
                        alt="Synqit Hero Logo"
                        width={288}
                        height={288}
                        className="w-full h-full object-contain"
                        priority
                    />
                </div>
                {/* Left side tech lines (was right) */}
                <div className="hidden md:flex flex-shrink-0 h-72 md:h-[288px] items-center -mr-4 md:-mr-8 lg:-mr-12 mt-10">
                    <svg
                        viewBox="0 0 586 332"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-full w-[180px] md:w-[260px] lg:w-[340px] opacity-50"
                    >
                        <mask id="mask0_1308_8767" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="588" height="332">
                            <path d="M23.1992 1.23926H565.021C571.14 1.23929 576.657 2.8481 580.629 5.42285C584.606 8.00092 586.979 11.5042 586.979 15.2988V317.402C586.979 321.197 584.606 324.699 580.629 327.277C576.657 329.852 571.14 331.462 565.021 331.462H23.1992C17.0795 331.462 11.5619 329.852 7.58984 327.277C3.61326 324.699 1.24023 321.197 1.24023 317.402V15.2988C1.24023 11.5043 3.61305 8.00091 7.58984 5.42285C11.5619 2.84795 17.0795 1.23926 23.1992 1.23926Z" fill="white" stroke="white" />
                        </mask>
                        <g mask="url(#mask0_1308_8767)">
                            <path d="M-39.2988 46.2367H128.846L163.086 10.7485L562.978 10.7485" stroke="#4F4F4F" strokeLinecap="round" />
                            <path d="M-32.9297 28.0379H108.023L145.04 -7.4502H385.648" stroke="#4F4F4F" strokeLinecap="round" />
                            <path d="M-34.75 9.83869H94.1411L133.009 -25.6494L385.648 -25.6494" stroke="#4F4F4F" strokeLinecap="round" />
                            <path d="M81.7246 109.933H191.431L219.025 74.4453H521.478" stroke="#4F4F4F" strokeLinecap="round" />
                            <path d="M-3.81055 194.559H178.692L206.286 230.047H561.978" stroke="#4F4F4F" strokeLinecap="round" />
                            <path d="M-5.63086 212.758H158.501L188.787 248.246H587.978" stroke="#4F4F4F" strokeLinecap="round" />
                            <path d="M81.7246 158.161H199.243L229.192 193.649H632.478" stroke="#4F4F4F" strokeLinecap="round" />
                        </g>
                    </svg>
                </div>
            </div>

            {/* Heading */}
            <div className="mb-4 md:mb-6 z-10">
                <GradientHeading as="h1" className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center">
                    The Future of Web3 Collaboration Starts<span className="block">Here</span>
                </GradientHeading>
            </div>

            {/* Description */}
            <div className="text-center mb-6 md:mb-8 z-10">
                <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                    Discover and engage with the right partners, projects, and communities to accelerate your Web3 journey.
                </p>
            </div>

            {/* CTA Button */}
            <div className="z-10 w-full flex flex-col items-center gap-4">
                {/* Desktop button */}
                <Button
                    size="lg"
                    className="hidden md:block bg-black hover:bg-gray-800 text-white px-8 md:px-10 text-xs md:text-sm font-medium rounded-full transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-700 hover:border-gray-600"
                >
                    DISCOVER PROJECTS. FORGE PARTNERSHIPS.
                </Button>
                {/* Mobile buttons */}
                <button
                    className="block md:hidden bg-black/50 backdrop-blur-sm border border-blue-500 text-white hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 px-12 py-4 rounded-full font-medium uppercase tracking-[0.2em] text-sm relative overflow-hidden group w-full max-w-xs mx-auto"
                    style={{
                        boxShadow: '0 0 15px rgba(59, 130, 246, 0.3), inset 0 0 15px rgba(59, 130, 246, 0.1)'
                    }}
                >
                    <span className="relative z-10">GET STARTED</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
                <Button
                    size="lg"
                    className="block md:hidden bg-[#23242a] text-gray-400 w-full max-w-xs px-8 text-base font-medium rounded-full border border-transparent"
                    disabled
                >
                    Find Partners
                </Button>
            </div>
        </section>
    )
}