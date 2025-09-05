import React, { useState, useEffect } from 'react';
import { 
  PiggyBank, 
  TrendingUp, 
  Users, 
  Calendar,
  DollarSign,
  ArrowUpRight,
  Loader
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

interface TotalSavingsData {
  total_savings: number;
  groups_contributed_to: number;
  total_contributions: number;
  group_breakdown: Array<{
    group_name: string;
    group_id: number;
    expected_amount: number;
    savings_frequency: string;
    total_contributed: number;
    contributions_count: number;
    current_balance: number;
  }>;
}

const TotalSavings: React.FC = () => {
  const [savingsData, setSavingsData] = useState<TotalSavingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadTotalSavings();
  }, []);

  const loadTotalSavings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUserTotalSavings();
      
      if (response.success && response.data) {
        setSavingsData(response.data);
      } else {
        setError('Failed to load savings data');
      }
    } catch (err) {
      console.error('Failed to load total savings:', err);
      setError('Failed to load savings data');
      toast.error('Failed to load your savings data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error || !savingsData) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <PiggyBank className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Failed to load savings data</p>
          <p className="text-sm text-gray-500">Please try refreshing the page</p>
        </div>
        <button
          onClick={loadTotalSavings}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Savings',
      value: `₹${savingsData.total_savings.toLocaleString()}`,
      icon: PiggyBank,
      color: 'bg-green-500',
      description: 'Across all groups'
    },
    {
      title: 'Groups Active',
      value: savingsData.groups_contributed_to.toString(),
      icon: Users,
      color: 'bg-blue-500',
      description: 'Contributing to'
    },
    {
      title: 'Total Contributions',
      value: savingsData.total_contributions.toString(),
      icon: TrendingUp,
      color: 'bg-purple-500',
      description: 'Transactions made'
    },
    {
      title: 'Average per Group',
      value: savingsData.groups_contributed_to > 0 
        ? `₹${Math.round(savingsData.total_savings / savingsData.groups_contributed_to).toLocaleString()}`
        : '₹0',
      icon: DollarSign,
      color: 'bg-orange-500',
      description: 'Average contribution'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Total Savings Overview</h1>
            <p className="text-teal-100">Track your savings progress across all groups</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹{savingsData.total_savings.toLocaleString()}</div>
            <div className="text-teal-100 text-sm">Total Saved</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Group Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Savings by Group</h3>
          <div className="text-sm text-gray-500">
            {savingsData.group_breakdown.length} active {savingsData.group_breakdown.length === 1 ? 'group' : 'groups'}
          </div>
        </div>

        {savingsData.group_breakdown.length > 0 ? (
          <div className="space-y-4">
            {savingsData.group_breakdown.map((group) => (
              <div
                key={group.group_id}
                className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{group.group_name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{group.savings_frequency} contributions</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-green-600">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      <span className="font-semibold">₹{group.total_contributed.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500">{group.contributions_count} contributions</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Expected Amount</p>
                    <p className="font-semibold text-gray-900">₹{group.expected_amount.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Current Balance</p>
                    <p className="font-semibold text-blue-600">₹{group.current_balance.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Contribution Rate</p>
                    <p className="font-semibold text-purple-600">
                      {group.expected_amount > 0 ? 
                        `${Math.round((group.total_contributed / group.expected_amount) * 100)}%` : 
                        '0%'
                      }
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((group.total_contributed / (group.expected_amount || 1)) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <PiggyBank className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">No savings yet</h4>
            <p className="text-gray-500">Start contributing to groups to see your savings here</p>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Insights</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-gray-900">Monthly Average</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ₹{savingsData.total_contributions > 0 ? 
                Math.round(savingsData.total_savings / Math.max(savingsData.total_contributions, 1)).toLocaleString() : 
                '0'
              }
            </p>
            <p className="text-sm text-gray-500">Per contribution</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium text-gray-900">Savings Goal</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {savingsData.groups_contributed_to > 0 ? 'On Track' : 'Get Started'}
            </p>
            <p className="text-sm text-gray-500">
              {savingsData.groups_contributed_to} {savingsData.groups_contributed_to === 1 ? 'group' : 'groups'} active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalSavings;
