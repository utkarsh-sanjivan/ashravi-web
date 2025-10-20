import React from 'react';
import PublicNavbar from '@/components/organisms/PublicNavbar';
import HeroSection from '@/components/organisms/HeroSection';
import WhyChooseSection from '@/components/organisms/WhyChooseSection';
import HowItWorksSection from '@/components/organisms/HowItWorksSection';
import FeaturedCoursesSection from '@/components/organisms/FeaturedCoursesSection';
import TestimonialsSection from '@/components/organisms/TestimonialsSection';
import NewsletterSection from '@/components/organisms/NewsletterSection';
import Footer from '@/components/organisms/Footer';

import { landingFeatures, landingSteps, landingTestimonials } from '@/config/landing.config';

export default function LandingPage() {
  return (
    <>
      <PublicNavbar isAuthenticated={false} showSearch={false} transparent={true} />

      <HeroSection
        headline="Empowering Parents to Build Positive Child Behaviors"
        subheadline="Discover evidence-based parenting strategies and interactive learning designed by child behavior experts to help you become the parent you want to be."
        primaryCTA={{
          text: 'Start Free',
          href: '/auth/signup',
        }}
        secondaryCTA={{
          text: 'Explore Courses',
          href: '/courses',
        }}
        backgroundImage="/images/hero-landing-desktop.jpg"
        backgroundImageTablet="/images/hero-landing-tablet.jpg"
        backgroundImageMobile="/images/hero-landing-mobile.jpg"
      />

      <WhyChooseSection
        title="Why Choose Ashravi?"
        subtitle="Transform your parenting journey with proven strategies"
        features={landingFeatures}
        ctaText="Take a Free Assessment"
        ctaHref="/assessment/demo"
      />

      <HowItWorksSection steps={landingSteps} />

      <FeaturedCoursesSection />

      <TestimonialsSection testimonials={landingTestimonials} />

      <NewsletterSection />

      <Footer />
    </>
  );
}
