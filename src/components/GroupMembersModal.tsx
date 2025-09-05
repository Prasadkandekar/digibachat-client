import React, { useState, useEffect } from 'react';
import { X, Users, Crown, Calendar, IndianRupee } from 'lucide-react';
import { apiService, GroupMember } from '../services/api';

interface GroupMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

interface MemberWithDetails extends GroupMember {
  user_name: string;
  user_email: string;
  role: 'leader' | 'member';
}

const GroupMembersModal: React.FC<GroupMembersModalProps> = ({
  isOpen,
  onClose,
  groupId,
  groupName
}) => {
  const [members, setMembers] = useState<MemberWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && groupId) {
      fetchMembers();
    }
  }, [isOpen, groupId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.getGroupMembers(groupId);
      if (response.success && response.data?.members) {
        const membersWithDetails = response.data.members.map(member => ({
          ...member,
          role: member.is_leader ? 'leader' as const : 'member' as const
        }));
        setMembers(membersWithDetails);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch group members');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Group Members</h2>
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

        {/* Content */}
        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-medium">Error loading members</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {members.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No members found</h3>
                  <p className="text-gray-500">This group doesn't have any members yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                      {members.length} member{members.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  {members.map((member) => (
                    <div
                      key={member.user_id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {member.user_name ? member.user_name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900">{member.user_name || 'Unknown User'}</h4>
                              {member.role === 'leader' && (
                                <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                  <Crown className="w-3 h-3" />
                                  <span>Leader</span>
                                </div>
                              )}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                member.status === 'approved' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {member.status === 'approved' ? 'Active' : 'Pending'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{member.user_email || 'No email provided'}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            <span className="font-medium">
                              {formatCurrency(member.current_balance || 0)}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>Joined {formatDate(member.joined_at)}</span>
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
              Total members: <span className="font-medium">{members.length}</span>
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

export default GroupMembersModal;
