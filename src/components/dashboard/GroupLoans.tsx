import React, { useState, useEffect } from 'react';
import { IndianRupee , AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { apiService } from '../../services/api';
import { LoanRequest } from '../../services/api';
import LoanRequestModal from '../LoanRequestModal';
import LoanApprovalModal from '../LoanApprovalModal';
import LoanRepaymentModal from '../LoanRepaymentModal';

interface GroupLoansProps {
  groupId: string;
  isLeader: boolean;
}

const GroupLoans: React.FC<GroupLoansProps> = ({ groupId, isLeader }) => {
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [showRepaymentModal, setShowRepaymentModal] = useState<boolean>(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null);

  const fetchLoans = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiService.getGroupLoanRequests(groupId);
      if (response.success && response.data) {
        setLoans(response.data.loans || []);
      } else {
        setError(response.message || 'Failed to fetch loans');
        setLoans([]);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching loans');
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [groupId]);

  const handleLoanRequestSuccess = () => {
    fetchLoans();
  };

  const handleApprove = (loan: LoanRequest) => {
    setSelectedLoan(loan);
    setShowApprovalModal(true);
  };

  const handleRepay = (loan: LoanRequest) => {
    setSelectedLoan(loan);
    setShowRepaymentModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      case 'repaid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Repaid
          </span>
        );
      default:
        return null;
    }
  };

  const getRepaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'not_started':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Not Started
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Partial
          </span>
        );
      case 'complete':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Complete
          </span>
        );
      default:
        return null;
    }
  };

  const isLoanOverdue = (loan: LoanRequest) => {
    if (!loan || !loan.due_date || loan.status !== 'approved' || loan.repayment_status === 'complete') {
      return false;
    }

    const dueDate = new Date(loan.due_date);
    const today = new Date();
    return today > dueDate;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Group Loans</h3>
        <button
          onClick={() => setShowRequestModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <IndianRupee  className="w-4 h-4 mr-1" />
          Request Loan
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading loans...</p>
        </div>
      ) : loans.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <IndianRupee  className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No loans</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by requesting a loan.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {isLeader && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Repayment
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan.id} className={isLoanOverdue(loan) ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {loan.user_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   ₹ {loan.amount ? Number(loan.amount).toFixed(2) : '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {loan.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusBadge(loan.status)}
                  </td>
                  {isLeader && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {loan.status === 'approved' && getRepaymentStatusBadge(loan.repayment_status)}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : '-'}
                    {isLoanOverdue(loan) && (
                      <span className="ml-2 text-xs text-red-600 font-medium">OVERDUE</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {isLeader && loan.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(loan)}
                        className="text-teal-600 hover:text-teal-900 mr-4"
                      >
                        Approve
                      </button>
                    )}
                    {loan.status === 'approved' && loan.repayment_status !== 'complete' && (
                      <button
                        onClick={() => handleRepay(loan)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Repay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showRequestModal && (
        <LoanRequestModal
          groupId={groupId}
          onClose={() => setShowRequestModal(false)}
          onSuccess={handleLoanRequestSuccess}
        />
      )}

      {showApprovalModal && selectedLoan && (
        <LoanApprovalModal
          groupId={groupId}
          loan={selectedLoan}
          onClose={() => setShowApprovalModal(false)}
          onSuccess={handleLoanRequestSuccess}
        />
      )}

      {showRepaymentModal && selectedLoan && (
        <LoanRepaymentModal
          loan={selectedLoan}
          onClose={() => setShowRepaymentModal(false)}
          onSuccess={handleLoanRequestSuccess}
        />
      )}
    </div>
  );
};

export default GroupLoans;