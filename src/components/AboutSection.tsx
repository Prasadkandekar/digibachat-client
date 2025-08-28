import React from 'react';

const AboutSection: React.FC = () => {
  const features = [
    {
      number: '100%',
      title: 'Digital Bachat Gat',
      highlight: 'teal'
    },
    {
      number: 'UPI',
      title: 'Secure Payments',
      highlight: 'teal'
    },
    {
      number: '24/7',
      title: 'Access Anywhere',
      highlight: 'teal'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              About Digi <span className="text-gray-700">बचत</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Digi बचत brings the traditional Bachat Gat concept into the digital world, 
              making group savings and lending simple, transparent, and fully online. 
              With Digi बचत, communities can create and manage savings groups, 
              contribute securely through UPI, keep accurate transaction records, and 
              track their financial progress in real time. Our platform ensures that every 
              contribution, loan, and repayment is easy to manage, accessible from 
              anywhere, and recorded safely — empowering groups to save together and 
              grow financially with confidence.
            </p>
            
            <div className="grid grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold text-teal-600 mb-2`}>
                    {feature.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {feature.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center">
            {/* Community illustration */}
            <img src="/images/group.png" alt="Community savings group" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;