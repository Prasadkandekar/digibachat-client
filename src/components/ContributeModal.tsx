import React, { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, CheckCircle,  AlertCircle } from 'lucide-react';
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
  const [manualUpiId, setManualUpiId] = useState('');

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
        'https://digibachat.onrender.com/api/transactions',
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

  // Handle manual payment completion
  const handlePaymentCompleted = async () => {
    if (!upiPaymentData) return;
    
    if (!manualUpiId.trim()) {
      setError('Please enter the UPI transaction ID');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError('');
      
      // Call the complete payment API with manual UPI ID
      const response = await apiService.completeUPIPayment(
        upiPaymentData.transactionId.toString(),
        { upiTransactionId: manualUpiId.trim() }
      );
      
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

        <h2 className="text-2xl font-bold mb-6 text-center">Contribute to {groupName}</h2>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800">Contribution Amount: ₹{amount}</h3>
          </div>

          {/* UPI Payment Flow */}
          {selectedMethod === 'upi' && paymentStatus === 'pending' && !upiPaymentData && (
            <div className="space-y-4 mt-4">
              <button
                type="button"
                onClick={generateUPIPayment}
                disabled={isProcessing}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isProcessing ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isProcessing ? 'Generating UPI...' : 'Pay via UPI'}
              </button>
              <p className="text-xs text-gray-500 text-center">Click to generate a UPI QR code and payment link.</p>
            </div>
          )}

          {/* Show QR code and UPI link after generation */}
          {selectedMethod === 'upi' && upiPaymentData && paymentStatus === 'initiated' && (
            <div className="space-y-4 mt-4">
              <h3 className="text-lg font-medium mb-2 text-center">Scan & Pay via UPI</h3>
              <div className="flex flex-col items-center">
                {upiPaymentData.qrCode && (
                  <img
                    src={upiPaymentData.qrCode}
                    alt="UPI QR Code"
                    className="w-40 h-40 object-contain border rounded mb-2"
                  />
                )}
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={upiPaymentData.upiLink}
                    readOnly
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                  <button
                    onClick={copyUPILink}
                    className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={upiPaymentData.upiLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-gray-500 text-center">Scan the QR code or use the UPI link to pay.</p>
              </div>
              {/* Show transaction ID input after payment */}
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Enter UPI Transaction ID</h3>
                <input
                  type="text"
                  id="manualUpiId"
                  value={manualUpiId}
                  onChange={(e) => setManualUpiId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter UPI transaction ID"
                  disabled={isProcessing}
                />
                <p className="mt-1 text-xs text-gray-500">
                  After payment, enter the UPI transaction ID from your payment app. The group leader will verify this transaction.
                </p>
                <button
                  type="button"
                  onClick={handlePaymentCompleted}
                  disabled={isProcessing || !manualUpiId.trim()}
                  className={`w-full flex justify-center py-2 px-4 mt-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isProcessing || !manualUpiId.trim()
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isProcessing ? 'Submitting...' : 'Submit Transaction ID'}
                </button>
              </div>
            </div>
          )}

          {/* Payment completed message */}
          {paymentStatus === 'completed' && (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-green-700 mb-1">Payment Submitted for Verification</h3>
              <p className="text-sm text-gray-600">
                Your transaction ID has been submitted. The group leader will verify your payment shortly.
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributeModal;
