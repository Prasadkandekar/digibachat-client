import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import PricingSection from '../components/PricingSection';
import AppSection from '../components/AppSection';
import CTASection from '../components/CTASection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, onSignUp }) => {
  return (
    <main>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.3,
              delayChildren: 0.2,
            },
          },
        }}
      >
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.6 },
            },
          }}
        >
          <HeroSection onSignIn={onSignIn} onSignUp={onSignUp} />
        </motion.div>

        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.6 },
            },
          }}
        >
          <AboutSection />
        </motion.div>

        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.6 },
            },
          }}
        >
          <FeaturesSection />
        </motion.div>

        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.6 },
            },
          }}
        >
          <PricingSection />
        </motion.div>

        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.6 },
            },
          }}
        >
          <AppSection />
        </motion.div>

        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.6 },
            },
          }}
        >
          <ContactSection />
        </motion.div>

        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.6 },
            },
          }}
        >
          <CTASection onSignIn={onSignIn} onSignUp={onSignUp} />
        </motion.div>

        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.6 },
            },
          }}
        >
          <Footer />
        </motion.div>
      </motion.div>
    </main>
  );
};

export default LandingPage;