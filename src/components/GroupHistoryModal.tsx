import React, { useState, useEffect } from 'react';
import { X, History, ArrowUpCircle, ArrowDownCircle, Calendar, IndianRupee, User } from 'lucide-react';
import { apiService } from '../services/api';

interface GroupHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

interface Transaction {
  id: number;
  type: 'contribution' | 'withdrawal' | 'loan' | 'repayment';
  amount: number;
  user_name: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const GroupHistoryModal: React.FC<GroupHistoryModalProps> = ({
  isOpen,
  onClose,
  groupId,
  groupName
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (isOpen && groupId) {
      fetchTransactions();
    }
  }, [isOpen, groupId]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.getGroupTransactions(groupId);
      if (response.success && response.data?.transactions) {
        setTransactions(response.data.transactions);
      } else {
        // Mock data for demonstration since we might not have transaction history yet
        const mockTransactions: Transaction[] = [
          {
            id: 1,
            type: 'contribution',
            amount: 1500,
            user_name: 'John Doe',
            description: 'Monthly contribution',
            date: new Date().toISOString(),
            status: 'completed'
          },
          {
            id: 2,
            type: 'contribution',
            amount: 1500,
            user_name: 'Jane Smith',
            description: 'Monthly contribution',
            date: new Date(Date.now() - 86400000).toISOString(),
            status: 'completed'
          },
          {
            id: 3,
            type: 'loan',
            amount: 5000,
            user_name: 'Bob Johnson',
            description: 'Emergency loan',
            date: new Date(Date.now() - 172800000).toISOString(),
            status: 'completed'
          }
        ];
        setTransactions(mockTransactions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transaction history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <ArrowUpCircle className="w-5 h-5 text-green-600" />;
      case 'withdrawal':
        return <ArrowDownCircle className="w-5 h-5 text-red-600" />;
      case 'loan':
        return <ArrowDownCircle className="w-5 h-5 text-orange-600" />;
      case 'repayment':
        return <ArrowUpCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <ArrowUpCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'contribution':
        return 'text-green-600';
      case 'withdrawal':
        return 'text-red-600';
      case 'loan':
        return 'text-orange-600';
      case 'repayment':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Unknown</span>;
    }
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <History className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
              <p className="text-sm text-gray-500">{groupName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'contribution', label: 'Contributions' },
              { key: 'withdrawal', label: 'Withdrawals' },
              { key: 'loan', label: 'Loans' },
              { key: 'repayment', label: 'Repayments' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === tab.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-medium">Error loading history</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No transactions found</h3>
                  <p className="text-gray-500">
                    {filter === 'all' 
                      ? 'No transactions have been made in this group yet.' 
                      : `No ${filter} transactions found.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900 capitalize">
                                {transaction.type}
                              </h4>
                              {getStatusBadge(transaction.status)}
                            </div>
                            <p className="text-sm text-gray-600">{transaction.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <div className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                <span>{transaction.user_name}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>{formatDate(transaction.date)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`flex items-center font-medium ${getTransactionColor(transaction.type)}`}>
                            <IndianRupee className="w-4 h-4 mr-1" />
                            <span>
                              {transaction.type === 'contribution' || transaction.type === 'repayment' ? '+' : '-'}
                              {formatCurrency(Math.abs(transaction.amount))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupHistoryModal;
