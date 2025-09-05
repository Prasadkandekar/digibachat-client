import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Crown, 
  Loader,
  RefreshCw,
  Award,
  Target
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

interface GroupMemberSavings {
  user_id: number;
  name: string;
  email: string;
  current_balance: number;
  role: string;
  total_contributed: number;
  total_transactions: number;
}

interface GroupSavingsData {
  group: {
    name: string;
    expected_contribution: number;
  };
  members: GroupMemberSavings[];
  total_group_savings: number;
}

interface GroupSavingsProps {
  groupId: number;
  groupName?: string;
}

const GroupSavings: React.FC<GroupSavingsProps> = ({ groupId, groupName }) => {
  const [savingsData, setSavingsData] = useState<GroupSavingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (groupId) {
      loadGroupSavings();
    }
  }, [groupId]);

  const loadGroupSavings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getGroupSavingsSummary(groupId.toString());
      
      if (response.success && response.data) {
        setSavingsData(response.data);
      } else {
        setError('Failed to load group savings data');
      }
    } catch (err) {
      console.error('Failed to load group savings:', err);
      setError('Failed to load group savings data');
      toast.error('Failed to load group savings. Please try again.');
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
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Failed to load group savings</p>
          <p className="text-sm text-gray-500">Please try refreshing</p>
        </div>
        <button
          onClick={loadGroupSavings}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors inline-flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  // Sort members by total contributed (highest first)
  const sortedMembers = [...savingsData.members].sort((a, b) => b.total_contributed - a.total_contributed);
  const topContributor = sortedMembers[0];

  const stats = [
    {
      title: 'Total Group Savings',
      value: `₹${savingsData.total_group_savings.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      description: 'Across all members'
    },
    {
      title: 'Active Members',
      value: savingsData.members.length.toString(),
      icon: Users,
      color: 'bg-blue-500',
      description: 'Contributing members'
    },
    {
      title: 'Expected Amount',
      value: `₹${savingsData.group.expected_contribution.toLocaleString()}`,
      icon: Target,
      color: 'bg-purple-500',
      description: 'Per member per cycle'
    },
    {
      title: 'Average Contribution',
      value: savingsData.members.length > 0 
        ? `₹${Math.round(savingsData.total_group_savings / savingsData.members.length).toLocaleString()}`
        : '₹0',
      icon: TrendingUp,
      color: 'bg-orange-500',
      description: 'Per member'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{groupName || savingsData.group.name} - Group Savings</h2>
            <p className="text-blue-100">Track contributions by each member</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹{savingsData.total_group_savings.toLocaleString()}</div>
            <div className="text-blue-100 text-sm">Total Collected</div>
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

      {/* Top Contributor */}
      {topContributor && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-full p-3 mr-4">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Top Contributor</h3>
              <p className="text-2xl font-bold">{topContributor.name}</p>
              <p className="text-yellow-100">₹{topContributor.total_contributed.toLocaleString()} contributed</p>
            </div>
          </div>
        </div>
      )}

      {/* Members Savings Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Member Contributions</h3>
          <button
            onClick={loadGroupSavings}
            className="text-teal-600 hover:text-teal-700 inline-flex items-center text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
        </div>

        {savingsData.members.length > 0 ? (
          <div className="space-y-4">
            {sortedMembers.map((member, index) => {
              const isTopContributor = member.user_id === topContributor?.user_id;
              const contributionPercentage = savingsData.group.expected_contribution > 0 
                ? (member.total_contributed / savingsData.group.expected_contribution) * 100 
                : 0;

              return (
                <div
                  key={member.user_id}
                  className={`border rounded-lg p-4 transition-colors ${
                    isTopContributor 
                      ? 'border-yellow-300 bg-yellow-50' 
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="flex items-center mr-3">
                        {index === 0 && (
                          <Award className="w-5 h-5 text-yellow-500 mr-2" />
                        )}
                        {member.role === 'leader' && (
                          <Crown className="w-5 h-5 text-purple-600 mr-2" />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      {member.role === 'leader' && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                          Leader
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">
                        ₹{member.total_contributed.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-500">
                        {member.total_transactions} {member.total_transactions === 1 ? 'contribution' : 'contributions'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div className="text-center">
                      <p className="text-gray-600">Current Balance</p>
                      <p className="font-semibold text-blue-600">₹{member.current_balance.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Expected vs Actual</p>
                      <p className="font-semibold text-purple-600">
                        {contributionPercentage.toFixed(0)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Share of Total</p>
                      <p className="font-semibold text-orange-600">
                        {savingsData.total_group_savings > 0 
                          ? ((member.total_contributed / savingsData.total_group_savings) * 100).toFixed(1)
                          : '0'
                        }%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isTopContributor 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                            : 'bg-gradient-to-r from-teal-500 to-blue-500'
                        }`}
                        style={{
                          width: `${Math.min(contributionPercentage, 100)}%`
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Progress towards expected: ₹{savingsData.group.expected_contribution.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">No contributions yet</h4>
            <p className="text-gray-500">Members haven't started contributing to this group</p>
          </div>
        )}
      </div>

      {/* Group Insights */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Insights</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium text-gray-900">Collection Rate</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {savingsData.members.length > 0 && savingsData.group.expected_contribution > 0
                ? `${Math.round((savingsData.total_group_savings / (savingsData.members.length * savingsData.group.expected_contribution)) * 100)}%`
                : '0%'
              }
            </p>
            <p className="text-sm text-gray-500">Of expected total</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-gray-900">Active Rate</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {savingsData.members.filter(m => m.total_contributed > 0).length}/{savingsData.members.length}
            </p>
            <p className="text-sm text-gray-500">Members contributing</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Award className="w-5 h-5 text-orange-600 mr-2" />
              <span className="font-medium text-gray-900">Best Performer</span>
            </div>
            <p className="text-lg font-bold text-orange-600">
              {topContributor ? topContributor.name.split(' ')[0] : 'N/A'}
            </p>
            <p className="text-sm text-gray-500">
              {topContributor ? `₹${topContributor.total_contributed.toLocaleString()}` : 'No contributions yet'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSavings;
