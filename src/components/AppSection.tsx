import React from 'react';
import { Apple, Play, Check, Star } from 'lucide-react';

const AppSection: React.FC = () => {
  const features = [
    'Instant notifications for all transactions',
    'Real-time savings and loan tracking',
    'Secure UPI payments integration',
    'Offline access to transaction history'
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="lg:pr-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Get the <span className="text-teal-600">Digi बचत</span> App
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Download our mobile app and take control of your group savings and 
              lending journey. Available on both iOS and Android platforms.
            </p>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                <Apple className="w-6 h-6 mr-3" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              <button className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                <Play className="w-6 h-6 mr-3" />
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-600">4.8/5 rating with 2,500+ reviews</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <img src="/images/landing.png" alt="App Image" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppSection;