import Link from "next/link"
import Image from "next/image"
import { GradientHeading } from "../ui/heading"

const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Contact Us", href: "/contact" }
]

const socialLinks = [
    { name: "Twitter", iconSrc: "/icons/twitter.svg", href: "https://twitter.com" },
    { name: "Instagram", iconSrc: "/icons/instagram.svg", href: "https://instagram.com" },
    { name: "Telegram", iconSrc: "/icons/telegram.svg", href: "https://telegram.org" },
    { name: "Facebook", iconSrc: "/icons/facebook.svg", href: "https://facebook.com" }
]

export function Footer() {
    return (
        <footer className="w-full py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                {/* Footer Content Container with Background */}
                <div className="bg-synqit-surface/20 backdrop-blur-sm border border-synqit-border/30 rounded-3xl p-8 md:p-16">
                    {/* CTA Section */}
                    <div className="text-center mb-12 md:mb-16">
                        <GradientHeading as="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
                            Let's create your next big idea.
                        </GradientHeading>
                        <Link
                            href="/get-started"
                            className="inline-block bg-black/50 backdrop-blur-sm border border-blue-500 text-white hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 px-10 py-3 rounded-full font-medium uppercase tracking-[0.2em] text-sm relative overflow-hidden group"
                            style={{
                                boxShadow: '0 0 15px rgba(59, 130, 246, 0.3), inset 0 0 15px rgba(59, 130, 246, 0.1)'
                            }}
                        >
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Horizontal */}
                    <nav className="hidden md:block mb-12">
                        <ul className="flex items-center justify-center gap-8">
                            {navigationLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white hover:text-synqit-muted-foreground transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Mobile Navigation - Vertical */}
                    <nav className="md:hidden mb-12">
                        <ul className="flex flex-col items-center gap-6">
                            {navigationLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white hover:text-synqit-muted-foreground transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Social Links */}
                    <div className="flex items-center justify-center gap-6 mb-8">
                        {socialLinks.map((social) => {
                            return (
                                <Link
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center  transition-all duration-200"
                                    aria-label={social.name}
                                >
                                    <Image
                                        src={social.iconSrc}
                                        alt={social.name}
                                        width={40}
                                        height={40}
                                        className="opacity-70 hover:opacity-100 transition-opacity hover:bg-synqit-primary/10 hover:rounded-full"
                                    />
                                </Link>
                            )
                        })}
                    </div>

                    {/* Copyright and Links */}
                    <div className="text-center space-y-2">
                        <p className="text-synqit-muted-foreground text-sm">
                            © 4025 HandlerX
                        </p>
                        <div className="flex items-center justify-center gap-2 text-xs text-synqit-muted-foreground">
                            <Link href="/privacy" className="hover:text-foreground transition-colors">
                                Privacy Policy
                            </Link>
                            <span>/</span>
                            <Link href="/terms" className="hover:text-foreground transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}