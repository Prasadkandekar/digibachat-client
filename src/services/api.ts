// src/services/api.ts
const API_BASE_URL = 'https://digibachat.onrender.com/api/auth';
const PASSWORD_API_BASE_URL = 'https://digibachat.onrender.com/api/password';
// const API_BASE_URL = 'http://localhost:5000/api/auth';
// const PASSWORD_API_BASE_URL = 'http://localhost:5000/api/password';

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

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Ensure consistent response format
      if (data && typeof data === 'object' && !data.hasOwnProperty('success')) {
        data.success = true;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(credentials: LoginData): Promise<ApiResponse> {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<ApiResponse> {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyEmail(verifyData: VerifyEmailData): Promise<ApiResponse> {
    return this.request('/verify-email', {
      method: 'POST',
      body: JSON.stringify(verifyData),
    });
  }

  async resendOtp(email: string): Promise<ApiResponse> {
    return this.request('/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    const url = `${PASSWORD_API_BASE_URL}/forgot-password`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    if (data && typeof data === 'object' && !data.hasOwnProperty('success')) {
      data.success = true;
    }
    
    return data;
  }

  async resetPassword(resetData: ResetPasswordData): Promise<ApiResponse> {
    const url = `${PASSWORD_API_BASE_URL}/reset-password`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    if (data && typeof data === 'object' && !data.hasOwnProperty('success')) {
      data.success = true;
    }
    
    return data;
  }
}

export const apiService = new ApiService();