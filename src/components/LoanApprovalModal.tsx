import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { apiService } from '../services/api';
import { toast } from 'react-hot-toast';
import { LoanRequest } from '../services/api';

interface LoanApprovalModalProps {
  groupId: string;
  loan: LoanRequest;
  onClose: () => void;
  onSuccess?: () => void;
}

const LoanApprovalModal: React.FC<LoanApprovalModalProps> = ({ groupId, loan, onClose, onSuccess }) => {
  const [dueDate, setDueDate] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!dueDate) {
      setError('Please select a due date');
      return;
    }

    if (!interestRate || isNaN(Number(interestRate)) || Number(interestRate) < 0) {
      setError('Please enter a valid interest rate');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiService.approveLoanRequest(groupId, loan.id.toString(), {
        due_date: dueDate,
        interest_rate: Number(interestRate)
      });

      if (response.success) {
        toast.success('Loan request approved successfully');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(response.message || 'Failed to approve loan request');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while approving the loan request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this loan request?')) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiService.rejectLoanRequest(groupId, loan.id.toString());

      if (response.success) {
        toast.success('Loan request rejected');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(response.message || 'Failed to reject loan request');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while rejecting the loan request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate minimum due date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Approve Loan Request</h2>
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
                <span className="text-gray-500">Requested By:</span>
                <p className="font-medium">{loan.user_name}</p>
              </div>
              <div>
                <span className="text-gray-500">Amount:</span>
                <p className="font-medium">₹{loan.amount.toFixed(2)}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Purpose:</span>
                <p className="font-medium">{loan.purpose}</p>
              </div>
              <div>
                <span className="text-gray-500">Requested On:</span>
                <p className="font-medium">{new Date(loan.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleApprove} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Repayment Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={minDate}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  required
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
                Interest Rate (%)
              </label>
              <input
                type="number"
                id="interestRate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter interest rate"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="pt-4 flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Approve Loan'}
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isSubmitting}
                className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoanApprovalModal;