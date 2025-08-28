import React, { useState } from 'react';
import { 
  IndianRupee, 
  Filter, 
  Download, 
  Search, 
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Clock
} from 'lucide-react';

const Transactions: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('30days');

  const transactions = [
    {
      id: 'TXN001',
      type: 'deposit',
      amount: 2000,
      group: 'Family Savings',
      description: 'Monthly contribution',
      date: '2025-01-15',
      time: '10:30 AM',
      status: 'completed',
      paymentMethod: 'UPI',
      transactionId: 'UPI123456789'
    },
    {
      id: 'TXN002',
      type: 'withdrawal',
      amount: 1500,
      group: 'Friends Fund',
      description: 'Emergency withdrawal',
      date: '2025-01-13',
      time: '02:15 PM',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      transactionId: 'BT987654321'
    },
    {
      id: 'TXN003',
      type: 'deposit',
      amount: 3000,
      group: 'Office Group',
      description: 'Monthly contribution',
      date: '2025-01-12',
      time: '09:45 AM',
      status: 'completed',
      paymentMethod: 'UPI',
      transactionId: 'UPI456789123'
    },
    {
      id: 'TXN004',
      type: 'deposit',
      amount: 2000,
      group: 'Family Savings',
      description: 'Monthly contribution',
      date: '2025-01-10',
      time: '11:20 AM',
      status: 'completed',
      paymentMethod: 'UPI',
      transactionId: 'UPI789123456'
    },
    {
      id: 'TXN005',
      type: 'deposit',
      amount: 1500,
      group: 'Friends Fund',
      description: 'Monthly contribution',
      date: '2025-01-08',
      time: '03:30 PM',
      status: 'completed',
      paymentMethod: 'UPI',
      transactionId: 'UPI321654987'
    },
    {
      id: 'TXN006',
      type: 'loan',
      amount: 5000,
      group: 'Family Savings',
      description: 'Personal loan',
      date: '2025-01-05',
      time: '04:45 PM',
      status: 'pending',
      paymentMethod: 'Bank Transfer',
      transactionId: 'BT654321987'
    },
    {
      id: 'TXN007',
      type: 'deposit',
      amount: 2500,
      group: 'Office Group',
      description: 'Bonus contribution',
      date: '2025-01-03',
      time: '12:15 PM',
      status: 'completed',
      paymentMethod: 'UPI',
      transactionId: 'UPI147258369'
    },
    {
      id: 'TXN008',
      type: 'repayment',
      amount: 1000,
      group: 'Friends Fund',
      description: 'Loan repayment',
      date: '2025-01-01',
      time: '06:00 PM',
      status: 'completed',
      paymentMethod: 'UPI',
      transactionId: 'UPI963852741'
    }
  ];

  const groups = ['Family Savings', 'Friends Fund', 'Office Group'];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesGroup = filterGroup === 'all' || transaction.group === filterGroup;
    const matchesSearch = searchTerm === '' || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesGroup && matchesSearch;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-red-600" />;
      case 'loan':
        return <IndianRupee className="w-5 h-5 text-blue-600" />;
      case 'repayment':
        return <ArrowDownLeft className="w-5 h-5 text-purple-600" />;
      default:
        return <IndianRupee className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600';
      case 'withdrawal':
        return 'text-red-600';
      case 'loan':
        return 'text-blue-600';
      case 'repayment':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>;
    }
  };

  const totalAmount = filteredTransactions.reduce((sum, transaction) => {
    if (transaction.type === 'deposit' || transaction.type === 'repayment') {
      return sum + transaction.amount;
    } else if (transaction.type === 'withdrawal' || transaction.type === 'loan') {
      return sum - transaction.amount;
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Deposits</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Withdrawals</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Loans</p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{transactions.filter(t => t.type === 'loan').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Net Balance</p>
              <p className={`text-2xl font-bold ${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{Math.abs(totalAmount).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            
            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="loan">Loans</option>
              <option value="repayment">Repayments</option>
            </select>
            
            {/* Group Filter */}
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Groups</option>
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            
            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
          
          <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Transaction History ({filteredTransactions.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Transaction</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Group</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Date & Time</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{transaction.type}</p>
                        <p className="text-sm text-gray-500">{transaction.description}</p>
                        <p className="text-xs text-gray-400">{transaction.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{transaction.group}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-medium ${getTransactionColor(transaction.type)}`}>
                      {(transaction.type === 'deposit' || transaction.type === 'repayment') ? '+' : '-'}
                      ₹{transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <div>
                        <p className="text-sm">{transaction.date}</p>
                        <p className="text-xs text-gray-500">{transaction.time}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm text-gray-900">{transaction.paymentMethod}</p>
                      <p className="text-xs text-gray-500">{transaction.transactionId}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transactions found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Backend Integration Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-2">
          Backend Integration - Transactions
        </h4>
        <p className="text-blue-800 mb-4">
          This transactions page is ready for backend integration with the following API endpoints:
        </p>
        <div className="bg-white rounded-lg p-4 font-mono text-sm">
          <div className="space-y-2">
            <div>• <strong>GET</strong> /api/transactions - Fetch user transactions with filters</div>
            <div>• <strong>GET</strong> /api/transactions/summary - Fetch transaction summary</div>
            <div>• <strong>POST</strong> /api/transactions/export - Export transactions to CSV/PDF</div>
            <div>• <strong>GET</strong> /api/transactions/{'{transactionId}'} - Fetch transaction details</div>
            <div>• <strong>POST</strong> /api/transactions - Create new transaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;