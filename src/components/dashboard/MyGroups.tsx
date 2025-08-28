import React, { useState } from 'react';
import { Users, IndianRupee, Calendar, Copy, Eye, Settings, UserPlus } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  members: number;
  balance: string;
  nextPayment: string;
  code: string;
}

interface MyGroupsProps {
  groups: Group[];
}

const MyGroups: React.FC<MyGroupsProps> = ({ groups }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const groupDetails = {
    '1': {
      description: 'Monthly family savings for emergency fund and future investments',
      createdDate: '2024-10-15',
      contributionAmount: '₹2,000',
      frequency: 'Monthly',
      nextDueDate: '2025-02-01',
      totalContributions: '₹24,000',
      members: [
        { name: 'Rajesh Kumar', phone: '+91-9876543210', lastContribution: '2025-01-01' },
        { name: 'Priya Sharma', phone: '+91-9876543211', lastContribution: '2025-01-01' },
        { name: 'Amit Patel', phone: '+91-9876543212', lastContribution: '2025-01-01' },
        { name: 'Sunita Gupta', phone: '+91-9876543213', lastContribution: '2025-01-01' },
        { name: 'Vikram Singh', phone: '+91-9876543214', lastContribution: '2025-01-01' },
        { name: 'Meera Joshi', phone: '+91-9876543215', lastContribution: '2025-01-01' },
        { name: 'Ravi Agarwal', phone: '+91-9876543216', lastContribution: '2025-01-01' },
        { name: 'Kavita Reddy', phone: '+91-9876543217', lastContribution: '2025-01-01' },
      ]
    },
    '2': {
      description: 'Friends group for vacation and entertainment expenses',
      createdDate: '2024-11-20',
      contributionAmount: '₹1,500',
      frequency: 'Monthly',
      nextDueDate: '2025-02-01',
      totalContributions: '₹9,000',
      members: [
        { name: 'Arjun Mehta', phone: '+91-9876543220', lastContribution: '2025-01-01' },
        { name: 'Neha Kapoor', phone: '+91-9876543221', lastContribution: '2025-01-01' },
        { name: 'Rohit Verma', phone: '+91-9876543222', lastContribution: '2025-01-01' },
        { name: 'Pooja Nair', phone: '+91-9876543223', lastContribution: '2025-01-01' },
        { name: 'Karan Malhotra', phone: '+91-9876543224', lastContribution: '2025-01-01' },
      ]
    },
    '3': {
      description: 'Office colleagues group for team events and celebrations',
      createdDate: '2024-12-01',
      contributionAmount: '₹3,000',
      frequency: 'Monthly',
      nextDueDate: '2025-02-01',
      totalContributions: '₹36,000',
      members: [
        { name: 'Deepak Kumar', phone: '+91-9876543230', lastContribution: '2025-01-01' },
        { name: 'Anjali Singh', phone: '+91-9876543231', lastContribution: '2025-01-01' },
        { name: 'Manoj Tiwari', phone: '+91-9876543232', lastContribution: '2025-01-01' },
        { name: 'Rekha Jain', phone: '+91-9876543233', lastContribution: '2025-01-01' },
        { name: 'Suresh Yadav', phone: '+91-9876543234', lastContribution: '2025-01-01' },
        { name: 'Geeta Sharma', phone: '+91-9876543235', lastContribution: '2025-01-01' },
        { name: 'Ramesh Gupta', phone: '+91-9876543236', lastContribution: '2025-01-01' },
        { name: 'Sita Devi', phone: '+91-9876543237', lastContribution: '2025-01-01' },
        { name: 'Mukesh Agarwal', phone: '+91-9876543238', lastContribution: '2025-01-01' },
        { name: 'Lata Mishra', phone: '+91-9876543239', lastContribution: '2025-01-01' },
        { name: 'Vinod Kumar', phone: '+91-9876543240', lastContribution: '2025-01-01' },
        { name: 'Shanti Devi', phone: '+91-9876543241', lastContribution: '2025-01-01' },
      ]
    }
  };

  return (
    <div className="space-y-6">
      {/* Groups Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}
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
                  <span className="text-sm">{group.members} members</span>
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
                  <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{group.code}</code>
                  <button
                    onClick={() => handleCopyCode(group.code)}
                    className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {copiedCode === group.code && (
                    <span className="text-xs text-green-600">Copied!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Group Details */}
      {selectedGroup && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {groups.find(g => g.id === selectedGroup)?.name} - Details
            </h3>
            <button
              onClick={() => setSelectedGroup(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          {groupDetails[selectedGroup as keyof typeof groupDetails] && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Group Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Group Information</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      {groupDetails[selectedGroup as keyof typeof groupDetails].description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <p className="font-medium">{groupDetails[selectedGroup as keyof typeof groupDetails].createdDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Contribution:</span>
                        <p className="font-medium">{groupDetails[selectedGroup as keyof typeof groupDetails].contributionAmount}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Frequency:</span>
                        <p className="font-medium">{groupDetails[selectedGroup as keyof typeof groupDetails].frequency}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Next Due:</span>
                        <p className="font-medium">{groupDetails[selectedGroup as keyof typeof groupDetails].nextDueDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-teal-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-teal-700 font-medium">Total Contributions</span>
                    <span className="text-teal-900 font-bold text-lg">
                      {groupDetails[selectedGroup as keyof typeof groupDetails].totalContributions}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Members List */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Members</h4>
                  <button className="flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Invite Member
                  </button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {groupDetails[selectedGroup as keyof typeof groupDetails].members.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Last contribution</p>
                        <p className="text-sm font-medium text-gray-700">{member.lastContribution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Backend Integration Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-2">
          Backend Integration - My Groups
        </h4>
        <p className="text-blue-800 mb-4">
          This page is ready for backend integration with the following API endpoints:
        </p>
        <div className="bg-white rounded-lg p-4 font-mono text-sm">
          <div className="space-y-2">
            <div>• <strong>GET</strong> /api/groups - Fetch user's groups</div>
            <div>• <strong>GET</strong> /api/groups/{'{groupId}'} - Fetch group details</div>
            <div>• <strong>GET</strong> /api/groups/{'{groupId}'}/members - Fetch group members</div>
            <div>• <strong>POST</strong> /api/groups/{'{groupId}'}/invite - Invite new member</div>
            <div>• <strong>PUT</strong> /api/groups/{'{groupId}'} - Update group settings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGroups;