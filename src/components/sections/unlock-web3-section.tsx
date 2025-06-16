import React from 'react'
import Image from "next/image"

export function UnlockWeb3Section() {
    return (
        <section className="w-full py-4 md:py-32 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl relative">
                {/* Main content wrapper */}
                <div className="relative flex flex-col items-center justify-center">
                    {/* Heading */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 text-white text-center">
                        Unlock the Power of Web3 Today!
                    </h2>

                    {/* Subheading */}
                    <p className="text-gray-400 text-base md:text-lg lg:text-xl mb-12 md:mb-16 text-center">
                        Join us on the journey to the decentralized future.
                    </p>

                    {/* Logo with SVG lines container */}
                    <div className="relative flex items-center justify-center mb-12 md:mb-16 w-full">
                        {/* Left SVG lines - Hidden on mobile */}
                        <div className="hidden md:block absolute left-1/2 -translate-x-[calc(50%+80px)] md:-translate-x-[calc(50%+100px)] lg:-translate-x-[calc(50%+120px)]">
                            <svg
                                viewBox="0 0 585 332"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-[100px] md:h-[120px] lg:h-[140px] w-auto opacity-50"
                            >
                                <mask id="mask0_unlock_right" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="-2" y="0" width="587" height="332">
                                    <path d="M562.279 1.23926H20.458C14.3386 1.23929 8.82156 2.8481 4.84961 5.42285C0.872707 8.00092 -1.50098 11.5042 -1.50098 15.2988V317.402C-1.50098 321.197 0.87271 324.699 4.84961 327.277C8.82159 329.852 14.3384 331.462 20.458 331.462H562.279C568.399 331.462 573.917 329.852 577.889 327.277C581.865 324.699 584.238 321.197 584.238 317.402V15.2988C584.238 11.5043 581.865 8.00091 577.889 5.42285C573.917 2.84795 568.399 1.23926 562.279 1.23926Z" fill="white" stroke="white" />
                                </mask>
                                <g mask="url(#mask0_unlock_right)">
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

                        {/* Logo/Image - centered */}
                        <div className="relative z-10">
                            <Image
                                src="/images/logo_power.png"
                                alt="Synqit Logo"
                                width={120}
                                height={120}
                                className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain"
                                priority
                            />
                        </div>

                        {/* Right SVG lines - Hidden on mobile */}
                        <div className="hidden md:block absolute left-1/2 translate-x-[calc(50%-80px)] md:translate-x-[calc(50%-100px)] lg:translate-x-[calc(50%-120px)]">
                            <svg
                                viewBox="0 0 586 332"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-[100px] md:h-[120px] lg:h-[140px] w-auto opacity-50"
                            >
                                <mask id="mask0_unlock_left" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="588" height="332">
                                    <path d="M23.1992 1.23926H565.021C571.14 1.23929 576.657 2.8481 580.629 5.42285C584.606 8.00092 586.979 11.5042 586.979 15.2988V317.402C586.979 321.197 584.606 324.699 580.629 327.277C576.657 329.852 571.14 331.462 565.021 331.462H23.1992C17.0795 331.462 11.5619 329.852 7.58984 327.277C3.61326 324.699 1.24023 321.197 1.24023 317.402V15.2988C1.24023 11.5043 3.61305 8.00091 7.58984 5.42285C11.5619 2.84795 17.0795 1.23926 23.1992 1.23926Z" fill="white" stroke="white" />
                                </mask>
                                <g mask="url(#mask0_unlock_left)">
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

                    {/* CTA Button */}
                    <button
                        className="bg-black/50 backdrop-blur-sm border border-blue-500 text-white hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 px-12 py-4 rounded-full font-medium uppercase tracking-[0.2em] text-sm md:text-base relative overflow-hidden group"
                        style={{
                            boxShadow: '0 0 15px rgba(59, 130, 246, 0.3), inset 0 0 15px rgba(59, 130, 246, 0.1)'
                        }}
                        type="button"
                    >
                        <span className="relative z-10">Accelerate Your Web3 Growth</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                </div>
            </div>
        </section>
    )
}