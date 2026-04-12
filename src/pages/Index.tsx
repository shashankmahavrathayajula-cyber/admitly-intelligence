import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import ToolsSection from '@/components/landing/ToolsSection';
import SupportedSchools from '@/components/landing/SupportedSchools';
import ProblemSection from '@/components/landing/ProblemSection';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import Differentiator from '@/components/landing/Differentiator';
import TrustSection from '@/components/landing/TrustSection';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';

const Index = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.landing-section-fade').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen scroll-smooth">
      <Navbar />
      <Hero />
      <ToolsSection />
      <SupportedSchools />
      <ProblemSection />
      <HowItWorks />
      <Features />
      <Differentiator />
      <TrustSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
};

export default Index;
