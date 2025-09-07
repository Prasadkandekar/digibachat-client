// src/services/api.ts
// const API_BASE_URL = 'https://digibachat.onrender.com/api/auth';
// const PASSWORD_API_BASE_URL = 'https://digibachat.onrender.com/api/password';
// const GROUP_API_BASE_URL = 'https://digibachat.onrender.com/api/groups';
// const TRANSACTION_API_BASE_URL = 'https://digibachat.onrender.com/api/transactions';
// const LOAN_API_BASE_URL = 'https://digibachat.onrender.com/api/loans';

const API_BASE_URL = 'http://localhost:5000/api/auth';
const PASSWORD_API_BASE_URL = 'http://localhost:5000/api/password';
const GROUP_API_BASE_URL = 'http://localhost:5000/api/groups';
const TRANSACTION_API_BASE_URL = 'http://localhost:5000/api/transactions';
const LOAN_API_BASE_URL = 'http://localhost:5000/api/loans';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
  newPassword: string;
  confirmPassword: string;
  token?: string;
}

export interface CreateGroupFormData {
  name: string;
  description: string;
  contributionAmount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly';
}

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
  created_by: number;
  role?: string; // 'leader' | 'member'
  member_status?: string; // 'approved' | 'pending'
  joined_at?: string;
  is_leader?: boolean;
}

export interface GroupMember {
  user_id: number;
  group_id: number;
  joined_at: string;
  is_leader: boolean;
  current_balance: number;
  status: 'approved' | 'pending';
  user_name: string;
  user_email: string;
}

export interface LoanRequest {
  id: number;
  user_id: number;
  group_id: number;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'repaid';
  created_at: string;
  due_date: string | null;
  interest_rate: number | null;
  penalty_amount: number | null;
  repayment_status: 'not_started' | 'partial' | 'complete';
  user_name?: string;
  user_email?: string;
}

export interface CreateGroupData {
  name: string;
  description: string;
  savings_frequency: 'weekly' | 'monthly';
  savings_amount: number;
  interest_rate: number;
  default_loan_duration: number;
}

// Response Interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
}

export interface LoginResponseData {
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface GroupsResponseData {
  groups: Group[];
}

export interface GroupResponseData {
  group: Group;
  members?: GroupMember[];
}

export interface JoinRequestsResponseData {
  requests: any[];
}

export interface CreateGroupResponseData {
  group: Group;
  group_code: string;
  shareable_link: string;
}

export interface JoinGroupResponseData {
  group: {
    id: number;
    name: string;
  };
  requires_approval: boolean;
}

class ApiService {
  async request<T extends ApiResponse>(
  baseUrl: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${baseUrl}${endpoint}`;
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers as HeadersInit),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    const text = await response.text(); // get raw response
    let data: any;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      // Not JSON → wrap in an object
      data = { success: false, message: text };
    }

    if (response.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Access denied. No token provided.');
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${text}`);
    }

    return data as T;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

  //  async request<T extends ApiResponse>(baseUrl: string, endpoint: string, options: RequestInit = {}): Promise<T> {
  //   const url = `${baseUrl}${endpoint}`;
  //   console.log('Preparing request to:', url);
  //   const token = localStorage.getItem('token');
  //   console.log('Retrieved token:', token ? token.substring(0, 20) + '...' : 'No token found');
  //   console.log('Making request to:', url);
  //   console.log('Token exists:', !!token);

  //   const headers: HeadersInit = {
  //     'Content-Type': 'application/json',
  //     ...(token && { 'Authorization': `Bearer ${token}` }),
  //     ...(options.headers as HeadersInit),
  //   };
  //   console.log('Request headers:', headers);

  //   try {
  //     const response = await fetch(url, {
  //       ...options,
  //       headers,
  //         credentials: 'include',
  //     });
      
  //     console.log('Response status:', response.status);

  //     // Handle unauthorized responses
  //     if (response.status === 401) {
  //       localStorage.removeItem('token');
  //       throw new Error('Access denied. No token provided.');
  //     }

  //     const data: T = await response.json();
  //     console.log('Response data:', data);

  //     if (!response.ok) {
  //       throw new Error(data.message || 'Something went wrong');
  //     }

  //     return data;
  //   } catch (error) {
  //     console.error('API Request Error:', error);
  //     throw error;
  //   }
  // }

