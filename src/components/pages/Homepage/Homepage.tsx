import React from 'react';
import PublicNavbar from '@/components/organisms/PublicNavbar';
import HeroSection from '@/components/organisms/HeroSection';
import TrustIndicatorsSection from '@/components/organisms/TrustIndicatorsSection';
import FeaturedCoursesSection from '@/components/organisms/FeaturedCoursesSection';
import PopularCoursesSection from '@/components/organisms/PopularCoursesSection';
import HowItWorksSection from '@/components/organisms/HowItWorksSection';
import AssessmentPreviewSection from '@/components/organisms/AssessmentPreviewSection';
import TestimonialsSection from '@/components/organisms/TestimonialsSection';
import NewsletterSection from '@/components/organisms/NewsletterSection';
import Footer from '@/components/organisms/Footer';

import { homepageSteps, homepageTestimonials, trustIndicators } from '@/config/homepage.config';

export default function Homepage() {
  return (
    <>
      <PublicNavbar />

      <HeroSection
        headline="Transform Your Parenting with Evidence-Based Strategies"
        subheadline="Join 10,000+ parents who've successfully implemented positive behavior changes and built stronger relationships with their children"
        primaryCTA={{
          text: 'Start Free Assessment',
          href: '/child',
        }}
        secondaryCTA={{
          text: 'Browse Courses',
          href: '/courses',
        }}
        backgroundImage="/images/hero-home-desktop.jpg"
        backgroundImageTablet="/images/hero-home-tablet.jpg"
        backgroundImageMobile="/images/hero-home-mobile.jpg"
      />

      <TrustIndicatorsSection indicators={trustIndicators} />

      {/* Recommended Courses with Carousel */}
      <FeaturedCoursesSection />

      {/* Popular Courses with Auto-play Carousel */}
      <PopularCoursesSection />

      <HowItWorksSection steps={homepageSteps} />

      <AssessmentPreviewSection />

      <TestimonialsSection testimonials={homepageTestimonials} />

      <NewsletterSection />

      <Footer />
    </>
  );
}
