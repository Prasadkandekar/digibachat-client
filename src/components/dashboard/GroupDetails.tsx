import React, { useState } from 'react';
import { UserPlus, Users, DollarSign } from 'lucide-react';
import GroupSavings from './GroupSavings';

interface Member {
  id: number;
  user_id: number;
  group_id: number;
  role: string;
  status: string;
  joined_at: string;
  name: string;
  email: string;
  phone: string;
}

interface GroupDetailsProps {
  group: {
    id: number;
    name: string;
    description: string;
    group_code: string;
    created_at: string;
    created_by: number;
    leader_name: string;
    leader_email: string;
  };
  members: Member[];
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ group, members }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'savings'>('overview');

  const tabs = [
    {
      id: 'overview' as const,
      name: 'Overview',
      icon: Users,
      description: 'Group information and members'
    },
    {
      id: 'savings' as const,
      name: 'Group Savings',
      icon: DollarSign,
      description: 'Member contributions and totals'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <tab.icon className={`w-4 h-4 mr-2 ${
                    isActive ? 'text-teal-500' : 'text-gray-400'
                  }`} />
                  {tab.name}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Group Info */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Group Information</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">{group.description}</p>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <p className="font-medium">{new Date(group.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Group Code:</span>
                      <p className="font-medium">{group.group_code}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Leader:</span>
                      <p className="font-medium">{group.leader_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Members:</span>
                      <p className="font-medium">{members.length}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-teal-700 font-medium">Group Status</span>
                  <span className="text-teal-900 font-bold text-lg">
                    Active
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
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Role</p>
                      <p className="text-sm font-medium text-gray-700 capitalize">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'savings' && (
          <GroupSavings 
            groupId={group.id} 
            groupName={group.name}
          />
        )}
      </div>
    </div>
  );
};

export default GroupDetails;
