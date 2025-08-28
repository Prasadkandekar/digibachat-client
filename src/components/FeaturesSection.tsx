import React from 'react';
import { Shield, Eye, Bell } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Easy Group Management',
      description: 'Create, join, and manage savings groups digitally without paperwork or manual tracking.',
    },
    {
      icon: Eye,
      title: 'Seamless Transactions',
      description: 'Contribute and lend securely using UPI with automatic record-keeping. Track contributions, loans, and repayments in real time with nothing hidden.',
    },
    {
      icon: Bell,
      title: 'Organized Record-Keeping',
      description: 'Maintain accurate digital records of all activities, accessible anytime, anywhere.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-green-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Digi <span className="text-gray-700">बचत</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the power of bringing the Bachat Gat system online with complete 
            convenience and security. DigiBachat is designed to simplify every step of group 
            savings and lending so you can focus on growing together.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;