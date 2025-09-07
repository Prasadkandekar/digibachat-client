import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ContributeModalProps {
  onClose: () => void;
  onSubmit: (paymentMethod: string) => Promise<void>;
  amount: number;
  groupName: string;
}

const ContributeModal: React.FC<ContributeModalProps> = ({ onClose, onSubmit, amount, groupName }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      await onSubmit(selectedMethod);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
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
              <div className="text-red-600 text-sm mt-2">{error}</div>
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
      </div>
    </div>
  );
};

export default ContributeModal;
