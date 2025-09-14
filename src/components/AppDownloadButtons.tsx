import React, { useState } from 'react';
import { Download, Apple, SmartphoneNfc } from 'lucide-react';

const AppDownloadButtons: React.FC = () => {
  const [showOptions, setShowOptions] = useState(false);

  const handleAndroidDownload = () => {
    // Direct APK download
    const link = document.createElement('a');
    link.href = '/digibachat.apk'; // APK file in public folder
    link.download = 'digibachat.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleIOSDownload = () => {
    // Replace with actual App Store link when available
    window.open('https://apps.apple.com/app/digibachat', '_blank');
  };

  return (
    <div className="relative">
      {!showOptions ? (
        <button
          onClick={() => setShowOptions(true)}
          className="flex items-center justify-center px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
        >
          <Download className="w-5 h-5 mr-2" />
          Download the App
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAndroidDownload}
            className="flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            <SmartphoneNfc className="w-5 h-5 mr-2" />
            Download for Android
          </button>
          <button
            onClick={handleIOSDownload}
            className="flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            <Apple className="w-5 h-5 mr-2" />
            Download for iOS
          </button>
          <button
            onClick={() => setShowOptions(false)}
            className="absolute -top-2 -right-2 bg-gray-200 text-gray-600 rounded-full p-1 hover:bg-gray-300"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AppDownloadButtons;