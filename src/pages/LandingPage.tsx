import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import AppSection from '../components/AppSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, onSignUp }) => {
  return (
    <main>
      <HeroSection onSignIn={onSignIn} onSignUp={onSignUp} />
      <AboutSection />
      <FeaturesSection />
      <AppSection />
      <CTASection onSignIn={onSignIn} onSignUp={onSignUp} />
      <Footer />
    </main>
  );
};

export default LandingPage;