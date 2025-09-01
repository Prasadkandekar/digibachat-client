import React from 'react';
import { IndianRupee, Calendar, Users, UserPlus } from 'lucide-react';

interface Member {
  name: string;
  phone: string;
  lastContribution: string;
}

interface GroupDetailsProps {
  group: {
    name: string;
    description: string;
    createdDate: string;
    contributionAmount: string;
    frequency: string;
    nextDueDate: string;
    totalContributions: string;
    members: Member[];
  };
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ group }) => {
  return (
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
                <p className="font-medium">{group.createdDate}</p>
              </div>
              <div>
                <span className="text-gray-500">Contribution:</span>
                <p className="font-medium">{group.contributionAmount}</p>
              </div>
              <div>
                <span className="text-gray-500">Frequency:</span>
                <p className="font-medium">{group.frequency}</p>
              </div>
              <div>
                <span className="text-gray-500">Next Due:</span>
                <p className="font-medium">{group.nextDueDate}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-teal-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-teal-700 font-medium">Total Contributions</span>
            <span className="text-teal-900 font-bold text-lg">
              {group.totalContributions}
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
          {group.members.map((member, index) => (
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
  );
};

export default GroupDetails;
