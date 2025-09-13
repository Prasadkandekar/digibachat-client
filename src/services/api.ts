// src/services/api.ts
const API_BASE_URL = 'https://digibachat.onrender.com/api/auth';
const PASSWORD_API_BASE_URL = 'https://digibachat.onrender.com/api/password';
const GROUP_API_BASE_URL = 'https://digibachat.onrender.com/api/groups';
const TRANSACTION_API_BASE_URL = 'https://digibachat.onrender.com/api/transactions';
const LOAN_API_BASE_URL = 'https://digibachat.onrender.com/api/loans';

// const API_BASE_URL = 'https://digibachat-server.appwrite.network/api/auth';
// const PASSWORD_API_BASE_URL = 'https://digibachat-server.appwrite.network/api/password';
// const GROUP_API_BASE_URL = 'https://digibachat-server.appwrite.network/api/groups';
// const TRANSACTION_API_BASE_URL = 'https://digibachat-server.appwrite.network/api/transactions';
// const LOAN_API_BASE_URL = 'https://digibachat-server.appwrite.network/api/loans';


// const API_BASE_URL = 'http://localhost:5000/api/auth';
// const PASSWORD_API_BASE_URL = 'http://localhost:5000/api/password';
// const GROUP_API_BASE_URL = 'http://localhost:5000/api/groups';
// const TRANSACTION_API_BASE_URL = 'http://localhost:5000/api/transactions';
// const LOAN_API_BASE_URL = 'http://localhost:5000/api/loans';

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
  token?: string;
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
  private async request<T extends ApiResponse>(
    baseUrl: string,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    });

    // Merge headers from options if they exist
    if (options.headers) {
      const optionHeaders = new Headers(options.headers);
      optionHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    try {
      console.log('API Request:', {
        url: `${baseUrl}${endpoint}`,
        method: options.method || 'GET',
        headers: Object.fromEntries(headers.entries()),
        body: options.body ? JSON.parse(options.body as string) : undefined
      });

      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
        body: options.body
      });

      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return responseData as T;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials: LoginData): Promise<ApiResponse<LoginResponseData>> {
    try {
      const response = await this.request<ApiResponse<LoginResponseData>>(
        API_BASE_URL,
        '/login',
        {
          method: 'POST',
          body: JSON.stringify(credentials),
          credentials: 'include' as RequestCredentials
        }
      );

      // Store the token if it exists in the response
      if (response.token) {
        localStorage.setItem('token', response.token);
      } else if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }

      // Store user data if it exists in the response
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.message?.includes('401')) {
        localStorage.removeItem('token');
        throw new Error('Access denied. Invalid credentials.');
      }
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<LoginResponseData>> {
    try {
      const response = await this.request<ApiResponse<LoginResponseData>>(
        API_BASE_URL,
        '/register',
        {
          method: 'POST',
          body: JSON.stringify(userData),
        }
      );

      if (response.token) {
        localStorage.setItem('token', response.token);
      } else if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async verifyEmail(verificationData: VerifyEmailData): Promise<ApiResponse> {
    try {
      return await this.request<ApiResponse>(API_BASE_URL, '/verify-email', {
        method: 'POST',
        body: JSON.stringify(verificationData),
      });
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
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
      method: 'GET',
    });
  }

  async getLeaderGroups(): Promise<ApiResponse<GroupsResponseData>> {
    return this.request<ApiResponse<GroupsResponseData>>(GROUP_API_BASE_URL, '/my-leader-groups', {
      method: 'GET',
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

  // UPI Payment methods
  async generateUPIPayment(groupId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(TRANSACTION_API_BASE_URL, `/groups/${groupId}/upi-payment`, {
      method: 'POST'
    });
  }

  async verifyUPIPayment(transactionId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(TRANSACTION_API_BASE_URL, `/transactions/${transactionId}/verify-upi`, {
      method: 'GET'
    });
  }

  async updateGroupUPIDetails(groupId: string, upiId: string, upiName: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(TRANSACTION_API_BASE_URL, `/groups/${groupId}/upi-details`, {
      method: 'PUT',
      body: JSON.stringify({ upiId, upiName })
    });
  }

  async completeUPIPayment(transactionId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(TRANSACTION_API_BASE_URL, `/transactions/${transactionId}/complete-upi`, {
      method: 'POST'
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
    try {
      const response = await this.request<ApiResponse<{ loans: LoanRequest[] }>>(
        LOAN_API_BASE_URL, 
        `/groups/${groupId}/loans`, 
        { method: 'GET' }
      );

      console.log('Raw loan response:', response);

      // Ensure we always return the correct structure
      if (response && response.success === true) {
        const loans = Array.isArray(response.data?.loans) 
          ? response.data.loans 
          : [];
          
        return {
          success: true,
          message: response.message || 'Success',
          data: { loans }
        };
      }

      // Fallback for error cases
      return { 
        success: false, 
        message: response?.message || 'Failed to fetch loans',
        data: { loans: [] }
      };
      
    } catch (error) {
      console.error('Error fetching loan requests:', error);
      return {
        success: false,
        message: 'Failed to fetch loan requests',
        data: { loans: [] }
      };
    }
  }

  async getUserLoanRequests(): Promise<ApiResponse<{ loans: LoanRequest[] }>> {
    const response = await this.request<ApiResponse<{ loans: LoanRequest[] }>>(LOAN_API_BASE_URL, `/user/loans`, {
      method: 'GET'
    });
    
    // Ensure response.data exists and has a loans property
    if (response && response.data && Array.isArray(response.data)) {
      return {
        ...response,
        data: { loans: response.data },
      };
    }
    
    // Fallback to empty array if data is not in expected format
    return {
      ...response,
      data: { loans: [] },
    };
  }

  async approveLoanRequest(
    groupId: string, 
    loanId: string, 
    approvalData: { 
      dueDate: string; 
      interestRate: number; 
      paymentMethod: string; 
    }
  ): Promise<ApiResponse> {
    const requestBody = {
      dueDate: approvalData.dueDate,
      interestRate: approvalData.interestRate,
      paymentMethod: approvalData.paymentMethod
    };
    
    return this.request<ApiResponse>(
      LOAN_API_BASE_URL, 
      `/groups/${groupId}/loans/${loanId}/approve`, 
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );
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