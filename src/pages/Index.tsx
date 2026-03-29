import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import Stats from '@/components/landing/Stats';
import Testimonials from '@/components/landing/Testimonials';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/layout/Footer';

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <Stats />
    <HowItWorks />
    <Features />
    <Testimonials />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
