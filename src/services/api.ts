import { ApiResponse, User, Tribute, CreateTributeForm } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // User endpoints
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/user/me');
  }

  async updateUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/user/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Tribute endpoints
  async getTributes(): Promise<ApiResponse<Tribute[]>> {
    return this.request<Tribute[]>('/tributes');
  }

  async getTributeById(id: string): Promise<ApiResponse<Tribute>> {
    return this.request<Tribute>(`/tributes/${id}`);
  }

  async createTribute(tributeData: CreateTributeForm): Promise<ApiResponse<Tribute>> {
    return this.request<Tribute>('/tributes', {
      method: 'POST',
      body: JSON.stringify(tributeData),
    });
  }

  async updateTribute(id: string, tributeData: Partial<Tribute>): Promise<ApiResponse<Tribute>> {
    return this.request<Tribute>(`/tributes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tributeData),
    });
  }

  async deleteTribute(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/tributes/${id}`, {
      method: 'DELETE',
    });
  }

  // User tributes
  async getUserTributes(userId: number): Promise<ApiResponse<Tribute[]>> {
    return this.request<Tribute[]>(`/users/${userId}/tributes`);
  }

  async getReceivedTributes(): Promise<ApiResponse<Tribute[]>> {
    return this.request<Tribute[]>('/tributes/received');
  }

  async getGivenTributes(): Promise<ApiResponse<Tribute[]>> {
    return this.request<Tribute[]>('/tributes/given');
  }
}

export const apiService = new ApiService();
export default apiService; 