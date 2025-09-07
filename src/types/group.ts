export interface Group {
  id: number;
  name: string;
  description: string;
  group_code: string;
  created_at: string;
  savings_frequency: 'weekly' | 'monthly';
  savings_amount: number;
  interest_rate: number;
  default_loan_duration: number;
  leader_id: number;
  created_by: number;
  role?: string; // 'leader' | 'member'
  member_status?: string; // 'approved' | 'pending'
  joined_at?: string;
  is_leader?: boolean;
  total_savings?: number; // Total savings amount for the group
  // Add any additional fields that might come from your API
  contributionAmount?: number;
  frequency?: 'weekly' | 'monthly' | 'quarterly';
}

export interface GroupMember {
  user_id: number;
  group_id: number;
  joined_at: string;
  is_leader: boolean;
  current_balance: number;
}

export interface CreateGroupData {
  name: string;
  description: string;
  savings_frequency: 'weekly' | 'monthly';
  savings_amount: number;
  interest_rate: number;
  default_loan_duration: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
}