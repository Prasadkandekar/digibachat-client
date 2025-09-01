// src/services/api.ts
const API_BASE_URL = 'https://digibachat.onrender.com/api/auth';
const PASSWORD_API_BASE_URL = 'https://digibachat.onrender.com/api/password';
const GROUP_API_BASE_URL = 'https://digibachat.onrender.com/api/groups';

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

export interface CreateGroupData {
  name: string;
  description: string;
  contributionAmount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly';
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
}

class ApiService {
  private async request<T>(baseUrl: string, endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${baseUrl}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (data && typeof data === 'object' && !data.hasOwnProperty('success')) {
        data.success = true;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth
  async login(credentials: LoginData): Promise<ApiResponse> {
    return this.request(API_BASE_URL, '/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<ApiResponse> {
    return this.request(API_BASE_URL, '/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyEmail(verifyData: VerifyEmailData): Promise<ApiResponse> {
    return this.request(API_BASE_URL, '/verify-email', {
      method: 'POST',
      body: JSON.stringify(verifyData),
    });
  }

  async resendOtp(email: string): Promise<ApiResponse> {
    return this.request(API_BASE_URL, '/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Password
  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request(PASSWORD_API_BASE_URL, '/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(resetData: ResetPasswordData): Promise<ApiResponse> {
    return this.request(PASSWORD_API_BASE_URL, '/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  }
  
  // Groups
  async createGroup(groupData: CreateGroupData): Promise<ApiResponse> {
    return this.request(GROUP_API_BASE_URL, '/', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }
  
  async getUserGroups(): Promise<ApiResponse> {
    return this.request(GROUP_API_BASE_URL, '/my-groups', {
        method: 'GET'
    });
  }

  async joinGroup(groupCode: string): Promise<ApiResponse> {
    return this.request(GROUP_API_BASE_URL, `/join/${groupCode}`, {
      method: 'POST',
    });
  }

  async getGroup(groupId: string): Promise<ApiResponse> {
    return this.request(GROUP_API_BASE_URL, `/${groupId}`, {
        method: 'GET'
    });
  }

  async getJoinRequests(groupId: string): Promise<ApiResponse> {
    return this.request(GROUP_API_BASE_URL, `/${groupId}/join-requests`, {
        method: 'GET'
    });
  }

  async approveJoinRequest(groupId: string, requestId: string): Promise<ApiResponse> {
    return this.request(GROUP_API_BASE_URL, `/${groupId}/join-requests/${requestId}/approve`, {
      method: 'POST',
    });
  }

  async rejectJoinRequest(groupId: string, requestId: string): Promise<ApiResponse> {
    return this.request(GROUP_API_BASE_URL, `/${groupId}/join-requests/${requestId}/reject`, {
      method: 'POST',
    });
  }
  
  async removeMember(groupId: string, userId: string): Promise<ApiResponse> {
      return this.request(GROUP_API_BASE_URL, `/${groupId}/members/${userId}`, {
          method: 'DELETE'
        });
    }

  async leaveGroup(groupId: string): Promise<ApiResponse> {
    return this.request(GROUP_API_BASE_URL, `/${groupId}/leave`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
