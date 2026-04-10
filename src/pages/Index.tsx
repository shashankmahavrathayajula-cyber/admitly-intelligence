import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import ProblemSection from '@/components/landing/ProblemSection';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import Differentiator from '@/components/landing/Differentiator';
import TrustSection from '@/components/landing/TrustSection';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <ProblemSection />
    <HowItWorks />
    <Features />
    <Differentiator />
    <TrustSection />
    <CTASection />
    <LandingFooter />
  </div>
);

export default Index;
