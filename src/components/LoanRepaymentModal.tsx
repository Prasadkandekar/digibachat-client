import React, { useState } from 'react';
import { X } from 'lucide-react';
import { apiService } from '../services/api';
import { toast } from 'react-hot-toast';
import { LoanRequest } from '../services/api';

interface LoanRepaymentModalProps {
  loan: LoanRequest;
  onClose: () => void;
  onSuccess?: () => void;
}

const LoanRepaymentModal: React.FC<LoanRepaymentModalProps> = ({ loan, onClose, onSuccess }) => {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate input
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiService.makeLoanRepayment(loan.id.toString(), {
        amount: Number(amount)
      });

      if (response.success) {
        toast.success('Loan repayment submitted successfully');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(response.message || 'Failed to submit loan repayment');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your loan repayment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate remaining amount to be paid
  const calculateRemainingAmount = () => {
    // This is a placeholder - in a real app, you would get this from the backend
    // For now, we'll just show the full amount if it's not fully repaid
    if (loan.repayment_status === 'complete') {
      return 0;
    }
    
    // If there's interest, include it in the calculation
    const interestAmount = loan.interest_rate ? (loan.amount * loan.interest_rate / 100) : 0;
    const penaltyAmount = loan.penalty_amount || 0;
    
    return loan.amount + interestAmount + penaltyAmount;
  };

  const remainingAmount = calculateRemainingAmount();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Repay Loan</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Loan Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Principal Amount:</span>
                <p className="font-medium">${loan.amount.toFixed(2)}</p>
              </div>
              {loan.interest_rate && (
                <div>
                  <span className="text-gray-500">Interest Rate:</span>
                  <p className="font-medium">{loan.interest_rate}%</p>
                </div>
              )}
              {loan.due_date && (
                <div>
                  <span className="text-gray-500">Due Date:</span>
                  <p className="font-medium">{new Date(loan.due_date).toLocaleDateString()}</p>
                </div>
              )}
              {loan.penalty_amount && loan.penalty_amount > 0 && (
                <div>
                  <span className="text-gray-500">Penalty Amount:</span>
                  <p className="font-medium text-red-600">${loan.penalty_amount.toFixed(2)}</p>
                </div>
              )}
              <div className="col-span-2">
                <span className="text-gray-500">Repayment Status:</span>
                <p className="font-medium">
                  {loan.repayment_status === 'not_started' && 'Not Started'}
                  {loan.repayment_status === 'partial' && 'Partially Repaid'}
                  {loan.repayment_status === 'complete' && 'Fully Repaid'}
                </p>
              </div>
              {remainingAmount > 0 && (
                <div className="col-span-2 pt-2">
                  <span className="text-gray-500">Remaining Amount:</span>
                  <p className="font-medium text-lg">${remainingAmount.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          {loan.repayment_status !== 'complete' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Repayment Amount
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
                  max={remainingAmount}
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Submit Repayment'}
                </button>
              </div>
            </form>
          )}

          {loan.repayment_status === 'complete' && (
            <div className="bg-green-50 text-green-600 p-4 rounded-md text-center">
              <p className="font-medium">This loan has been fully repaid.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanRepaymentModal;