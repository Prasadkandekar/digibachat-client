import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Clock, UserPlus, AlertCircle } from 'lucide-react';
import { apiService, Group } from '../../services/api';

interface JoinRequest {
  id: number;
  user_name: string;
  user_email: string;
  status: string;
  requested_at: string;
  group_id: number;
}

interface GroupWithRequests {
  group: Group;
  requests: JoinRequest[];
}

interface JoinRequestsManagerProps {
  onRequestsUpdated?: (count: number) => void;
}

const JoinRequestsManager: React.FC<JoinRequestsManagerProps> = ({ onRequestsUpdated }) => {
  const [groupsWithRequests, setGroupsWithRequests] = useState<GroupWithRequests[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingRequest, setProcessingRequest] = useState<number | null>(null);

  useEffect(() => {
    fetchJoinRequests();
  }, []);

  const fetchJoinRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's groups where they are the leader
      const groupsResponse = await apiService.getLeaderGroups();
      console.log('Leader groups response:', groupsResponse);
      
      if (!groupsResponse.success || !groupsResponse.data?.groups) {
        throw new Error('Failed to fetch leader groups');
      }

      const leaderGroups = groupsResponse.data.groups;
      console.log('Leader groups:', leaderGroups);

      // Fetch join requests for each group where user is leader
      const groupsWithRequestsData: GroupWithRequests[] = [];
      
      for (const group of leaderGroups) {
        try {
          console.log(`Fetching requests for group ${group.id} (${group.name})`);
          const requestsResponse = await apiService.getJoinRequests(group.id.toString());
          console.log(`Requests response for group ${group.id}:`, requestsResponse);
          
          if (requestsResponse.success && requestsResponse.data?.requests) {
            const pendingRequests = requestsResponse.data.requests.filter(
              (req: JoinRequest) => req.status === 'pending'
            );
            console.log(`Pending requests for group ${group.id}:`, pendingRequests);
            
            if (pendingRequests.length > 0) {
              groupsWithRequestsData.push({
                group,
                requests: pendingRequests
              });
            }
          }
        } catch (err) {
          console.error(`Failed to fetch requests for group ${group.id}:`, err);
        }
      }

      setGroupsWithRequests(groupsWithRequestsData);
      
      // Notify parent component of total pending requests count
      const totalPendingRequests = groupsWithRequestsData.reduce(
        (total, groupWithRequests) => total + groupWithRequests.requests.length,
        0
      );
      onRequestsUpdated?.(totalPendingRequests);
    } catch (err) {
      setError('Failed to fetch join requests');
      console.error('Error fetching join requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserId = (): number | null => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Current user from localStorage:', user);
      console.log('User ID:', user?.id, 'Type:', typeof user?.id);
      return user?.id || null;
    } catch {
      return null;
    }
  };

  const handleApproveRequest = async (groupId: number, requestId: number) => {
    try {
      setProcessingRequest(requestId);
      await apiService.approveJoinRequest(groupId.toString(), requestId.toString());
      
      // Refresh the requests
      await fetchJoinRequests();
    } catch (err) {
      setError('Failed to approve request');
      console.error('Error approving request:', err);
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectRequest = async (groupId: number, requestId: number) => {
    try {
      setProcessingRequest(requestId);
      await apiService.rejectJoinRequest(groupId.toString(), requestId.toString());
      
      // Refresh the requests
      await fetchJoinRequests();
    } catch (err) {
      setError('Failed to reject request');
      console.error('Error rejecting request:', err);
    } finally {
      setProcessingRequest(null);
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

  const testDebugEndpoint = async () => {
    try {
      // Get user's leader groups first
      const groupsResponse = await apiService.getLeaderGroups();
      if (groupsResponse.success && groupsResponse.data?.groups) {
        const leaderGroups = groupsResponse.data.groups;
        
        if (leaderGroups.length > 0) {
          const group = leaderGroups[0]; // Test with first group
          console.log(`Testing debug endpoint for group ${group.id}`);
          
          // Test the no-auth debug endpoint
          const response = await fetch(`http://localhost:5000/api/groups/${group.id}/debug-join-requests-no-auth`);
          const data = await response.json();
          console.log('Debug endpoint response:', data);
          
          // Also test the regular endpoint
          const regularResponse = await apiService.getJoinRequests(group.id.toString());
          console.log('Regular endpoint response:', regularResponse);
        } else {
          console.log('No leader groups found');
        }
      }
    } catch (error) {
      console.error('Debug test error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
        <button
          onClick={fetchJoinRequests}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (groupsWithRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No pending join requests</h3>
        <p className="text-gray-500">
          You don't have any pending join requests for your groups at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Join Requests</h2>
          <p className="text-gray-600">Manage pending requests to join your groups</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchJoinRequests}
            className="flex items-center px-4 py-2 text-teal-600 border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors"
          >
            <Users className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={testDebugEndpoint}
            className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Debug
          </button>
        </div>
      </div>

      {groupsWithRequests.map(({ group, requests }) => (
        <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                <p className="text-sm text-gray-500">{group.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  <Clock className="w-3 h-3 mr-1" />
                  {requests.length} pending
                </span>
                <span className="text-sm text-gray-500">Code: {group.group_code}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{request.user_name}</h4>
                        <p className="text-sm text-gray-500">{request.user_email}</p>
                        <p className="text-xs text-gray-400">
                          Requested on {formatDate(request.requested_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApproveRequest(group.id, request.id)}
                      disabled={processingRequest === request.id}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingRequest === request.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectRequest(group.id, request.id)}
                      disabled={processingRequest === request.id}
                      className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingRequest === request.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JoinRequestsManager;
