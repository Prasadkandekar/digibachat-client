import React, { useState } from 'react';
import { X } from 'lucide-react';
import { apiService } from '../services/api';
import { toast } from 'react-hot-toast';

interface LoanRequestModalProps {
  groupId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const LoanRequestModal: React.FC<LoanRequestModalProps> = ({ groupId, onClose, onSuccess }) => {
  const [amount, setAmount] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!purpose.trim()) {
      setError('Please enter the purpose of the loan');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiService.createLoanRequest(groupId, {
        amount: Number(amount),
        purpose: purpose.trim()
      });

      if (response.success) {
        toast.success('Loan request submitted successfully');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(response.message || 'Failed to submit loan request');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your loan request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Request a Loan</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Loan Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter amount"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
              Purpose
            </label>
            <textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Explain the purpose of this loan"
              rows={3}
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Loan Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanRequestModal;