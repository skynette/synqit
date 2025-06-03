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
            <Web3CollaborationSection />
            {/* <UnlockWeb3Section /> */}
            <WhyChooseSynqitSection />
            <HowSynqitWorksSection />
            <TrustedBuildersSection />
            <TestimonialsSection />
            <PricingSection/>
            <FAQSection />
            <Footer />
        </MainLayout>
    )
}
