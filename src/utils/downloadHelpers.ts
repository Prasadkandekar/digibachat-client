// Function to handle APK download
export const downloadAPK = () => {
  const link = document.createElement('a');
  link.href = '/digibachat_app.apk';
  link.download = 'digibachat_app.apk';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to handle iOS App Store redirect
export const openAppStore = () => {
  // Replace this URL with your actual App Store URL when available
//   window.open('https://apps.apple.com/app/digibachat', '_blank');
    downloadAPK();
};

// Function to handle Play Store redirect
export const openPlayStore = () => {
  // For now, trigger APK download. Replace with Play Store URL when available
  downloadAPK();
  // When Play Store link is available, uncomment this:
  // window.open('https://play.google.com/store/apps/details?id=com.digibachat', '_blank');
};