  // Auth
  async login(credentials: LoginData): Promise<ApiResponse<LoginResponseData>> {
    try {
      const response = await this.request<ApiResponse<LoginResponseData>>(API_BASE_URL, '/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Store the token if it exists in the response
      if (response.token) {
        localStorage.setItem('token', response.token);
        console.log('Token stored successfully:', response.token.substring(0, 20) + '...');
      } else if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token stored from data object:', response.data.token.substring(0, 20) + '...');
      } else {
        console.warn('No token received in login response');
      }

      // Store user data if it exists in the response
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('User data stored successfully:', response.data.user);
      } else {
        console.warn('No user data received in login response');
      }

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<LoginResponseData>> {
    try {
      const response = await this.request<ApiResponse<LoginResponseData>>(API_BASE_URL, '/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      // Some APIs return token on registration too
      if (response.token) {
        localStorage.setItem('token', response.token);
        console.log('Token stored after registration:', response.token.substring(0, 20) + '...');
      } else if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token stored from data after registration:', response.data.token.substring(0, 20) + '...');
      }

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async verifyEmail(verifyData: VerifyEmailData): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_BASE_URL, '/verify-email', {
      method: 'POST',
      body: JSON.stringify(verifyData),
    });
  }

  async resendOtp(email: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(API_BASE_URL, '/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Password
  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(PASSWORD_API_BASE_URL, '/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(resetData: ResetPasswordData): Promise<ApiResponse> {
    return this.request<ApiResponse>(PASSWORD_API_BASE_URL, '/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  }
  
  // Groups
  async createGroup(groupData: CreateGroupData): Promise<ApiResponse<CreateGroupResponseData>> {
    return this.request<ApiResponse<CreateGroupResponseData>>(GROUP_API_BASE_URL, '/', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }
  
  async getUserGroups(): Promise<ApiResponse<GroupsResponseData>> {
    return this.request<ApiResponse<GroupsResponseData>>(GROUP_API_BASE_URL, '/my-groups', {
      method: 'GET'
    });
  }

  async getLeaderGroups(): Promise<ApiResponse<GroupsResponseData>> {
    return this.request<ApiResponse<GroupsResponseData>>(GROUP_API_BASE_URL, '/my-leader-groups', {
      method: 'GET'
    });
  }

  async joinGroup(groupCode: string): Promise<ApiResponse<JoinGroupResponseData>> {
    return this.request<ApiResponse<JoinGroupResponseData>>(GROUP_API_BASE_URL, `/join/${groupCode}`, {
      method: 'POST'
    });
  }

  async getGroup(groupId: string): Promise<ApiResponse<GroupResponseData>> {
    return this.request<ApiResponse<GroupResponseData>>(GROUP_API_BASE_URL, `/${groupId}`, {
      method: 'GET'
    });
  }

  async getGroupMembers(groupId: string): Promise<ApiResponse<{ members: GroupMember[] }>> {
    return this.request<ApiResponse<{ members: GroupMember[] }>>(GROUP_API_BASE_URL, `/${groupId}/members`, {
      method: 'GET'
    });
  }

  async getJoinRequests(groupId: string): Promise<ApiResponse<JoinRequestsResponseData>> {
    return this.request<ApiResponse<JoinRequestsResponseData>>(GROUP_API_BASE_URL, `/${groupId}/join-requests`, {
      method: 'GET'
    });
  }

  async approveJoinRequest(groupId: string, requestId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(GROUP_API_BASE_URL, `/${groupId}/join-requests/${requestId}/approve`, {
      method: 'POST',
    });
  }

  async rejectJoinRequest(groupId: string, requestId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(GROUP_API_BASE_URL, `/${groupId}/join-requests/${requestId}/reject`, {
      method: 'POST',
    });
  }
  
  async removeMember(groupId: string, userId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(GROUP_API_BASE_URL, `/${groupId}/members/${userId}`, {
      method: 'DELETE'
    });
  }

  async leaveGroup(groupId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(GROUP_API_BASE_URL, `/${groupId}/leave`, {
      method: 'DELETE',
    });
  }

  async updateGroup(groupId: string, groupData: Partial<CreateGroupData>): Promise<ApiResponse<GroupResponseData>> {
    return this.request<ApiResponse<GroupResponseData>>(GROUP_API_BASE_URL, `/${groupId}`, {
      method: 'PUT',
      body: JSON.stringify(groupData),
    });
  }

  async deleteGroup(groupId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(GROUP_API_BASE_URL, `/${groupId}`, {
      method: 'DELETE',
    });
  }

  async makeContribution(groupId: string, paymentMethod: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(GROUP_API_BASE_URL, `/${groupId}/contribute`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethod })
    });
  }

  async getGroupTransactions(groupId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(GROUP_API_BASE_URL, `/${groupId}/transactions`, {
      method: 'GET'
    });
  }

  async getUserTransactions(): Promise<ApiResponse> {
    return this.request<ApiResponse>(TRANSACTION_API_BASE_URL, `/user/transactions`, {
      method: 'GET'
    });
  }

  // Loan endpoints
  async createLoanRequest(groupId: string, loanData: { amount: number, purpose: string }): Promise<ApiResponse> {
    return this.request<ApiResponse>(LOAN_API_BASE_URL, `/groups/${groupId}/loans`, {
      method: 'POST',
      body: JSON.stringify(loanData)
    });
  }

  async getGroupLoanRequests(groupId: string): Promise<ApiResponse<{ loans: LoanRequest[] }>> {
    return this.request<ApiResponse<{ loans: LoanRequest[] }>>(LOAN_API_BASE_URL, `/groups/${groupId}/loans`, {
      method: 'GET'
    });
  }

  async getUserLoanRequests(): Promise<ApiResponse<{ loans: LoanRequest[] }>> {
    return this.request<ApiResponse<{ loans: LoanRequest[] }>>(LOAN_API_BASE_URL, `/user/loans`, {
      method: 'GET'
    });
  }

  async approveLoanRequest(groupId: string, loanId: string, approvalData: { due_date: string, interest_rate: number }): Promise<ApiResponse> {
    return this.request<ApiResponse>(LOAN_API_BASE_URL, `/groups/${groupId}/loans/${loanId}/approve`, {
      method: 'PUT',
      body: JSON.stringify(approvalData)
    });
  }

  async rejectLoanRequest(groupId: string, loanId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(LOAN_API_BASE_URL, `/groups/${groupId}/loans/${loanId}/reject`, {
      method: 'PUT'
    });
  }

  async makeLoanRepayment(loanId: string, repaymentData: { amount: number }): Promise<ApiResponse> {
    return this.request<ApiResponse>(LOAN_API_BASE_URL, `/loans/${loanId}/repay`, {
      method: 'POST',
      body: JSON.stringify(repaymentData)
    });
  }

  async applyLoanPenalty(groupId: string, loanId: string, penaltyData: { amount: number }): Promise<ApiResponse> {
    return this.request<ApiResponse>(LOAN_API_BASE_URL, `/groups/${groupId}/loans/${loanId}/penalty`, {
      method: 'PUT',
      body: JSON.stringify(penaltyData)
    });
  }

  async getOverdueLoans(groupId: string): Promise<ApiResponse<{ loans: LoanRequest[] }>> {
    return this.request<ApiResponse<{ loans: LoanRequest[] }>>(LOAN_API_BASE_URL, `/groups/${groupId}/loans/overdue`, {
      method: 'GET'
    });
  }

  async getUpcomingContributions(): Promise<ApiResponse> {
    return this.request<ApiResponse>(TRANSACTION_API_BASE_URL, `/user/upcoming-contributions`, {
      method: 'GET'
    });
  }

  async getGroupSavingsSummary(groupId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(TRANSACTION_API_BASE_URL, `/groups/${groupId}/savings-summary`, {
      method: 'GET'
    });
  }

  async getUserTotalSavings(): Promise<ApiResponse> {
    return this.request<ApiResponse>(TRANSACTION_API_BASE_URL, `/user/total-savings`, {
      method: 'GET'
    });
  }

  async getUserContributions(): Promise<ApiResponse> {
    return this.request<ApiResponse>(TRANSACTION_API_BASE_URL, `/user/contributions`, {
      method: 'GET'
    });
  }

  // Utility method to check authentication
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Utility method to logout
  logout(): void {
    localStorage.removeItem('token');
    console.log('User logged out, token removed');
  }

  async getCurrentUser(): Promise<ApiResponse<LoginResponseData>> {
    return this.request<ApiResponse<LoginResponseData>>(API_BASE_URL, '/me', {
      method: 'GET'
    });
  }

  // Utility method to get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const apiService = new ApiService();