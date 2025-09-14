import React from 'react';
import { Check } from 'lucide-react';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Freemium',
      price: '₹0',
      period: '/month',
      description: 'Perfect for small savings groups',
      features: [
        'Up to ₹10,000 total group savings',
        'Basic group management',
        'UPI payment tracking',
        'Essential reporting',
        'Mobile app access',
        'Email support'
      ],
      savings: 'Up to ₹10,000',
      buttonText: 'Get Started',
      popular: false,
    },
    {
      name: 'Plus',
      price: '₹50',
      period: '/group/month',
      description: 'Ideal for growing savings groups',
      features: [
        'Up to ₹1,00,000 total group savings',
        'Advanced group analytics',
        'Priority support',
        'Custom reports',
        'Multiple payment methods',
        'Enhanced security features'
      ],
      savings: 'Up to ₹1,00,000',
      buttonText: 'Choose Plus',
      popular: true,
    },
    {
      name: 'Premium',
      price: '₹99',
      period: '/group/month',
      description: 'For large savings communities',
      features: [
        'Unlimited group savings',
        'Advanced analytics & insights',
        '24/7 Priority support',
        'Custom integrations',
        'Multi-admin features',
        'Enterprise security'
      ],
      savings: 'Above ₹1,00,000',
      buttonText: 'Go Premium',
      popular: false,
    }
  ];

  return (
    <section id="pricing" className="py-16 bg-gradient-to-b from-teal-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose the Perfect Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Flexible pricing options to support your group's financial journey, from small savings to large communities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl shadow-lg bg-white p-8 ${
                plan.popular ? 'ring-2 ring-teal-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className="inline-block bg-teal-500 text-white px-4 py-1 text-sm font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-center justify-center mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <div className="bg-teal-50 rounded-lg p-3 mb-6">
                  <p className="text-teal-700 font-medium">
                    Total Savings: {plan.savings}
                  </p>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-teal-50 text-teal-900 hover:bg-teal-100'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;