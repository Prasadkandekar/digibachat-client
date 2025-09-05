import React from 'react';

interface JoinRequest {
  id: number;
  user_name: string;
  user_email: string;
  status: string;
}

interface JoinRequestsProps {
  requests: JoinRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const JoinRequests: React.FC<JoinRequestsProps> = ({ requests, onApprove, onReject }) => {
  if (requests.length === 0) {
    return <p className="text-gray-500">No pending join requests.</p>;
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 mb-2">Join Requests</h4>
      {requests.map((request) => (
        <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">{request.user_name}</p>
            <p className="text-sm text-gray-500">{request.user_email}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onApprove(request.id.toString())}
              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(request.id.toString())}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JoinRequests;
