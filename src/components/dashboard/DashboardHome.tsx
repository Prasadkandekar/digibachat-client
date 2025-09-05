import React, { useState, useEffect } from 'react';
import { 
  PiggyBank, 
  Users, 
  Plus, 
  UserPlus,
  Search,
  Calendar,
  ArrowDownLeft
} from 'lucide-react';
import { Group } from '../../types/group';
import { groupService } from '../../services/groupService';
import CreateGroupModal from '../CreateGroupModal';
import JoinGroupModal from '../JoinGroupModal';
import ContributeModal from '../ContributeModal';
import GroupMembersModal from '../GroupMembersModal';
import GroupHistoryModal from '../GroupHistoryModal';
import InviteMembersModal from '../InviteMembersModal';
import { useToast } from '../../contexts/ToastContext';
import { apiService } from '../../services/api';

const DashboardHome: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedGroupForContribution, setSelectedGroupForContribution] = useState<Group | null>(null);
  const [selectedGroupForModal, setSelectedGroupForModal] = useState<Group | null>(null);
  const [totalSavings, setTotalSavings] = useState(0);
  const [actualTotalSavings, setActualTotalSavings] = useState(0);
  const [userName, setUserName] = useState('');
  const toast = useToast();

  useEffect(() => {
    loadUserGroups();
    loadActualTotalSavings();
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.success && response.data) {
        setUserName(response.data.name);
      }
    } catch (error) {
      console.error('Failed to load user name:', error);
    }
  };

  const loadUserGroups = async () => {
    try {
      setLoading(true);
      const userGroups = await groupService.getMyGroups();
      setGroups(userGroups);
      
      // Calculate total savings across all groups (actual contributed amounts)
      // Note: This shows monthly contribution amounts. For actual savings, we'd need member balance data
      const savings = userGroups.reduce((total: number, group: Group) => {
        // Ensure we're working with numbers, not strings
        const amount = typeof group.savings_amount === 'string' 
          ? parseFloat(group.savings_amount) || 0
          : (group.savings_amount || 0);
        return total + amount;
      }, 0);
      setTotalSavings(savings);
    } catch (error) {
      console.error('Failed to load groups:', error);
      toast.error('Failed to load your groups. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const loadActualTotalSavings = async () => {
    try {
      const response = await apiService.getUserTotalSavings();
      if (response.success && response.data) {
        setActualTotalSavings(response.data.total_savings);
      }
    } catch (error) {
      console.error('Failed to load actual total savings:', error);
      // Don't show error toast for this as it's not critical
    }
  };

  const stats = [
    {
      title: 'Total Savings',
      value: `₹${actualTotalSavings.toLocaleString()}`,
      icon: PiggyBank,
      color: 'bg-green-500',
      description: 'Actual amount saved'
    },
    {
      title: 'Monthly Commitments',
      value: `₹${totalSavings.toLocaleString()}`,
      icon: PiggyBank,
      color: 'bg-teal-500',
      description: 'Total monthly contributions'
    },
    {
      title: 'Groups Joined',
      value: groups.length.toString(),
      icon: Users,
      color: 'bg-blue-500',
      description: 'Active savings groups'
    },
    {
      title: 'Create Group',
      value: 'Start',
      icon: Plus,
      color: 'bg-orange-500',
      description: 'New savings group',
      action: () => setShowCreateModal(true)
    },
    {
      title: 'Join Group',
      value: 'Enter Code',
      icon: UserPlus,
      color: 'bg-purple-500',
      description: 'Join existing group',
      action: () => setShowJoinModal(true)
    }
  ];

  const handleCreateGroupSuccess = async () => {
    try {
      await loadUserGroups();
      await loadActualTotalSavings();
      setShowCreateModal(false);
      toast.success('Group created successfully!');
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const handleJoinGroup = async (groupCode: string) => {
    try {
      const result = await groupService.joinGroup(groupCode);
      await loadUserGroups();
      setShowJoinModal(false);
      toast.success(result.message || 'Successfully joined the group!');
    } catch (error) {
      console.error('Failed to join group:', error);
      toast.error('Failed to join group. Please check the group code and try again.');
    }
  };

  const handleContribution = async (paymentMethod: string) => {
    if (!selectedGroupForContribution) return;
    
    try {
      await groupService.makeContribution(selectedGroupForContribution.id, paymentMethod);
      await loadUserGroups();
      setShowContributeModal(false);
      const groupName = selectedGroupForContribution.name;
      const amount = selectedGroupForContribution.savings_amount;
      setSelectedGroupForContribution(null);
      toast.success(`Contribution of ₹${amount} to "${groupName}" processed successfully!`);
    } catch (error) {
      console.error('Failed to process contribution:', error);
      toast.error('Failed to process contribution. Please try again.');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {userName ? `Welcome back, ${userName}!` : 'Savings Dashboard'}
        </h1>
        <p className="text-gray-600">Manage your savings groups and track your progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={stat.action}
            className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
              stat.action ? 'hover:scale-105 transform transition-transform' : ''
            }`}
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

      {/* Groups Section */}
      <div className="grid lg:grid-cols-1 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Savings Groups</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {groups.map((group) => (
              <div
                key={group.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => setSelectedGroup(selectedGroup?.id === group.id ? null : group)}
              >
                {/* Group Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{group.name}</h4>
                    <p className="text-sm text-gray-500">{group.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {group.savings_frequency}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Code: {group.group_code}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Monthly Contribution</p>
                    <p className="font-semibold">₹{group.savings_amount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Interest Rate</p>
                    <p className="font-semibold text-green-600">{group.interest_rate}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Duration</p>
                    <p className="font-semibold">{group.default_loan_duration} months</p>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedGroup?.id === group.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {/* Contribution Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Next Contribution Due</p>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-blue-600 mr-1" />
                          <span className="text-xs text-gray-500">September 15, 2025</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Amount Due</p>
                        <div className="flex items-center">
                          <ArrowDownLeft className="w-4 h-4 text-green-600 mr-1" />
                          <span className="font-medium">₹{group.savings_amount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - First Row */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button 
                        className="bg-purple-100 text-purple-700 px-3 py-2 rounded text-sm hover:bg-purple-200 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGroupForModal(group);
                          setShowHistoryModal(true);
                        }}
                      >
                        View History
                      </button>
                      <button 
                        className="bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGroupForModal(group);
                          setShowMembersModal(true);
                        }}
                      >
                        Show Members
                      </button>
                    </div>
                    
                    {/* Action Buttons - Second Row */}
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded text-sm hover:bg-indigo-200 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGroupForContribution(group);
                          setShowContributeModal(true);
                        }}
                      >
                        Add Contribution
                      </button>
                      <button 
                        className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGroupForModal(group);
                          setShowInviteModal(true);
                        }}
                      >
                        Invite Members
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {groups.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No groups yet</h4>
              <p className="text-gray-500">Join or create a group to start saving together</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateGroupSuccess}
      />

      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSuccess={handleCreateGroupSuccess}
      />

      {showContributeModal && selectedGroupForContribution && (
        <ContributeModal
          onClose={() => {
            setShowContributeModal(false);
            setSelectedGroupForContribution(null);
          }}
          onSubmit={handleContribution}
          amount={selectedGroupForContribution.savings_amount}
          groupName={selectedGroupForContribution.name}
        />
      )}

      {/* Group Members Modal */}
      {selectedGroupForModal && (
        <GroupMembersModal
          isOpen={showMembersModal}
          onClose={() => {
            setShowMembersModal(false);
            setSelectedGroupForModal(null);
          }}
          groupId={selectedGroupForModal.id.toString()}
          groupName={selectedGroupForModal.name}
        />
      )}

      {/* Group History Modal */}
      {selectedGroupForModal && (
        <GroupHistoryModal
          isOpen={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedGroupForModal(null);
          }}
          groupId={selectedGroupForModal.id.toString()}
          groupName={selectedGroupForModal.name}
        />
      )}

      {/* Invite Members Modal */}
      {selectedGroupForModal && (
        <InviteMembersModal
          isOpen={showInviteModal}
          onClose={() => {
            setShowInviteModal(false);
            setSelectedGroupForModal(null);
          }}
          groupId={selectedGroupForModal.id.toString()}
          groupName={selectedGroupForModal.name}
          groupCode={selectedGroupForModal.group_code}
        />
      )}
    </div>
  );
};

export default DashboardHome;
