import React, { useState, useEffect } from 'react';
import { DollarSign, AlertCircle, Users, CreditCard } from 'lucide-react';
import { Group } from '../../types/group';
import { groupService } from '../../services/groupService';
import GroupLoans from './GroupLoans';
import { useToast } from '../../contexts/ToastContext';

const Loans: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const toast = useToast();

  useEffect(() => {
    loadUserGroups();
  }, []);

  const loadUserGroups = async () => {
    try {
      setLoading(true);
      const userGroups = await groupService.getMyGroups();
      setGroups(userGroups);
    } catch (error) {
      console.error('Failed to load groups:', error);
      setError('Failed to load your groups. Please refresh the page.');
      toast.error('Failed to load your groups. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-start">
        <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Loan Management</h1>
        <p className="text-gray-600">Request and manage loans across your savings groups</p>
      </div>

      {groups.length > 0 ? (
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-500">{group.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {group.savings_frequency}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Code: {group.group_code}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <GroupLoans groupId={group.id.toString()} isLeader={group.is_leader || false} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No groups to request loans from</h4>
          <p className="text-gray-500 mb-6">Join or create a group to access loan features</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;