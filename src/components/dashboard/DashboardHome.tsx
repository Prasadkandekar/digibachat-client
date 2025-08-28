import React from 'react';
import { 
  PiggyBank, 
  Users, 
  TrendingUp, 
  Calendar, 
  IndianRupee
} from 'lucide-react';

const DashboardHome: React.FC = () => {
  const stats = [
    {
      title: 'Total Savings',
      value: '₹25,430',
      change: '+12%',
      icon: PiggyBank,
      color: 'bg-green-500'
    },
    {
      title: 'Active Groups',
      value: '3',
      change: '+1',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Monthly Growth',
      value: '₹2,340',
      change: '+8%',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Next Payment',
      value: '5 days',
      change: 'Due Soon',
      icon: Calendar,
      color: 'bg-orange-500'
    }
  ];

  const recentTransactions = [
    { id: 1, type: 'deposit', group: 'Family Savings', amount: '₹2,000', date: '2025-01-15' },
    { id: 2, type: 'withdrawal', group: 'Friends Fund', amount: '₹1,500', date: '2025-01-13' },
    { id: 3, type: 'deposit', group: 'Office Group', amount: '₹3,000', date: '2025-01-12' },
  ];

  const groups = [
    { id: '1', name: 'Family Savings', members: 8, balance: '₹15,420', nextPayment: '₹2,000', code: 'FAM001' },
    { id: '2', name: 'Friends Fund', members: 5, balance: '₹7,830', nextPayment: '₹1,500', code: 'FRD002' },
    { id: '3', name: 'Office Group', members: 12, balance: '₹2,180', nextPayment: '₹3,000', code: 'OFF003' },
  ];

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Savings Groups */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Savings Groups</h3>
            <button className="text-teal-600 hover:text-teal-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {groups.map((group, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-teal-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{group.name}</h4>
                  <span className="text-sm text-gray-500">{group.members} members</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Balance: {group.balance}</span>
                  <span className="text-sm text-teal-600">Next: {group.nextPayment}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Group Code: {group.code}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-teal-600 hover:text-teal-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <IndianRupee className={`w-5 h-5 ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{transaction.group}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <span className={`font-medium ${
                  transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;