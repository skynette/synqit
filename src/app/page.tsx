import { MainLayout } from "@/components/layout/main-layout"
import { FAQSection } from "@/components/sections/faq"
import { Footer } from "@/components/sections/footer"
import { HeroSection } from "@/components/sections/hero"
import { HowSynqitWorksSection } from "@/components/sections/how-synqit-works"
import { PricingSection } from "@/components/sections/pricing"
import { TestimonialsSection } from "@/components/sections/testimonials"
import { TrustedBuildersSection } from "@/components/sections/trusted-builders"
import { UnlockWeb3Section } from "@/components/sections/unlock-web3-section"
import { Web3CollaborationSection } from "@/components/sections/web3-collaboration"
import { WhyChooseSynqitSection } from "@/components/sections/why-choose-synqit"

export default function Home() {
    return (
        <MainLayout>
            <HeroSection />
            <section id="about">
                <Web3CollaborationSection />
            </section>
            <UnlockWeb3Section />
            <section id="why-synqit">
                <WhyChooseSynqitSection />
            </section>
            <section id="how-synqit-work">
                <HowSynqitWorksSection />
            </section>
            <TrustedBuildersSection />
            <section id="testimonial">
                <TestimonialsSection />
            </section>
            <section id="pricing">
                <PricingSection/>
            </section>
            <FAQSection />
            <Footer />
        </MainLayout>
    )
}
