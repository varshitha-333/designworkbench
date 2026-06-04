import React from 'react';
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import LandingInteractiveDemo from '../components/landing/LandingInteractiveDemo';
import PricingSection from '../components/landing/PricingSection';
import FaqSection from '../components/landing/FaqSection';
import Footer from '../components/landing/Footer';

export default function LandingPage({ currentTab, setCurrentTab }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <main className="flex-grow">
        <HeroSection setCurrentTab={setCurrentTab} />
        <FeaturesGrid setCurrentTab={setCurrentTab} />
        <LandingInteractiveDemo />
        <PricingSection setCurrentTab={setCurrentTab} />
        <FaqSection />
      </main>
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}
