import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

interface UPISetupModalProps {
  onClose: () => void;
  groupId: string;
  onSuccess: () => void;
}

const UPISetupModal: React.FC<UPISetupModalProps> = ({ onClose, groupId, onSuccess }) => {
  const [upiId, setUpiId] = useState('');
  const [upiName, setUpiName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateUPIId = (id: string) => {
    const upiIdRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiIdRegex.test(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!validateUPIId(upiId)) {
        setError('Please enter a valid UPI ID (e.g., yourname@paytm)');
        return;
      }

      if (!upiName.trim()) {
        setError('Please enter your UPI display name');
        return;
      }

      const response = await apiService.updateGroupUPIDetails(groupId, upiId, upiName.trim());
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(response.message || 'Failed to update UPI details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update UPI details');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-green-600 mb-2">Success!</h2>
            <p className="text-gray-600">UPI details updated successfully</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-4">Setup UPI Payment</h2>
        <p className="text-gray-600 mb-6">
          Configure your UPI details to enable group members to make contributions via UPI.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID *
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@paytm, yourname@ybl, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your UPI ID (e.g., yourname@paytm, yourname@ybl, yourname@okaxis)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name *
            </label>
            <input
              type="text"
              value={upiName}
              onChange={(e) => setUpiName(e.target.value)}
              placeholder="Your name as it appears in UPI"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This name will be shown to members when they make payments
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !upiId || !upiName}
              className={`flex-1 py-2 px-4 text-white font-medium rounded-lg ${
                isLoading || !upiId || !upiName
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {isLoading ? 'Saving...' : 'Save UPI Details'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Popular UPI Apps:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
            <div>• Google Pay (@okaxis)</div>
            <div>• PhonePe (@ybl)</div>
            <div>• Paytm (@paytm)</div>
            <div>• BHIM (@upi)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPISetupModal;
