import { Group, CreateGroupData } from '../types/group';
import { apiService } from './api';

export const groupService = {
  // Get all groups for the current user
  getMyGroups: async (): Promise<Group[]> => {
    try {
      // Check authentication first
      if (!apiService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const response = await apiService.getUserGroups();
      if (response.success && response.data?.groups) {
        return response.data.groups;
      }
      throw new Error(response.message || 'Failed to fetch groups');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch groups');
    }
  },

  // Get groups where user is a leader
  getLeaderGroups: async (): Promise<Group[]> => {
    try {
      // Check authentication first
      if (!apiService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const response = await apiService.getLeaderGroups();
      if (response.success && response.data?.groups) {
        return response.data.groups;
      }
      throw new Error(response.message || 'Failed to fetch leader groups');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch leader groups');
    }
  },

  // Get a single group by ID
  getGroup: async (id: number): Promise<Group> => {
    try {
      const response = await apiService.getGroup(id.toString());
      if (response.success && response.data?.group) {
        return response.data.group;
      }
      throw new Error(response.message || 'Failed to fetch group');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch group');
    }
  },

  // Create a new group
  createGroup: async (groupData: CreateGroupData): Promise<{group: Group, group_code: string, shareable_link: string}> => {
    try {
      const response = await apiService.createGroup(groupData);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create group');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create group');
    }
  },

  // Join a group using code
  joinGroup: async (groupCode: string): Promise<{ message: string, requires_approval: boolean, group?: { id: number, name: string } }> => {
    try {
      const response = await apiService.joinGroup(groupCode);
      if (response.success) {
        return { 
          message: response.message,
          requires_approval: response.data?.requires_approval || false,
          group: response.data?.group 
        };
      }
      throw new Error(response.message || 'Failed to join group');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to join group');
    }
  },

  // Get join requests for a group
  getJoinRequests: async (groupId: number): Promise<any[]> => {
    try {
      const response = await apiService.getJoinRequests(groupId.toString());
      if (response.success && response.data?.requests) {
        return response.data.requests;
      }
      throw new Error(response.message || 'Failed to fetch join requests');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch join requests');
    }
  },

  // Approve join request
  approveJoinRequest: async (groupId: number, requestId: number): Promise<void> => {
    try {
      const response = await apiService.approveJoinRequest(groupId.toString(), requestId.toString());
      if (!response.success) {
        throw new Error(response.message || 'Failed to approve join request');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to approve join request');
    }
  },

  // Reject join request
  rejectJoinRequest: async (groupId: number, requestId: number): Promise<void> => {
    try {
      const response = await apiService.rejectJoinRequest(groupId.toString(), requestId.toString());
      if (!response.success) {
        throw new Error(response.message || 'Failed to reject join request');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to reject join request');
    }
  },

  // Get group by code (public)
  getGroupByCode: async (groupCode: string): Promise<Group> => {
    try {
      const response = await apiService.request<any>(
        'https://digibachat.onrender.com/api/groups',
        `/public/${groupCode}`,
        { method: 'GET' }
      );
      if (response.success && response.data?.group) {
        return response.data.group;
      }
      throw new Error(response.message || 'Failed to fetch group');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch group');
    }
  },

  // Make a contribution to a group
  makeContribution: async (groupId: number, paymentMethod: string): Promise<void> => {
    try {
      const response = await apiService.makeContribution(groupId.toString(), paymentMethod);
      if (!response.success) {
        throw new Error(response.message || 'Failed to process contribution');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to process contribution');
    }
  },

  // Get transaction history for a group
  getGroupTransactions: async (groupId: number): Promise<any[]> => {
    try {
      const response = await apiService.getGroupTransactions(groupId.toString());
      if (response.success && response.data?.transactions) {
        return response.data.transactions;
      }
      throw new Error(response.message || 'Failed to fetch transactions');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch transactions');
    }
  },

  // Get user's transaction history
  getUserTransactions: async (): Promise<any[]> => {
    try {
      const response = await apiService.getUserTransactions();
      if (response.success && response.data?.transactions) {
        return response.data.transactions;
      }
      throw new Error(response.message || 'Failed to fetch transactions');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch transactions');
    }
  },

  // Get upcoming contributions
  getUpcomingContributions: async (): Promise<any[]> => {
    try {
      const response = await apiService.getUpcomingContributions();
      if (response.success && response.data?.upcomingContributions) {
        return response.data.upcomingContributions;
      }
      throw new Error(response.message || 'Failed to fetch upcoming contributions');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch upcoming contributions');
    }
  }
};