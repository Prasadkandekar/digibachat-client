import React from 'react';
import { Download, UserPlus } from 'lucide-react';

interface HeroSectionProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSignUp }) => {
  return (
    <section className="bg-gradient-to-br from-green-50 to-teal-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="lg:pr-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Save Smarter, Lend Together, Grow Stronger!
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Digi बचत is a digital-first platform that makes group savings and 
              lending simple, transparent, and convenient. Create or join savings 
              groups, contribute securely via UPI, and manage your financial 
              journey — All in one app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                <Download className="w-5 h-5 mr-2" />
                Download the App
              </button>
              <button 
                onClick={onSignUp}
                className="flex items-center justify-center px-8 py-4 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Sign Up Free
              </button>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
          <img src="/images/logo.png" alt="Hero Image" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;