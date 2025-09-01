import React, { useState, useEffect } from 'react';
import { Users, IndianRupee, Calendar, Copy, Eye, Settings, UserPlus, ShieldCheck } from 'lucide-react';
import { apiService } from '../../services/api';
import GroupDetails from './GroupDetails';
import JoinRequests from './JoinRequests';

interface Group {
  _id: string;
  name: string;
  members: any[];
  balance: string;
  nextPayment: string;
  groupCode: string;
  leader: any;
}

interface MyGroupsProps {}

const MyGroups: React.FC<MyGroupsProps> = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndGroups = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUserId(user?._id);
        
        const response = await apiService.getUserGroups();
        if (response.success) {
          setGroups(response.data);
        }
      } catch (err) {
        setError('Failed to fetch groups.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserAndGroups();
  }, []);

  const handleSelectGroup = async (group: Group) => {
    if (selectedGroup?._id === group._id) {
      setSelectedGroup(null);
      setGroupDetails(null);
      setJoinRequests([]);
      return;
    }

    setSelectedGroup(group);
    setIsLoading(true);
    try {
      const detailsRes = await apiService.getGroup(group._id);
      if (detailsRes.success) {
        setGroupDetails(detailsRes.data);
      }

      if (group.leader._id === currentUserId) {
        const requestsRes = await apiService.getJoinRequests(group._id);
        if (requestsRes.success) {
          setJoinRequests(requestsRes.data);
        }
      }
    } catch (err) {
      setError('Failed to fetch group details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApprove = async (requestId: string) => {
    try {
      await apiService.approveJoinRequest(selectedGroup!._id, requestId);
      setJoinRequests(joinRequests.filter(r => r._id !== requestId));
    } catch (err) {
      setError('Failed to approve request');
    }
  }
  
  const handleReject = async (requestId: string) => {
    try {
      await apiService.rejectJoinRequest(selectedGroup!._id, requestId);
      setJoinRequests(joinRequests.filter(r => r._id !== requestId));
    } catch (err) {
      setError('Failed to reject request');
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSelectGroup(group)}
                  className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">{group.members.length} members</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{group.balance}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Next payment</span>
                </div>
                <span className="text-sm font-medium text-teal-600">{group.nextPayment}</span>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-gray-500">Group Code:</span>
                <div className="flex items-center space-x-2">
                  <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{group.groupCode}</code>
                  <button
                    onClick={() => handleCopyCode(group.groupCode)}
                    className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {copiedCode === group.groupCode && (
                    <span className="text-xs text-green-600">Copied!</span>
                  )}
                </div>
              </div>
              {group.leader._id === currentUserId && (
                <div className="flex items-center text-xs text-green-600 pt-2">
                    <ShieldCheck className="w-4 h-4 mr-1" />
                    You are the leader of this group
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedGroup && groupDetails && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedGroup.name} - Details
            </h3>
            <button
              onClick={() => setSelectedGroup(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <GroupDetails group={groupDetails} />
          {selectedGroup.leader._id === currentUserId && (
            <div className="mt-8">
              <JoinRequests requests={joinRequests} onApprove={handleApprove} onReject={handleReject}/>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyGroups;
