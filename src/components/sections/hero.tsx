import { Button } from "@/components/ui/button"
import Image from "next/image"
import { GradientHeading } from "../ui/heading"

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col items-center md:justify-center px-4 sm:px-6 lg:px-8 overflow-hidden mt-4 md:mt-8">
            {/* Welcome Badge */}
            <div className="mb-8 md:mb-10 z-10">
                <div className="bg-[#1a1f2e]/30 backdrop-blur-sm border border-synqit-primary/30 rounded-full px-6 py-3 shadow-lg">
                    <div className="flex items-center space-x-3">
                        <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.2372 13.3613C13.0752 13.4757 12.8898 13.5526 12.6944 13.5865C12.499 13.6204 12.2985 13.6104 12.1074 13.5573C11.9164 13.5041 11.7395 13.4092 11.5897 13.2792C11.4399 13.1493 11.3208 12.9877 11.2412 12.806L10.6087 10.8839C10.4548 10.4214 10.1954 10.0012 9.85093 9.65642C9.50646 9.31166 9.08642 9.05188 8.6241 8.89767L6.78574 8.30049C6.52445 8.20959 6.29851 8.03855 6.1401 7.81174C6.01778 7.63979 5.93812 7.44121 5.90767 7.2324C5.87723 7.02359 5.89688 6.81053 5.965 6.61081C6.03313 6.41109 6.14777 6.23044 6.29948 6.08376C6.45118 5.93707 6.63559 5.82857 6.83749 5.76721L8.65695 5.17578C9.11953 5.02234 9.54 4.76325 9.88505 4.41906C10.2301 4.07487 10.4902 3.65504 10.6448 3.19285L11.242 1.35532C11.3338 1.09497 11.5043 0.86962 11.7299 0.710495C11.9569 0.554013 12.226 0.470215 12.5017 0.470215C12.7773 0.470215 13.0464 0.554013 13.2734 0.710495C13.5025 0.872493 13.6749 1.10236 13.7662 1.36764L14.3708 3.22817C14.525 3.67837 14.7796 4.08758 15.1154 4.42486C15.4511 4.76214 15.8591 5.01864 16.3086 5.17496L18.1486 5.77132C18.4104 5.86387 18.6369 6.03573 18.7964 6.26299C18.956 6.49024 19.0408 6.7616 19.039 7.03929C19.0372 7.31698 18.9489 7.58721 18.7864 7.81237C18.6238 8.03753 18.3951 8.20643 18.1321 8.29557L16.3118 8.88699C15.7217 9.08505 15.2029 9.45243 14.8201 9.94335C14.6016 10.2251 14.4332 10.5414 14.3223 10.8798L13.7243 12.7149C13.6323 12.9761 13.4615 13.202 13.2356 13.3613M5.2316 18.3556C5.06441 18.4737 4.8646 18.5369 4.65988 18.5363C4.45656 18.5369 4.25801 18.4747 4.09145 18.3581C3.91997 18.237 3.79162 18.0643 3.7251 17.8652L3.41953 16.9263C3.35489 16.7314 3.24575 16.5542 3.10075 16.4088C2.95575 16.2633 2.77887 16.1537 2.58413 16.0885L1.62635 15.778C1.43319 15.7093 1.26597 15.5827 1.14759 15.4154C1.02921 15.248 0.965471 15.0482 0.965097 14.8432C0.965094 14.6328 1.03238 14.428 1.15712 14.2586C1.28185 14.0892 1.4575 13.9642 1.65838 13.9018L2.5981 13.5979C2.79312 13.5332 2.97037 13.4239 3.11581 13.2788C3.26124 13.1336 3.37086 12.9566 3.43595 12.7617L3.7481 11.8064C3.81541 11.6114 3.9422 11.4424 4.1106 11.3233C4.27899 11.2042 4.48052 11.1409 4.68678 11.1423C4.89305 11.1438 5.09366 11.2099 5.26036 11.3314C5.42707 11.4529 5.55146 11.6236 5.61603 11.8195L5.92324 12.7609C5.9862 12.9532 6.09248 13.1286 6.2339 13.2734C6.37531 13.4183 6.54809 13.5287 6.73892 13.5962L7.6967 13.9067C7.8903 13.9751 8.05797 14.1018 8.17667 14.2693C8.29537 14.4369 8.35927 14.637 8.3596 14.8424C8.35938 15.0494 8.29396 15.2512 8.17261 15.419C8.05126 15.5868 7.88015 15.7121 7.68356 15.7771L6.74385 16.0827C6.54807 16.1473 6.37023 16.2569 6.22468 16.4029C6.07913 16.5489 5.96996 16.7271 5.90599 16.923L5.59467 17.8784C5.52673 18.0714 5.40041 18.2384 5.23324 18.3564" fill="#5C93FF" />
                        </svg>
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
                <div className="md:hidden w-full flex flex-col items-center gap-4">
                    <a
                        href="/auth"
                        className="bg-black/50 backdrop-blur-sm border border-blue-500 text-white hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 px-12 py-4 rounded-full font-medium uppercase tracking-[0.2em] text-sm relative overflow-hidden group w-full"
                        style={{
                            boxShadow: '0 0 15px rgba(59, 130, 246, 0.3), inset 0 0 15px rgba(59, 130, 246, 0.1)'
                        }}
                    >
                        <span className="relative z-10 flex items-center justify-center">GET STARTED</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </a>
                    <Button
                        size="lg"
                        className="bg-[#23242a] text-gray-400 w-full px-8 py-5 text-base font-medium rounded-full border border-transparent"
                        disabled
                    >
                        Find Partners
                    </Button>
                </div>
            </div>
        </section>
    )
}