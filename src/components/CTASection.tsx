import React from 'react';
import { UserPlus, LogIn } from 'lucide-react';

interface CTASectionProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onSignIn, onSignUp }) => {
  return (
    <section className="py-20 bg-teal-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Start Your Savings Journey Today
        </h2>
        <p className="text-xl text-teal-100 mb-10 leading-relaxed">
          Bring your group savings online with Digi बचत and manage contributions, 
          loans, and records with ease.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onSignUp}
            className="flex items-center justify-center px-8 py-4 bg-white text-teal-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Sign Up Now
          </button>
          <button 
            onClick={onSignIn}
            className="flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-teal-600 transition-colors font-medium text-lg"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;