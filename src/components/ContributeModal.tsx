import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

interface ContributeModalProps {
  onClose: () => void;
  onSubmit: (paymentMethod: string) => Promise<void>;
  amount: number;
  groupName: string;
  groupId: string;
}

interface UPIPaymentData {
  transactionId: number;
  upiTransactionId: string;
  upiLink: string;
  qrCode: string;
  amount: number;
  groupName: string;
  leaderName: string;
  note: string;
}

const ContributeModal: React.FC<ContributeModalProps> = ({ onClose, onSubmit, amount, groupName, groupId }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [upiPaymentData, setUpiPaymentData] = useState<UPIPaymentData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'initiated' | 'completed' | 'failed'>('pending');
  const [copied, setCopied] = useState(false);
  const [verificationInterval, setVerificationInterval] = useState<NodeJS.Timeout | null>(null);
  const [showPaymentCompleted, setShowPaymentCompleted] = useState(false);

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦' }
  ];

  // Generate UPI payment link
  const generateUPIPayment = async () => {
    try {
      setIsProcessing(true);
      setError('');
      
      const response = await apiService.request(
        'http://localhost:5000/api/transactions',
        `/groups/${groupId}/upi-payment`,
        { method: 'POST' }
      );

      if (response.success) {
        setUpiPaymentData(response.data);
        setPaymentStatus('initiated');
        startPaymentVerification(response.data.transactionId);
      } else {
        setError(response.message || 'Failed to generate UPI payment');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate UPI payment');
    } finally {
      setIsProcessing(false);
    }
  };

  // Start payment verification polling
  const startPaymentVerification = (transactionId: number) => {
    const interval = setInterval(async () => {
      try {
        const response = await apiService.request(
          'https://digibachat.onrender.com/api/transactions',
          `/transactions/${transactionId}/verify-upi`,
          { method: 'GET' }
        );

        if (response.success) {
          if (response.data.status === 'completed') {
            setPaymentStatus('completed');
            clearInterval(interval);
            setVerificationInterval(null);
            // Call the original onSubmit to update parent component
            await onSubmit('upi');
            setTimeout(() => onClose(), 2000); // Close modal after 2 seconds
          } else if (response.data.upiStatus === 'failed') {
            setPaymentStatus('failed');
            clearInterval(interval);
            setVerificationInterval(null);
          }
          // Keep checking if status is still 'initiated' or 'pending'
        }
      } catch (err) {
        console.error('Payment verification error:', err);
      }
    }, 5000); // Check every 5 seconds

    setVerificationInterval(interval);
  };

  // Copy UPI link to clipboard
  const copyUPILink = async () => {
    if (upiPaymentData?.upiLink) {
      try {
        await navigator.clipboard.writeText(upiPaymentData.upiLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy UPI link:', err);
      }
    }
  };

  // Open UPI app
  const openUPIApp = () => {
    if (upiPaymentData?.upiLink) {
      window.open(upiPaymentData.upiLink, '_blank');
    }
  };

  // Handle manual payment completion
  const handlePaymentCompleted = async () => {
    if (!upiPaymentData) return;
    
    try {
      setIsProcessing(true);
      setError('');
      
      // Call the complete payment API
      const response = await apiService.completeUPIPayment(upiPaymentData.transactionId.toString());
      
      if (response.success) {
        setPaymentStatus('completed');
        // Call the original onSubmit to update parent component
        await onSubmit('upi');
        setTimeout(() => onClose(), 2000); // Close modal after 2 seconds
      } else {
        setError(response.message || 'Failed to complete payment');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete payment');
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-detection: Check if user returns to app after opening UPI
  useEffect(() => {
    if (paymentStatus === 'initiated' && upiPaymentData) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          // User returned to the app, they might have completed payment
          setTimeout(() => {
            setShowPaymentCompleted(true);
          }, 2000); // Show button after 2 seconds
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [paymentStatus, upiPaymentData]);

  // Cleanup verification interval on unmount
  useEffect(() => {
    return () => {
      if (verificationInterval) {
        clearInterval(verificationInterval);
      }
    };
  }, [verificationInterval]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      if (selectedMethod === 'upi') {
        await generateUPIPayment();
      } else {
        await onSubmit(selectedMethod);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-4">Make Contribution</h2>
        <p className="text-gray-600 mb-6">
          Contributing ₹{amount} to {groupName}
        </p>

        {!upiPaymentData ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 border rounded-lg text-center ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{method.icon}</span>
                      <span className="block text-sm font-medium">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 px-4 text-white font-medium rounded-lg ${
                  isProcessing
                    ? 'bg-teal-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Proceed to Pay'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Payment Status */}
            <div className="text-center">
              {paymentStatus === 'initiated' && (
                <div className="flex items-center justify-center text-blue-600 mb-2">
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  <span className="font-medium">Payment Initiated</span>
                </div>
              )}
              {paymentStatus === 'completed' && (
                <div className="flex items-center justify-center text-green-600 mb-2">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Payment Completed!</span>
                </div>
              )}
              {paymentStatus === 'failed' && (
                <div className="flex items-center justify-center text-red-600 mb-2">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Payment Failed</span>
                </div>
              )}
            </div>

            {/* UPI Payment Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">UPI Payment</h3>
                <p className="text-2xl font-bold text-teal-600">₹{upiPaymentData.amount}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Pay to: {upiPaymentData.leaderName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {upiPaymentData.note}
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <img 
                    src={upiPaymentData.qrCode} 
                    alt="UPI QR Code" 
                    className="w-48 h-48"
                  />
                </div>
              </div>

              {/* UPI Link */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  UPI Payment Link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={upiPaymentData.upiLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                  />
                  <button
                    onClick={copyUPILink}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <button
                    onClick={openUPIApp}
                    className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open UPI App
                  </button>
                  <button
                    onClick={() => {
                      setUpiPaymentData(null);
                      setPaymentStatus('pending');
                      if (verificationInterval) {
                        clearInterval(verificationInterval);
                        setVerificationInterval(null);
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
                
                {/* Payment Completed Button */}
                {paymentStatus === 'initiated' && (
                  <div className="text-center">
                    {showPaymentCompleted ? (
                      <div className="space-y-2">
                        <button
                          onClick={handlePaymentCompleted}
                          disabled={isProcessing}
                          className={`w-full py-3 px-4 text-white font-medium rounded-lg ${
                            isProcessing
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {isProcessing ? 'Processing...' : '✓ I Have Completed the Payment'}
                        </button>
                        <p className="text-xs text-gray-500">
                          Click this button after completing the payment in your UPI app
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Complete the payment in your UPI app, then return here
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span>Waiting for payment completion...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium mb-1">How to pay:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Scan the QR code with your UPI app</li>
                  <li>Or click "Open UPI App" to pay directly</li>
                  <li>Or copy the UPI link and paste in your UPI app</li>
                  <li>Complete the payment in your UPI app</li>
                  <li>Click "I Have Completed the Payment" button</li>
                  <li>Group leader will verify and confirm the payment</li>
                </ol>
              </div>

              {/* Payment Status Info */}
              {paymentStatus === 'initiated' && (
                <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">Payment Status:</p>
                  <p>Payment initiated. After completing the payment in your UPI app, the group leader will verify and confirm the payment.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributeModal;
