import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import DashboardPreview from "@/components/landing/DashboardPreview";
import TrustedBy from "@/components/landing/TrustedBy";
import Features from "@/components/landing/Features";
import AIControlCenter from "@/components/landing/AIControlCenter";
import AIControlCenterV2 from "@/components/landing/AIControlCenterV2";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";

import Footer from "@/components/landing/Footer";
export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        
        <Hero />
        <TrustedBy />
        <Features />
         <AIControlCenterV2 />
        <Testimonials />
        <Pricing />
        <FAQ />
        
        <DashboardPreview />
        <Footer />
      </main>
    </>
  );
}