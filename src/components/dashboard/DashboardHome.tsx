import React, { useState, useEffect } from 'react';

const calculateNextContributionDate = (frequency: string): string => {
  const today = new Date();
  let nextDate = new Date(today);
  
  if (frequency === 'weekly') {
    // Set to next week
    nextDate.setDate(today.getDate() + 7);
  } else if (frequency === 'monthly') {
    // Set to next month
    nextDate.setMonth(today.getMonth() + 1);
  }
  
  // Format the date as DD/MM/YYYY
  return nextDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
import { Link } from 'react-router-dom';
import { 
  PiggyBank, 
  Users, 
  Plus, 
  UserPlus,
  Search,
  CreditCard,
  Percent,
  Wallet,
  Clock as Calendar,
  History
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
  const [userContributions, setUserContributions] = useState<{[key: string]: number}>({});
  const [activeLoanHolders, setActiveLoanHolders] = useState<{[key: string]: string}>({});
  const [pendingLoanRequests, setPendingLoanRequests] = useState<{[key: string]: any[]}>({});
  const toast = useToast();

  useEffect(() => {
    loadUserGroups();
    loadActualTotalSavings();
    loadUserName();
    loadUserContributions();
    loadPendingLoanRequests();
  }, []);

  const loadPendingLoanRequests = async () => {
    try {
      console.log('Loading pending loan requests...');
      // First, get all groups where the user is a member
      const groupsResponse = await apiService.getUserGroups();
      
      if (!groupsResponse.success || !groupsResponse.data?.groups) {
        console.log('Failed to load user groups');
        return;
      }

      console.log('User groups loaded:', groupsResponse.data.groups);
      const requests: {[key: string]: any[]} = {};
      
      // Filter groups where the user is a leader
      const leaderGroups = groupsResponse.data.groups.filter(
        (group: any) => group.is_leader || group.role === 'leader' || group.created_by === JSON.parse(localStorage.getItem('user') || '{}')?.id
      );

      console.log(`Found ${leaderGroups.length} leader groups`);
      
      // Process each leader group to get pending loan requests
      for (const group of leaderGroups) {
        try {
          console.log(`Fetching loan requests for group ${group.id} (${group.name})`);
          try {
            const response = await apiService.getGroupLoanRequests(group.id.toString());
            console.log(`Loan requests for group ${group.id} (${group.name}):`, response);
            
            if (!response.success) {
              console.error('Failed to fetch loan requests:', response.message || 'No error message');
              return;
            }
            
            // The loans are in response.data.loans
            const loans = response.data?.loans || [];
            console.log(`Raw loans data for group ${group.id}:`, loans);
            
            if (!Array.isArray(loans)) {
              console.error(`Expected loans to be an array, got:`, typeof loans);
              return;
            }
            
            const pendingLoans = loans.filter((loan: any) => {
              const isPending = loan.status === 'pending';
              if (isPending) {
                console.log('Found pending loan:', loan);
              }
              return isPending;
            });
            
            console.log(`Found ${pendingLoans.length} pending loans for group ${group.id} (${group.name})`);
            
            if (pendingLoans.length > 0) {
              requests[group.id] = pendingLoans.map((loan: any) => {
                // Ensure amount is a number and handle null/undefined cases
                const amount = loan.amount ? parseFloat(loan.amount) : 0;
                return {
                  id: loan.id,
                  group_id: loan.group_id,
                  user_id: loan.user_id,
                  amount: amount,
                  purpose: loan.purpose || 'No purpose specified',
                  status: loan.status || 'pending',
                  requested_at: loan.requested_at || loan.created_at || new Date().toISOString(),
                  user_name: loan.user_name || 'Unknown User',
                  user_email: loan.user_email || '',
                  // Include any other required fields with defaults
                  ...(loan.repayment_status && { repayment_status: loan.repayment_status }),
                  ...(loan.due_date && { due_date: loan.due_date })
                };
              });
            }
          } catch (error) {
            console.error(`Error fetching loans for group ${group.id}:`, error);
          }
        } catch (groupError) {
          console.error(`Error processing group ${group.id}:`, groupError);
        }
      }
      
      console.log('Setting pending loan requests:', requests);
      setPendingLoanRequests(requests);
    } catch (error) {
      console.error('Failed to load pending loan requests:', error);
      toast.error('Failed to load pending loan requests');
    }
  };
  
  const loadUserContributions = async () => {
    try {
      const response = await apiService.getUserContributions();
      if (response.success && response.data) {
        const contributions: {[key: string]: number} = {};
        response.data.contributions.forEach((contribution: any) => {
          contributions[contribution.group_id] = contribution.total_amount || 0;
        });
        setUserContributions(contributions);
      }
    } catch (error) {
      console.error('Failed to load user contributions:', error);
    }
  };

  const loadUserName = async () => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.success && response.data?.user) {
        setUserName(response.data.user.name);
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
      
      // Load active loan holders for each group
      const loanHoldersMap: {[key: string]: string} = {};
      for (const group of userGroups) {
        try {
          const loansResponse = await apiService.getGroupLoanRequests(group.id.toString());
          if (loansResponse.success && loansResponse.data?.loans) {
            const activeLoans = loansResponse.data.loans.filter(
              (loan: any) => loan.status === 'approved' && loan.repayment_status === 'pending'
            );
            if (activeLoans.length > 0) {
              loanHoldersMap[group.id] = activeLoans[0].user_name || 'Unknown';
            }
          }
        } catch (err) {
          console.error(`Failed to load loans for group ${group.id}:`, err);
        }
      }
      setActiveLoanHolders(loanHoldersMap);
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
      title: 'Loan Management',
      value: 'View',
      icon: CreditCard,
      color: 'bg-red-500',
      description: 'Request and manage loans'
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
      color: 'bg-teal-500',
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
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

      {/* Pending Loan Requests for Group Leaders */}
      {Object.keys(pendingLoanRequests).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Pending Loan Requests</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(pendingLoanRequests).map(([groupId, loans]) => {
              const group = groups.find(g => g.id.toString() === groupId);
              if (!group) return null;
              
              return (
                <div key={groupId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">{group.name}</h4>
                    <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                      {loans.length} {loans.length === 1 ? 'Request' : 'Requests'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {loans.map((loan) => (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{loan.user_name || 'Member'}</p>
                          <p className="text-sm text-gray-600">₹{loan.amount} • {loan.purpose}</p>
                          {loan.status !== 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                              loan.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : loan.status === 'rejected' 
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }">
                              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {loan.status === 'pending' ? (
                            <>
                              <button 
                                onClick={async () => {
                                  try {
                                    await apiService.approveLoanRequest(
                                      groupId, 
                                      loan.id.toString(),
                                      { 
                                        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                                        interestRate: group.interest_rate || 10,
                                        paymentMethod: 'group_funds'
                                      }
                                    );
                                    await loadPendingLoanRequests();
                                    toast.success('Loan request approved successfully!');
                                  } catch (error: any) {
                                    console.error('Failed to approve loan:', error);
                                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to approve loan request';
                                    toast.error(errorMessage);
                                  }
                                }}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={async () => {
                                  try {
                                    await apiService.rejectLoanRequest(groupId, loan.id.toString());
                                    await loadPendingLoanRequests();
                                    toast.success('Loan request rejected');
                                  } catch (error: any) {
                                    console.error('Failed to reject loan:', error);
                                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to reject loan request';
                                    toast.error(errorMessage);
                                  }
                                }}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">
                              {loan.status === 'approved' 
                                ? 'Approved' 
                                : loan.status === 'rejected' 
                                  ? 'Rejected' 
                                  : 'Processed'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Groups Section - WhatsApp Style */}
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {groups.map((group) => (
              <div
                key={group.id}
                className={`whatsapp-group-card ${selectedGroup?.id === group.id ? 'border-l-8' : ''}`}
                onClick={() => setSelectedGroup(selectedGroup?.id === group.id ? null : group)}
              >
                <div className="whatsapp-group-header">
                  <div className="whatsapp-group-avatar">
                    {group.name.charAt(0)}
                  </div>
                  <div className="whatsapp-group-info">
                    <h3 className="whatsapp-group-name">{group.name}</h3>
                    <p className="whatsapp-group-description">{group.description}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {group.savings_frequency === 'weekly' ? 'Weekly' : 'Monthly'}
                  </span>
                </div>
                
                {/* Quick Stats */}
                <div className="whatsapp-group-stats">
                  <div className="whatsapp-group-stat">
                    <CreditCard size={14} className="text-primary" />
                    <div>
                      <div className="whatsapp-group-stat-label">Contribution</div>
                      <div className="whatsapp-group-stat-value">₹{group.savings_amount} / {group.savings_frequency}</div>
                    </div>
                  </div>
                  <div className="whatsapp-group-stat">
                    <Percent size={14} className="text-primary" />
                    <div>
                      <div className="whatsapp-group-stat-label">Interest Rate</div>
                      <div className="whatsapp-group-stat-value">{group.interest_rate}%</div>
                    </div>
                  </div>
                  <div className="whatsapp-group-stat">
                    <PiggyBank size={14} className="text-primary" />
                    <div>
                      <div className="whatsapp-group-stat-label">Total Savings</div>
                      <div className="whatsapp-group-stat-value">₹{(group.total_savings || 0).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="whatsapp-group-stat">
                    <Wallet size={14} className="text-primary" />
                    <div>
                      <div className="whatsapp-group-stat-label">Your Contribution</div>
                      <div className="whatsapp-group-stat-value">₹{(userContributions[group.id] || 0).toLocaleString()}</div>
                    </div>
                  </div>
                  {activeLoanHolders[group.id] && (
                    <div className="whatsapp-group-stat col-span-2">
                      <CreditCard size={14} className="text-primary" />
                      <div>
                        <div className="whatsapp-group-stat-label">Current Loan Holder</div>
                        <div className="whatsapp-group-stat-value">{activeLoanHolders[group.id]}</div>
                      </div>
                    </div>
                  )}
                  <div className="whatsapp-group-stat">
                    <Calendar size={14} className="text-primary" />
                    <div>
                      <div className="whatsapp-group-stat-label">Next Contribution</div>
                      <div className="whatsapp-group-stat-value">{calculateNextContributionDate(group.savings_frequency)}</div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                {selectedGroup?.id === group.id && (
                  <div className="whatsapp-group-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHistoryModal(true);
                        setSelectedGroupForModal(group);
                      }}
                      className="whatsapp-group-action-btn"
                    >
                      <History size={16} />
                      <span>History</span>
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMembersModal(true);
                        setSelectedGroupForModal(group);
                      }}
                      className="whatsapp-group-action-btn"
                    >
                      <Users size={16} />
                      <span>Members</span>
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowContributeModal(true);
                        setSelectedGroupForContribution(group);
                      }}
                      className="whatsapp-group-action-btn whatsapp-group-action-primary"
                    >
                      <PiggyBank size={16} />
                      <span>Contribute</span>
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInviteModal(true);
                        setSelectedGroupForModal(group);
                      }}
                      className="whatsapp-group-action-btn"
                    >
                      <UserPlus size={16} />
                      <span>Invite</span>
                    </button>
                    
                    <Link 
                      to="/dashboard/loans"
                      onClick={(e) => e.stopPropagation()}
                      className="whatsapp-group-action-btn"
                    >
                      <CreditCard size={16} />
                      <span>Manage Loans</span>
                    </Link>
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
